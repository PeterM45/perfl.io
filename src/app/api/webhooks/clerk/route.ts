import { headers } from "next/headers";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";

interface UserWebhookData {
  id: string;
  email_addresses: Array<{
    email_address: string;
    verification?: {
      strategy: string;
    } | null;
  }>;
  username: string | null;
  image_url: string | null;
  password_enabled?: boolean;
  external_accounts?: Array<{
    provider: string;
  }>;
}

const getAuthProvider = (userData: UserWebhookData) => {
  if (userData.password_enabled) return "email";
  // Check external accounts
  if (userData.external_accounts?.[0]?.provider === "google") return "google";
  if (userData.external_accounts?.[0]?.provider === "github") return "github";
  if (userData.external_accounts?.[0]?.provider === "linkedin")
    return "linkedin";
  return "oauth"; // fallback
};

const generateUsername = (id: string) => {
  return `user_${id.slice(0, 4)}${Date.now().toString().slice(-4)}`;
};

export async function POST(req: Request): Promise<Response> {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Missing webhook secret", { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Log headers to see what we're getting
  console.log("Webhook Headers:", {
    svix_id,
    svix_timestamp,
    svix_signature,
  });

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing svix headers", { status: 400 });
  }

  // Get the body
  const payload: unknown = await req.json();
  console.log("Webhook Payload:", payload);
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }

  // Handle the webhook
  try {
    const eventData = evt.data as UserWebhookData;
    const { id, email_addresses, username, image_url } = eventData;

    switch (evt.type) {
      case "user.created": {
        await db.insert(users).values({
          id,
          email: email_addresses[0]?.email_address,
          username: username ?? generateUsername(id),
          imageUrl: image_url,
          authProvider: getAuthProvider(eventData),
        });
        break;
      }

      case "user.updated": {
        await db
          .update(users)
          .set({
            email: email_addresses[0]?.email_address,
            username: username ?? generateUsername(id),
            imageUrl: image_url,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id));
        break;
      }

      case "user.deleted": {
        await db.delete(users).where(eq(users.id, id));
        break;
      }
    }

    return new Response("Success", { status: 200 });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response(
      `Error processing webhook: ${err instanceof Error ? err.message : "Unknown error"}`,
      { status: 500 },
    );
  }
}
