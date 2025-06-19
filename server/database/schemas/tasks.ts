import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";

export const tasks = pgTable(
  "tasks",
  {
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
  },
  (table) => [
    // Índices para FKs
    index("tasks_owner_id_idx").on(table.ownerId),
    index("tasks_category_id_idx").on(table.categoryId),

    // Índices para consultas frequentes
    index("tasks_status_idx").on(table.status),
    index("tasks_priority_idx").on(table.priority),
    index("tasks_is_active_idx").on(table.isActive),
    index("tasks_name_idx").on(table.name),

    // Índices para datas
    index("tasks_created_at_idx").on(table.createdAt),
    index("tasks_started_at_idx").on(table.startedAt),
    index("tasks_ends_at_idx").on(table.endsAt),

    // Índices compostos para consultas comuns
    index("tasks_category_status_idx").on(table.categoryId, table.status),
    index("tasks_owner_status_idx").on(table.ownerId, table.status),
    index("tasks_category_sort_idx").on(table.categoryId, table.sortOrder),
  ]
);
