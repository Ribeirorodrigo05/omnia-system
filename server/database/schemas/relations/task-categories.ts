import { relations } from "drizzle-orm";
import { taskCategories } from "../task-categories";
import { tasks } from "../tasks";
import { categories } from "../categories";

// === TASK CATEGORIES RELATIONS (Many-to-Many) ===
export const taskCategoriesRelations = relations(taskCategories, ({ one }) => ({
  // N:1 - Task
  task: one(tasks, {
    fields: [taskCategories.taskId],
    references: [tasks.id],
    relationName: "task_category_relations",
  }),

  // N:1 - Categoria
  category: one(categories, {
    fields: [taskCategories.categoryId],
    references: [categories.id],
    relationName: "category_task_relations",
  }),
}));
