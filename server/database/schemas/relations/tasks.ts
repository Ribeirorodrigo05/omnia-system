import { relations } from "drizzle-orm";
import { tasks } from "../tasks";
import { users } from "../users";
import { categories } from "../categories";
import { taskAssignments } from "../task-assignments";
import { taskCategories } from "../task-categories";

// === TASK RELATIONS ===
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  // N:1 - Proprietário da task
  owner: one(users, {
    fields: [tasks.ownerId],
    references: [users.id],
    relationName: "task_owner",
  }),

  // N:1 - Categoria principal da task
  primaryCategory: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
    relationName: "category_primary_tasks",
  }),

  // 1:N - Assignments da task (via task_assignments)
  assignments: many(taskAssignments, {
    relationName: "task_assignments",
  }),

  // N:N - Relação many-to-many com categorias via taskCategories
  taskCategories: many(taskCategories, {
    relationName: "task_category_relations",
  }),
}));
