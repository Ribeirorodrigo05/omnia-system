import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLoginAt: timestamp("last_login_at"),
    isActive: boolean("is_active").default(true).notNull(),
    profileMetadata: jsonb("profile_metadata"),
  },
  (table) => [
    // Índices para melhor performance
    index("users_email_idx").on(table.email),
    index("users_is_active_idx").on(table.isActive),
    index("users_created_at_idx").on(table.createdAt),
  ]
);

// Relacionamentos serão definidos após todos os schemas
// para evitar dependências circulares
