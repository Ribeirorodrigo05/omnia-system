import {
	index,
	pgTable,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const workspaces = pgTable(
	"workspaces",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull().unique(),
		createdAt: timestamp("created-at").defaultNow().notNull(),
		updatedAt: timestamp("updated-at").defaultNow().notNull(),
		deletedAt: timestamp("deleted-at"),
		ownerId: uuid("owner-id")
			.notNull()
			.references(() => users.id),
	},
	(table) => [
		index("workspaces_name_idx").on(table.name),
		index("workspaces_created_at_idx").on(table.createdAt),
		uniqueIndex("workspaces_owner_id_idx").on(table.ownerId),
	],
);
