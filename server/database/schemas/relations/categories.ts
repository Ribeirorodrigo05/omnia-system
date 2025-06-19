import { relations } from "drizzle-orm";
import { categories } from "../categories";
import { spaces } from "../spaces";
import { users } from "../users";
import { tasks } from "../tasks";
import { taskCategories } from "../task-categories";

// === CATEGORY RELATIONS ===
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  // N:1 - Space ao qual pertence
  space: one(spaces, {
    fields: [categories.spaceId],
    references: [spaces.id],
    relationName: "space_categories",
  }),

  // N:1 - Proprietário da categoria
  owner: one(users, {
    fields: [categories.ownerId],
    references: [users.id],
    relationName: "category_owner",
  }),

  // 1:N - Tasks nesta categoria (categoria principal)
  primaryTasks: many(tasks, {
    relationName: "category_primary_tasks",
  }),

  // N:N - Relação many-to-many com tasks via taskCategories
  taskCategories: many(taskCategories, {
    relationName: "category_task_relations",
  }),
}));
