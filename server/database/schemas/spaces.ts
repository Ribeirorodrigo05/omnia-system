import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const spaces = pgTable(
  "spaces",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isPrivate: boolean("is_private").default(false).notNull(),
    sortOrder: integer("sort_order").default(0).notNull(),
    settings: jsonb("settings"),
  },
  (table) => [
    // Índices para FKs
    index("spaces_workspace_id_idx").on(table.workspaceId),
    index("spaces_created_by_idx").on(table.createdBy),

    // Índices para consultas frequentes
    index("spaces_is_active_idx").on(table.isActive),
    index("spaces_is_private_idx").on(table.isPrivate),
    index("spaces_name_idx").on(table.name),

    // Índices compostos
    index("spaces_workspace_active_idx").on(table.workspaceId, table.isActive),
    index("spaces_workspace_sort_idx").on(table.workspaceId, table.sortOrder),
  ]
);
