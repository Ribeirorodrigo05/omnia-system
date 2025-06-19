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

// Create schema object
export const schema = {
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

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema,
  casing: "snake_case",
});
