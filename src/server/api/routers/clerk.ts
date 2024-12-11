import { createTRPCRouter, publicProcedure } from "../trpc";
import { users } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { Webhook } from "svix";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const clerkRouter = createTRPCRouter({
  webhook: publicProcedure
    .input(
      z.object({
        type: z.string(),
        data: z.object({
          id: z.string(),
          email_addresses: z
            .array(z.object({ email_address: z.string() }))
            .optional(),
          username: z.string().optional(),
          image_url: z.string().optional(),
          primary_email_address_id: z.string().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Handle different webhook events
      switch (input.type) {
        case "user.created":
          await ctx.db.insert(users).values({
            id: input.data.id,
            email: input.data.email_addresses?.[0]?.email_address,
            username: input.data.username ?? "",
            authProvider: input.data.primary_email_address_id
              ? "email"
              : "google",
            imageUrl: input.data.image_url,
          });
          break;

        case "user.updated":
          await ctx.db
            .update(users)
            .set({
              email: input.data.email_addresses?.[0]?.email_address,
              username: input.data.username ?? "",
              imageUrl: input.data.image_url,
              updatedAt: new Date(),
            })
            .where(eq(users.id, input.data.id));
          break;

        case "user.deleted":
          await ctx.db.delete(users).where(eq(users.id, input.data.id));
          break;
      }

      return { success: true };
    }),
});
