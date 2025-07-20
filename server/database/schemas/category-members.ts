import { index, pgTable, uuid } from "drizzle-orm/pg-core";

export const categoryMembers = pgTable(
	"category_members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		categoryId: uuid("category-id"),
		userId: uuid("user-id"),
	},
	(table) => [
		index("category_members_category_id_idx").on(table.categoryId),
		index("category_members_user_id_idx").on(table.userId),
	],
);
