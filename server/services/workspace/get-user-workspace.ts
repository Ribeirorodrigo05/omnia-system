"use server";

import { eq } from "drizzle-orm";
import { db } from "@/server/database";
import { workspaceMembers, workspaces } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type UserWorkspace = {
  id: string;
  name: string;
  role: string;
  isOwner: boolean;
};

export async function getUserWorkspace(): Promise<UserWorkspace | null> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return null;
    }

    const userWorkspace = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspaceMembers.role,
        ownerId: workspaces.ownerId,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId))
      .limit(1);

    if (userWorkspace.length > 0) {
      const workspace = userWorkspace[0];
      return {
        id: workspace.id,
        name: workspace.name,
        role: workspace.role,
        isOwner: workspace.ownerId === userId || workspace.role === "owner",
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching user workspace:", error);
    return null;
  }
}

export async function getUserWorkspaces(): Promise<UserWorkspace[]> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return [];
    }

    // Busca todos os workspaces do usuário através da tabela workspace_members
    const userWorkspaces = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspaceMembers.role,
        ownerId: workspaces.ownerId,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId));

    return userWorkspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      role: workspace.role,
      isOwner: workspace.ownerId === userId || workspace.role === "owner",
    }));
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    return [];
  }
}
