import { index, pgTable, primaryKey, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";

export const categoryMembers = pgTable(
	"category_members",
	{
		categoryId: uuid("category-id")
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
		userId: uuid("user-id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: varchar("role", { length: 50 }).notNull().default("member"),
	},
	(table) => [
		primaryKey({ columns: [table.categoryId, table.userId] }),
		index("category_members_category_id_idx").on(table.categoryId),
		index("category_members_user_id_idx").on(table.userId),
	],
);
