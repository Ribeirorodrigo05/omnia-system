"use server";

import { eq } from "drizzle-orm";
import { db } from "@/server/database";
import { workspaceMembers, workspaces } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type CreateWorkspaceInput = {
  name: string;
};

export type CreateWorkspaceResult = {
  success: boolean;
  workspace?: {
    id: string;
    name: string;
  };
  error?: string;
};

export async function createWorkspace(
  input: CreateWorkspaceInput,
): Promise<CreateWorkspaceResult> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { name } = input;

    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "Workspace name is required",
      };
    }

    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.name, name))
      .limit(1);

    if (existingWorkspace.length > 0) {
      return {
        success: false,
        error: "A workspace with this name already exists",
      };
    }

    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        name: name.trim(),
        ownerId: userId,
      })
      .returning({
        id: workspaces.id,
        name: workspaces.name,
      });

    await db.insert(workspaceMembers).values({
      workspaceId: newWorkspace.id,
      userId: userId,
      role: "owner",
    });

    return {
      success: true,
      workspace: newWorkspace,
    };
  } catch (error) {
    console.error("Error creating workspace:", error);
    return {
      success: false,
      error: "Failed to create workspace",
    };
  }
}
