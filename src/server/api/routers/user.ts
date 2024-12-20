import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const updateProfileSchema = z.object({
  userId: z.string(),
  firstName: z.string().min(1).max(64).optional(),
  lastName: z.string().min(1).max(64).optional(),
  bio: z.string().max(500).optional(),
  imageUrl: z.string().url().optional(),
});

export const userRouter = createTRPCRouter({
  getProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.query.users.findFirst({
          where: (users) => eq(users.id, input.userId),
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user profile",
        });
      }
    }),

  updateProfile: publicProcedure
    .input(updateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId, ...updateData } = input;

      try {
        // Check if user exists first
        const existingUser = await ctx.db.query.users.findFirst({
          where: (users) => eq(users.id, userId),
        });

        if (!existingUser) {
          // If user doesn't exist, create a new record
          const newUser = await ctx.db.insert(users).values({
            id: userId,
            firstName: updateData.firstName,
            lastName: updateData.lastName,
            bio: updateData.bio,
            imageUrl: updateData.imageUrl,
            authProvider: "oauth", // default value, adjust as needed
            username: "user_" + userId.slice(0, 8), // temporary username, adjust as needed
            isActive: true,
          });

          return newUser;
        }

        // Update existing user
        await ctx.db
          .update(users)
          .set({
            ...updateData,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));

        // Fetch and return updated user
        const updatedUser = await ctx.db.query.users.findFirst({
          where: (users) => eq(users.id, userId),
        });

        if (!updatedUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Failed to fetch updated user",
          });
        }

        return updatedUser;
      } catch (error) {
        console.error("Error updating user:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }
    }),
});
