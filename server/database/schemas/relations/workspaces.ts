import { relations } from "drizzle-orm";
import { workspaces } from "../workspaces";
import { users } from "../users";
import { workspaceMembers } from "../workspace-members";
import { spaces } from "../spaces";

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
