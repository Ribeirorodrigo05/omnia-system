import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable(
	"categories",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull(),
		createdAt: timestamp("created-at").defaultNow().notNull(),
		updatedAt: timestamp("updated-at").defaultNow().notNull(),
		deletedAt: timestamp("deleted-at"),
		type: varchar("type", { length: 255 }).notNull(),
		spaceId: uuid("space-id").notNull(),
		categoryId: uuid("category-id"), // Para hierarquia de categorias
		ownerId: uuid("owner-id").notNull(),
	},
	(table) => [
		index("categories_name_idx").on(table.name),
		index("categories_created_at_idx").on(table.createdAt),
		index("categories_type_idx").on(table.type),
		index("categories_owner_id_idx").on(table.ownerId),
		index("categories_category_id_idx").on(table.categoryId),
		index("categories_space_id_idx").on(table.spaceId),
	],
);
