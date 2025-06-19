import { pgTable, uuid, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tasks } from "./tasks";

export const taskAssignments = pgTable("task_assignments", {
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
});
