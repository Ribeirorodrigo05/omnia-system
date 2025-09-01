import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { spaces } from "./spaces";
import { users } from "./users";

export const categoryTypeEnum = pgEnum("category_type", [
  "LIST",
  "SPRINT",
  "FOLDER",
]);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    type: categoryTypeEnum("type").notNull(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id"), // Para hierarquia de categorias - self reference será adicionada nas relações
    ownerId: uuid("owner_id")
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
