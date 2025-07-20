import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const spaces = pgTable(
	"spaces",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull(),
		createdAt: timestamp("created-at").defaultNow().notNull(),
		updatedAt: timestamp("updated-at").defaultNow().notNull(),
		deletedAt: timestamp("deleted-at"),
		workspaceId: uuid("workspace-id").notNull(),
		ownerId: uuid("owner-id").notNull(),
	},
	(table) => [
		index("spaces_name_idx").on(table.name),
		index("spaces_created_at_idx").on(table.createdAt),
		index("spaces_workspace_id_idx").on(table.workspaceId),
		index("spaces_owner_id_idx").on(table.ownerId),
	],
);
