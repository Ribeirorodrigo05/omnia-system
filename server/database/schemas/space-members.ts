import { index, pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { spaces } from "./spaces";

export const spaceMembers = pgTable(
	"space_members",
	{
		spaceId: uuid("space-id")
			.notNull()
			.references(() => spaces.id, { onDelete: "cascade" }),
		userId: uuid("user-id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: varchar("role", { length: 50 }).notNull().default("member"),
	},
	(table) => [
		primaryKey({ columns: [table.spaceId, table.userId] }),
		index("space_members_space_id_idx").on(table.spaceId),
		index("space_members_user_id_idx").on(table.userId),
	],
);
