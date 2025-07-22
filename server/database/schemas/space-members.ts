import {
	index,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { spaces } from "./spaces";
import { users } from "./users";

export const spaceMembers = pgTable(
	"space_members",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		spaceId: uuid("space_id")
			.notNull()
			.references(() => spaces.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: varchar("role", { length: 50 }).notNull().default("member"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at").defaultNow().notNull(),
	},
	(table) => [
		uniqueIndex("space_members_space_user_unique").on(
			table.spaceId,
			table.userId,
		),
		index("space_members_space_id_idx").on(table.spaceId),
		index("space_members_user_id_idx").on(table.userId),
	],
);
