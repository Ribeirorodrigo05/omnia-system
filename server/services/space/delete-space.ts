"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { spaces, spaceMembers } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type DeleteSpaceInput = {
  spaceId: string;
};

export type DeleteSpaceResult = {
  success: boolean;
  error?: string;
};

export async function deleteSpace(
  input: DeleteSpaceInput,
): Promise<DeleteSpaceResult> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { spaceId } = input;

    // Verifica se o usuário tem permissão para deletar o space
    const spaceMember = await db
      .select({
        role: spaceMembers.role,
        spaceOwnerId: spaces.ownerId,
      })
      .from(spaceMembers)
      .innerJoin(spaces, eq(spaceMembers.spaceId, spaces.id))
      .where(
        and(
          eq(spaceMembers.spaceId, spaceId),
          eq(spaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (spaceMember.length === 0) {
      return {
        success: false,
        error: "Space not found or access denied",
      };
    }

    const member = spaceMember[0];
    const isOwner = member.spaceOwnerId === userId || member.role === "owner";

    if (!isOwner) {
      return {
        success: false,
        error: "Only space owners can delete spaces",
      };
    }

    // Soft delete do space - o cascade do banco cuidará das listas e sprints
    await db
      .update(spaces)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(spaces.id, spaceId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting space:", error);
    return {
      success: false,
      error: "Failed to delete space",
    };
  }
}