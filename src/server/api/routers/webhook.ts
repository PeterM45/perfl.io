import { createTRPCRouter, publicProcedure } from "../trpc";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const webhookRouter = createTRPCRouter({
  clerkEvent: publicProcedure
    .input(
      z.object({
        payload: z.string(),
        svix_id: z.string(),
        svix_timestamp: z.string(),
        svix_signature: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Missing webhook secret",
        });
      }

      const wh = new Webhook(WEBHOOK_SECRET);
      let evt: WebhookEvent;

      try {
        evt = wh.verify(input.payload, {
          "svix-id": input.svix_id,
          "svix-timestamp": input.svix_timestamp,
          "svix-signature": input.svix_signature,
        }) as WebhookEvent;
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid webhook signature",
        });
      }

      switch (evt.type) {
        case "user.created": {
          const { id, email_addresses, username, image_url } = evt.data;
          await ctx.db.insert(users).values({
            id,
            email: email_addresses[0]?.email_address,
            username: username ?? id.slice(0, 8),
            imageUrl: image_url,
            authProvider:
              (email_addresses[0]?.verification?.strategy as
                | "email"
                | "google"
                | "github"
                | "linkedin") || "email",
          });
          break;
        }

        case "user.updated": {
          const { id, email_addresses, username, image_url } = evt.data;
          await ctx.db
            .update(users)
            .set({
              email: email_addresses[0]?.email_address,
              username: username ?? id.slice(0, 8),
              imageUrl: image_url,
              updatedAt: new Date(),
            })
            .where(eq(users.id, id));
          break;
        }

        case "user.deleted": {
          const { id } = evt.data;
          if (id) {
            await ctx.db.delete(users).where(eq(users.id, id));
          }
          break;
        }
      }

      return { success: true };
    }),
});
