import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Import all schemas
import { users } from "./users";
import { workspaces } from "./workspaces";
import { workspaceMembers } from "./workspace-members";
import { spaces } from "./spaces";
import { spaceMembers } from "./space-members";
import { categories } from "./categories";
import { tasks } from "./tasks";
import { taskAssignments } from "./task-assignments";
import { taskCategories } from "./task-categories";

// Import all relations from modular structure
import {
  usersRelations,
  workspacesRelations,
  workspaceMembersRelations,
  spacesRelations,
  spaceMembersRelations,
  categoriesRelations,
  tasksRelations,
  taskAssignmentsRelations,
  taskCategoriesRelations,
} from "./relations";

// Export all schemas
export {
  users,
  workspaces,
  workspaceMembers,
  spaces,
  spaceMembers,
  categories,
  tasks,
  taskAssignments,
  taskCategories,
};

// Export all relations
export {
  usersRelations,
  workspacesRelations,
  workspaceMembersRelations,
  spacesRelations,
  spaceMembersRelations,
  categoriesRelations,
  tasksRelations,
  taskAssignmentsRelations,
  taskCategoriesRelations,
};

// Create schema object with relations
export const schema = {
  // Tables
  users,
  workspaces,
  workspaceMembers,
  spaces,
  spaceMembers,
  categories,
  tasks,
  taskAssignments,
  taskCategories,

  // Relations
  usersRelations,
  workspacesRelations,
  workspaceMembersRelations,
  spacesRelations,
  spaceMembersRelations,
  categoriesRelations,
  tasksRelations,
  taskAssignmentsRelations,
  taskCategoriesRelations,
};

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema,
  casing: "snake_case",
});
