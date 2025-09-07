import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    action: varchar("action", { length: 100 }).notNull(), // e.g., "DELETE_SPACE", "DELETE_CATEGORY"
    resourceId: uuid("resource_id").notNull(), // ID do recurso afetado
    resourceType: varchar("resource_type", { length: 50 }).notNull(), // e.g., "space", "category"
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    details: jsonb("details"), // Detalhes adicionais em JSON
    ipAddress: varchar("ip_address", { length: 45 }), // IPv4 ou IPv6
    userAgent: text("user_agent"), // User agent do navegador/cliente
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_logs_action_idx").on(table.action),
    index("audit_logs_resource_id_idx").on(table.resourceId),
    index("audit_logs_resource_type_idx").on(table.resourceType),
    index("audit_logs_user_id_idx").on(table.userId),
    index("audit_logs_created_at_idx").on(table.createdAt),
  ],
);
