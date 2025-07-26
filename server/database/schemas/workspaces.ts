import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    index("workspaces_name_idx").on(table.name),
    index("workspaces_created_at_idx").on(table.createdAt),
    uniqueIndex("workspaces_owner_id_idx").on(table.ownerId),
  ],
);
