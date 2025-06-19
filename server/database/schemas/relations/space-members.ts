import { relations } from "drizzle-orm";
import { spaceMembers } from "../space-members";
import { spaces } from "../spaces";
import { users } from "../users";

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
