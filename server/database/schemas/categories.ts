import { pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { spaces } from "./spaces";

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    type: varchar("type", { length: 20 }).notNull(),
  },
  (table) => [
    // Índices para FKs
    index("categories_space_id_idx").on(table.spaceId),
    index("categories_owner_id_idx").on(table.ownerId),

    // Índices para consultas frequentes
    index("categories_name_idx").on(table.name),
    index("categories_type_idx").on(table.type),

    // Índices compostos
    index("categories_space_type_idx").on(table.spaceId, table.type),
  ]
);
