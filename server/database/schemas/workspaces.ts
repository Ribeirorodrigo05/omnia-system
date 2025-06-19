import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    settings: jsonb("settings"),
  },
  (table) => [
    // Índices para FKs e consultas frequentes
    index("workspaces_owner_id_idx").on(table.ownerId),
    index("workspaces_is_active_idx").on(table.isActive),
    index("workspaces_created_at_idx").on(table.createdAt),
    index("workspaces_name_idx").on(table.name),
  ]
);
