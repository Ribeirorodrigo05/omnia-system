import { relations } from "drizzle-orm";
import { taskAssignments } from "../task-assignments";
import { tasks } from "../tasks";
import { users } from "../users";

// === TASK ASSIGNMENT RELATIONS ===
export const taskAssignmentsRelations = relations(
  taskAssignments,
  ({ one }) => ({
    // N:1 - Task assignada
    task: one(tasks, {
      fields: [taskAssignments.taskId],
      references: [tasks.id],
      relationName: "task_assignments",
    }),

    // N:1 - Usuário assignado
    user: one(users, {
      fields: [taskAssignments.userId],
      references: [users.id],
      relationName: "user_task_assignments",
    }),
  })
);
