import {
	index,
	integer,
	pgTable,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { categories } from "./categories";

export const tasks = pgTable(
	"tasks",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		name: varchar("name", { length: 255 }).notNull(),
		createdAt: timestamp("created-at").defaultNow().notNull(),
		updatedAt: timestamp("updated-at").defaultNow().notNull(),
		deletedAt: timestamp("deleted-at"),
		points: integer("points"),
		categoryId: uuid("category-id")
			.notNull()
			.references(() => categories.id),
		startsAt: timestamp("starts-at"),
		endsAt: timestamp("ends-at"),
		timeSpent: integer("time-spent"),
		ownerId: uuid("owner-id")
			.notNull()
			.references(() => users.id),
		assignedUserIds: uuid("assigned-user-ids").array(),
		status: varchar("status", { length: 255 }).notNull(),
		subTasks: uuid("sub-tasks"), // Para tarefas filhas - self reference será adicionada nas relações
		estimatedTime: integer("estimated-time"),
		priority: varchar("priority", { length: 255 }),
	},
	(table) => [
		index("tasks_name_idx").on(table.name),
		index("tasks_category_id_idx").on(table.categoryId),
		index("tasks_created_at_idx").on(table.createdAt),
		index("tasks_assigned_user_ids_idx").on(table.assignedUserIds),
		index("tasks_sub_tasks_idx").on(table.subTasks),
		index("tasks_priority_idx").on(table.priority),
	],
);
