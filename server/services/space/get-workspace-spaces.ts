"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { spaceMembers, spaces } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type WorkspaceSpace = {
  id: string;
  name: string;
  url: string;
  role: string;
  isOwner: boolean;
};

export async function getWorkspaceSpaces(
  workspaceId: string,
): Promise<WorkspaceSpace[]> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return [];
    }

    // Busca spaces do workspace onde o usuário é membro
    const userSpaces = await db
      .select({
        id: spaces.id,
        name: spaces.name,
        ownerId: spaces.ownerId,
        role: spaceMembers.role,
      })
      .from(spaceMembers)
      .innerJoin(spaces, eq(spaceMembers.spaceId, spaces.id))
      .where(
        and(
          eq(spaceMembers.userId, userId),
          eq(spaces.workspaceId, workspaceId),
        ),
      );

    return userSpaces.map((space) => ({
      id: space.id,
      name: space.name,
      url: `/spaces/${space.id}`,
      role: space.role,
      isOwner: space.ownerId === userId || space.role === "owner",
    }));
  } catch (error) {
    console.error("Error fetching workspace spaces:", error);
    return [];
  }
}
