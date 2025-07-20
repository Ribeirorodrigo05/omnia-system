import { index, pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const workspaceMembers = pgTable(
	"workspace_members",
	{
		workspaceId: uuid("workspace-id")
			.notNull()
			.references(() => workspaces.id, { onDelete: "cascade" }),
		userId: uuid("user-id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: varchar("role", { length: 50 }).notNull().default("member"),
	},
	(table) => [
		primaryKey({ columns: [table.workspaceId, table.userId] }),
		index("workspace_members_workspace_id_idx").on(table.workspaceId),
		index("workspace_members_user_id_idx").on(table.userId),
	],
);
