import { relations } from "drizzle-orm";
import { users } from "./users";
import { workspaces } from "./workspaces";
import { workspaceMembers } from "./workspace-members";
import { spaces } from "./spaces";
import { spaceMembers } from "./space-members";
import { categories } from "./categories";
import { tasks } from "./tasks";
import { taskAssignments } from "./task-assignments";
import { taskCategories } from "./task-categories";

// === USER RELATIONS ===
export const usersRelations = relations(users, ({ many }) => ({
  // 1:N - Workspaces que o usuário possui (como owner)
  ownedWorkspaces: many(workspaces, {
    relationName: "workspace_owner",
  }),

  // N:N - Memberships em workspaces (via workspace_members)
  workspaceMemberships: many(workspaceMembers, {
    relationName: "user_workspace_memberships",
  }),

  // 1:N - Spaces criados pelo usuário (como creator)
  createdSpaces: many(spaces, {
    relationName: "space_creator",
  }),

  // N:N - Memberships em spaces (via space_members)
  spaceMemberships: many(spaceMembers, {
    relationName: "user_space_memberships",
  }),

  // 1:N - Categorias criadas pelo usuário (como owner)
  ownedCategories: many(categories, {
    relationName: "category_owner",
  }),

  // 1:N - Tasks criadas pelo usuário (como owner)
  ownedTasks: many(tasks, {
    relationName: "task_owner",
  }),

  // N:N - Assignments de tasks (via task_assignments)
  taskAssignments: many(taskAssignments, {
    relationName: "user_task_assignments",
  }),
}));

// === WORKSPACE RELATIONS ===
export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
  // N:1 - Proprietário do workspace
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
    relationName: "workspace_owner",
  }),

  // 1:N - Membros do workspace (via workspace_members)
  members: many(workspaceMembers, {
    relationName: "workspace_members",
  }),

  // 1:N - Spaces dentro do workspace
  spaces: many(spaces, {
    relationName: "workspace_spaces",
  }),
}));

// === WORKSPACE MEMBERS RELATIONS ===
export const workspaceMembersRelations = relations(
  workspaceMembers,
  ({ one }) => ({
    // N:1 - Workspace ao qual pertence
    workspace: one(workspaces, {
      fields: [workspaceMembers.workspaceId],
      references: [workspaces.id],
      relationName: "workspace_members",
    }),

    // N:1 - Usuário membro
    user: one(users, {
      fields: [workspaceMembers.userId],
      references: [users.id],
      relationName: "user_workspace_memberships",
    }),
  })
);

// === SPACE RELATIONS ===
export const spacesRelations = relations(spaces, ({ one, many }) => ({
  // N:1 - Workspace ao qual pertence
  workspace: one(workspaces, {
    fields: [spaces.workspaceId],
    references: [workspaces.id],
    relationName: "workspace_spaces",
  }),

  // N:1 - Usuário que criou o space
  creator: one(users, {
    fields: [spaces.createdBy],
    references: [users.id],
    relationName: "space_creator",
  }),

  // 1:N - Membros do space (via space_members)
  members: many(spaceMembers, {
    relationName: "space_members",
  }),

  // 1:N - Categorias dentro do space
  categories: many(categories, {
    relationName: "space_categories",
  }),
}));

// === SPACE MEMBERS RELATIONS ===
export const spaceMembersRelations = relations(spaceMembers, ({ one }) => ({
  // N:1 - Space ao qual pertence
  space: one(spaces, {
    fields: [spaceMembers.spaceId],
    references: [spaces.id],
    relationName: "space_members",
  }),

  // N:1 - Usuário membro
  user: one(users, {
    fields: [spaceMembers.userId],
    references: [users.id],
    relationName: "user_space_memberships",
  }),
}));

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

// === TASK ASSIGNMENT RELATIONS ===
export const taskAssignmentsRelations = relations(
  taskAssignments,
  ({ one }) => ({
    // N:1 - Task assignada
    task: one(tasks, {
      fields: [taskAssignments.taskId],
      references: [tasks.id],
      relationName: "task_assignments",
    }),

    // N:1 - Usuário assignado
    user: one(users, {
      fields: [taskAssignments.userId],
      references: [users.id],
      relationName: "user_task_assignments",
    }),
  })
);

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
