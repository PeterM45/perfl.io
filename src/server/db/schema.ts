// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  text,
  boolean,
  pgEnum,
  pgTable,
} from "drizzle-orm/pg-core";

// Auth providers enum
export const authProviderEnum = pgEnum("auth_provider", [
  "email",
  "google",
  "github",
  "linkedin",
]);

export const users = pgTable(
  "user",
  {
    id: varchar("id", { length: 256 }).primaryKey(), // Clerk ID
    email: varchar("email", { length: 256 }).unique(), // Optional since they might use social login
    username: varchar("username", { length: 64 }).notNull().unique(),
    displayName: varchar("display_name", { length: 256 }),
    bio: text("bio"),
    authProvider: authProviderEnum("auth_provider").notNull(),
    imageUrl: text("image_url"), // Profile picture from social or uploaded
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => ({
    emailIdx: index("email_idx").on(table.email),
    usernameIdx: index("username_idx").on(table.username),
  }),
);

export const posts = pgTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);
