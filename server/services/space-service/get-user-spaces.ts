"use server";

import { db } from "@/server/database";
import { spaces, spaceMembers } from "@/server/database/schemas";
import { eq, or, and } from "drizzle-orm";

export async function getUserSpaces(userId: string, workspaceId: string) {
  try {
    // Get spaces where user is owner or member within the workspace
    const userSpaces = await db
      .select({
        id: spaces.id,
        name: spaces.name,
        workspaceId: spaces.workspaceId,
        createdAt: spaces.createdAt,
      })
      .from(spaces)
      .leftJoin(spaceMembers, eq(spaceMembers.spaceId, spaces.id))
      .where(
        and(
          eq(spaces.workspaceId, workspaceId),
          or(eq(spaces.ownerId, userId), eq(spaceMembers.userId, userId)),
        ),
      );

    return userSpaces;
  } catch (error) {
    console.error("Error getting user spaces:", error);
    return [];
  }
}
