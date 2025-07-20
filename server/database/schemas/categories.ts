import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { spaces } from "./spaces";

export const categories = pgTable(
	"categories",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull(),
		createdAt: timestamp("created-at").defaultNow().notNull(),
		updatedAt: timestamp("updated-at").defaultNow().notNull(),
		deletedAt: timestamp("deleted-at"),
		type: varchar("type", { length: 255 }).notNull(),
		spaceId: uuid("space-id")
			.notNull()
			.references(() => spaces.id, { onDelete: "cascade" }),
		categoryId: uuid("category-id"), // Para hierarquia de categorias - self reference será adicionada nas relações
		ownerId: uuid("owner-id")
			.notNull()
			.references(() => users.id),
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
