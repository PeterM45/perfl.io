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

export async function POST(req: Request): Promise<Response> {
  console.log("Webhook received"); // Debug point 1

  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Missing webhook secret", { status: 500 });
  }

  try {
    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    console.log("Headers received:", {
      // Debug point 2
      svix_id,
      svix_timestamp,
      svix_signature,
    });

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.error("Missing required headers"); // Debug point 3
      return new Response(
        JSON.stringify({ error: "Missing required headers" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
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
      console.log("Webhook verified successfully"); // Debug point 5
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response(
        JSON.stringify({ error: "Invalid webhook signature" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Handle the webhook
    try {
      const eventType = evt.type;
      const eventData = evt.data as UserWebhookData;

      console.log("Processing event type:", eventType); // Debug point 6
      console.log("Event data:", eventData);
      const { id, email_addresses, username, image_url } = eventData;

      switch (evt.type) {
        case "user.created": {
          await db.insert(users).values({
            id,
            email: email_addresses[0]?.email_address,
            username: username!,
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
              username: username!,
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

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error processing webhook:", err);
      return new Response(
        JSON.stringify({
          error: "Webhook processing error",
          details: err instanceof Error ? err.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({
        error: "Unexpected error",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
