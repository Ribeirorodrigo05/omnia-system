import {
  pgTable,
  uuid,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { tasks } from "./tasks";
import { categories } from "./categories";

export const taskCategories = pgTable(
  "task_categories",
  {
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Primary key composta
    primaryKey({ columns: [table.taskId, table.categoryId] }),

    // Índices para FKs (já que não temos PK única)
    index("task_categories_task_id_idx").on(table.taskId),
    index("task_categories_category_id_idx").on(table.categoryId),

    // Índice para timestamp
    index("task_categories_created_at_idx").on(table.createdAt),
  ]
);
