import {
  pgTable,
  uuid,
  timestamp,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { tasks } from "./tasks";

export const taskAssignments = pgTable(
  "task_assignments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    taskId: uuid("task_id")
      .notNull()
      .references(() => tasks.id),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    assignedAt: timestamp("assigned_at").defaultNow().notNull(),
    unassignedAt: timestamp("unassigned_at"),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (table) => [
    // Constraint única: um usuário pode ser assignado apenas uma vez por task (quando ativo)
    unique("task_assignments_unique_active").on(
      table.taskId,
      table.userId,
      table.isActive
    ),

    // Índices para FKs
    index("task_assignments_task_id_idx").on(table.taskId),
    index("task_assignments_user_id_idx").on(table.userId),

    // Índices para consultas frequentes
    index("task_assignments_is_active_idx").on(table.isActive),
    index("task_assignments_assigned_at_idx").on(table.assignedAt),

    // Índices compostos
    index("task_assignments_task_active_idx").on(table.taskId, table.isActive),
    index("task_assignments_user_active_idx").on(table.userId, table.isActive),
  ]
);
