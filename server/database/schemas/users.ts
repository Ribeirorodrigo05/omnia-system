import { index, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    role: varchar("role", { length: 255 }).array(),
    jobPosition: varchar("job_position", { length: 255 }).array(),
  },
  (table) => [
    index("users_name_idx").on(table.name),
    index("users_email_idx").on(table.email),
    index("users_created_at_idx").on(table.createdAt),
    index("users_role_idx").on(table.role),
  ],
);
