import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { tasks } from "./tasks";

export const comments = pgTable(
	"comments",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		ownerId: uuid("owner-id")
			.notNull()
			.references(() => users.id),
		text: text("text"),
		taskId: uuid("task-id")
			.notNull()
			.references(() => tasks.id, { onDelete: "cascade" }),
		createdAt: timestamp("created-at").defaultNow().notNull(),
		updatedAt: timestamp("updated-at").defaultNow().notNull(),
		deletedAt: timestamp("deleted-at"),
	},
	(table) => [
		index("comments_owner_id_idx").on(table.ownerId),
		index("comments_task_id_idx").on(table.taskId),
	],
);
