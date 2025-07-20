import { relations } from "drizzle-orm";
import { users } from "./users";
import { workspaces } from "./workspaces";
import { spaces } from "./spaces";
import { categories } from "./categories";
import { tasks } from "./tasks";
import { workspaceMembers } from "./workspace-members";
import { spaceMembers } from "./space-members";
import { categoryMembers } from "./category-members";
import { comments } from "./comments";

// Users Relations
export const usersRelations = relations(users, ({ many }) => ({
	ownedWorkspaces: many(workspaces),
	ownedSpaces: many(spaces),
	ownedCategories: many(categories),
	ownedTasks: many(tasks),
	workspaceMemberships: many(workspaceMembers),
	spaceMemberships: many(spaceMembers),
	categoryMemberships: many(categoryMembers),
	comments: many(comments),
}));

// Workspaces Relations
export const workspacesRelations = relations(workspaces, ({ one, many }) => ({
	owner: one(users, {
		fields: [workspaces.ownerId],
		references: [users.id],
	}),
	spaces: many(spaces),
	members: many(workspaceMembers),
}));

// Spaces Relations
export const spacesRelations = relations(spaces, ({ one, many }) => ({
	workspace: one(workspaces, {
		fields: [spaces.workspaceId],
		references: [workspaces.id],
	}),
	owner: one(users, {
		fields: [spaces.ownerId],
		references: [users.id],
	}),
	categories: many(categories),
	members: many(spaceMembers),
}));

// Categories Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
	space: one(spaces, {
		fields: [categories.spaceId],
		references: [spaces.id],
	}),
	owner: one(users, {
		fields: [categories.ownerId],
		references: [users.id],
	}),
	parentCategory: one(categories, {
		fields: [categories.categoryId],
		references: [categories.id],
		relationName: "category_hierarchy",
	}),
	subCategories: many(categories, {
		relationName: "category_hierarchy",
	}),
	tasks: many(tasks),
	members: many(categoryMembers),
}));

// Tasks Relations
export const tasksRelations = relations(tasks, ({ one, many }) => ({
	category: one(categories, {
		fields: [tasks.categoryId],
		references: [categories.id],
	}),
	owner: one(users, {
		fields: [tasks.ownerId],
		references: [users.id],
	}),
	parentTask: one(tasks, {
		fields: [tasks.subTasks],
		references: [tasks.id],
		relationName: "task_hierarchy",
	}),
	subTasks: many(tasks, {
		relationName: "task_hierarchy",
	}),
	comments: many(comments),
}));

// Workspace Members Relations
export const workspaceMembersRelations = relations(
	workspaceMembers,
	({ one }) => ({
		workspace: one(workspaces, {
			fields: [workspaceMembers.workspaceId],
			references: [workspaces.id],
		}),
		user: one(users, {
			fields: [workspaceMembers.userId],
			references: [users.id],
		}),
	}),
);

// Space Members Relations
export const spaceMembersRelations = relations(spaceMembers, ({ one }) => ({
	space: one(spaces, {
		fields: [spaceMembers.spaceId],
		references: [spaces.id],
	}),
	user: one(users, {
		fields: [spaceMembers.userId],
		references: [users.id],
	}),
}));

// Category Members Relations
export const categoryMembersRelations = relations(
	categoryMembers,
	({ one }) => ({
		category: one(categories, {
			fields: [categoryMembers.categoryId],
			references: [categories.id],
		}),
		user: one(users, {
			fields: [categoryMembers.userId],
			references: [users.id],
		}),
	}),
);

// Comments Relations
export const commentsRelations = relations(comments, ({ one }) => ({
	owner: one(users, {
		fields: [comments.ownerId],
		references: [users.id],
	}),
	task: one(tasks, {
		fields: [comments.taskId],
		references: [tasks.id],
	}),
}));
