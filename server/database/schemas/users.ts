import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull(),
		createdAt: timestamp("created-at").defaultNow().notNull(),
		updatedAt: timestamp("updated-at").defaultNow().notNull(),
		deletedAt: timestamp("deleted-at"),
		role: varchar("role", { length: 255 }).array(),
		jobPosition: varchar("job-position", { length: 255 }).array(),
	},
	(table) => [
		index("users_name_idx").on(table.name),
		index("users_created_at_idx").on(table.createdAt),
		index("users_role_idx").on(table.role),
	],
);
