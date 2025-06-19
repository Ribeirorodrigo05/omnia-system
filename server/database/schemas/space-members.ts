import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { spaces } from "./spaces";

export const spaceMembers = pgTable("space_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  spaceId: uuid("space_id")
    .notNull()
    .references(() => spaces.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  invitedAt: timestamp("invited_at").defaultNow().notNull(),
  joinedAt: timestamp("joined_at"),
  isActive: boolean("is_active").default(true).notNull(),
  permissions: jsonb("permissions"),
});
