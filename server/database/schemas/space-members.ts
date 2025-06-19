import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  jsonb,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { spaces } from "./spaces";

export const spaceMembers = pgTable(
  "space_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    spaceId: uuid("space_id")
      .notNull()
      .references(() => spaces.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    role: varchar("role", { length: 50 }).default("member").notNull(),
    invitedAt: timestamp("invited_at").defaultNow().notNull(),
    joinedAt: timestamp("joined_at"),
    isActive: boolean("is_active").default(true).notNull(),
    permissions: jsonb("permissions"),
  },
  (table) => [
    // Constraint única: um usuário só pode estar uma vez em cada space
    unique("space_members_user_space_unique").on(table.spaceId, table.userId),

    // Índices para FKs
    index("space_members_space_id_idx").on(table.spaceId),
    index("space_members_user_id_idx").on(table.userId),

    // Índices para consultas frequentes
    index("space_members_is_active_idx").on(table.isActive),
    index("space_members_role_idx").on(table.role),

    // Índices compostos
    index("space_members_space_active_idx").on(table.spaceId, table.isActive),
    index("space_members_user_active_idx").on(table.userId, table.isActive),
  ]
);
