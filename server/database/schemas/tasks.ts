import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  storyPoints: integer("story_points"),
  priority: varchar("priority", { length: 20 }),
  status: varchar("status", { length: 30 }).default("BACKLOG").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  startedAt: timestamp("started_at"),
  endsAt: timestamp("ends_at"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});
