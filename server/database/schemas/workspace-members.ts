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
import { workspaces } from "./workspaces";

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id),
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
    // Constraint única: um usuário só pode estar uma vez em cada workspace
    unique("workspace_members_user_workspace_unique").on(
      table.workspaceId,
      table.userId
    ),

    // Índices para FKs e consultas frequentes
    index("workspace_members_workspace_id_idx").on(table.workspaceId),
    index("workspace_members_user_id_idx").on(table.userId),
    index("workspace_members_is_active_idx").on(table.isActive),
    index("workspace_members_role_idx").on(table.role),

    // Índices compostos para consultas comuns
    index("workspace_members_workspace_active_idx").on(
      table.workspaceId,
      table.isActive
    ),
    index("workspace_members_user_active_idx").on(table.userId, table.isActive),
  ]
);
