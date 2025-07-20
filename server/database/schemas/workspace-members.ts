import { index, pgTable, uuid } from "drizzle-orm/pg-core";

export const workspaceMembers = pgTable(
	"workspace_members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		workspaceId: uuid("workspace-id").notNull(),
		userId: uuid("user-id").notNull(),
	},
	(table) => [
		index("workspace_members_workspace_id_idx").on(table.workspaceId),
		index("workspace_members_user_id_idx").on(table.userId),
	],
);
