import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { spaces } from "./spaces";

export const categories = pgTable("categories", {
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
});
