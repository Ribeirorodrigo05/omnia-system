import { index, pgTable, uuid } from "drizzle-orm/pg-core";

export const spaceMembers = pgTable(
	"space_members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		spaceId: uuid("space-id").notNull(),
		userId: uuid("user-id").notNull(),
	},
	(table) => [
		index("space_members_space_id_idx").on(table.spaceId),
		index("space_members_user_id_idx").on(table.userId),
	],
);
