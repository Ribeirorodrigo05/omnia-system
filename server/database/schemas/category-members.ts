import {
	index,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";
import { users } from "./users";

export const categoryMembers = pgTable(
	"category_members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: varchar("role", { length: 50 }).notNull().default("member"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("category_members_category_user_unique").on(
			table.categoryId,
			table.userId,
		),
		index("category_members_category_id_idx").on(table.categoryId),
		index("category_members_user_id_idx").on(table.userId),
	],
);
