import { relations } from "drizzle-orm";
import { workspaceMembers } from "../workspace-members";
import { workspaces } from "../workspaces";
import { users } from "../users";

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
