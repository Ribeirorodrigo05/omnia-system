import { relations } from "drizzle-orm";
import { spaces } from "../spaces";
import { workspaces } from "../workspaces";
import { users } from "../users";
import { spaceMembers } from "../space-members";
import { categories } from "../categories";

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
