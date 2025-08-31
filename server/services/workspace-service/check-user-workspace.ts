"use server";

import { db } from "@/server/database";
import { workspaces, workspaceMembers } from "@/server/database/schemas";
import { eq, sql } from "drizzle-orm";

export async function checkUserWorkspace(userId: string) {
  try {
    // Check if user is owner of any workspace
    const ownedWorkspace = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: sql<string>`'owner'`,
      })
      .from(workspaces)
      .where(eq(workspaces.ownerId, userId))
      .limit(1);

    if (ownedWorkspace.length > 0) {
      return {
        hasWorkspace: true,
        workspace: ownedWorkspace[0],
      };
    }

    // Check if user is member of any workspace
    const memberWorkspace = await db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        role: workspaceMembers.role,
      })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId))
      .limit(1);

    if (memberWorkspace.length > 0) {
      return {
        hasWorkspace: true,
        workspace: memberWorkspace[0],
      };
    }

    return {
      hasWorkspace: false,
      workspace: null,
    };
  } catch (error) {
    console.error("Error checking user workspace:", error);
    return {
      hasWorkspace: false,
      workspace: null,
    };
  }
}
