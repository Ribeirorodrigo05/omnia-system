import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
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
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.categoryId] }),
  })
);
