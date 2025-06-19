import { relations } from "drizzle-orm";
import { users } from "../users";
import { workspaces } from "../workspaces";
import { workspaceMembers } from "../workspace-members";
import { spaces } from "../spaces";
import { spaceMembers } from "../space-members";
import { categories } from "../categories";
import { tasks } from "../tasks";
import { taskAssignments } from "../task-assignments";

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
