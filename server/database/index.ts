import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as categoriesSchema from "./schemas/categories";
import * as categoryMembersSchema from "./schemas/category-members";
import * as commentsSchema from "./schemas/comments";
import * as relationsSchema from "./schemas/relations";
import * as spaceMembersSchema from "./schemas/space-members";
import * as spacesSchema from "./schemas/spaces";
import * as tasksSchema from "./schemas/tasks";
import * as usersSchema from "./schemas/users";
import * as workspaceMembersSchema from "./schemas/workspace-members";
import * as workspacesSchema from "./schemas/workspaces";

config({
  path: "./.env",
});

export const schemas = {
  ...usersSchema,
  ...workspacesSchema,
  ...spacesSchema,
  ...categoriesSchema,
  ...tasksSchema,
  ...workspaceMembersSchema,
  ...spaceMembersSchema,
  ...categoryMembersSchema,
  ...commentsSchema,
  ...relationsSchema,
};

function createDrizzleConfig() {
  return {
    schema: schemas,
  };
}

export const db = drizzle(
  process.env["DATABASE_URL"] || "postgres://user:password@localhost:5432/mydb",
  createDrizzleConfig(),
);
