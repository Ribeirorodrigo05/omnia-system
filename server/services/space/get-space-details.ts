"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { spaceMembers, spaces } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type SpaceDetails = {
  id: string;
  name: string;
  ownerId: string;
  isOwner: boolean;
  role: string;
};

export async function getSpaceDetails(
  spaceId: string,
): Promise<SpaceDetails | null> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return null;
    }

    // Verifica se o usuário é membro do space e busca os detalhes
    const spaceResult = await db
      .select({
        id: spaces.id,
        name: spaces.name,
        ownerId: spaces.ownerId,
        role: spaceMembers.role,
      })
      .from(spaceMembers)
      .innerJoin(spaces, eq(spaceMembers.spaceId, spaces.id))
      .where(
        and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, userId)),
      )
      .limit(1);

    if (spaceResult.length === 0) {
      return null;
    }

    const space = spaceResult[0];

    return {
      id: space.id,
      name: space.name,
      ownerId: space.ownerId,
      isOwner: space.ownerId === userId || space.role === "owner",
      role: space.role,
    };
  } catch (error) {
    console.error("Error fetching space details:", error);
    return null;
  }
}
