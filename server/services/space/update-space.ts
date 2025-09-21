"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { spaceMembers, spaces } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type UpdateSpaceInput = {
  spaceId: string;
  name: string;
};

export type UpdateSpaceResult = {
  success: boolean;
  space?: {
    id: string;
    name: string;
  };
  error?: string;
};

export async function updateSpace(
  input: UpdateSpaceInput,
): Promise<UpdateSpaceResult> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { spaceId, name } = input;

    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "Space name is required",
      };
    }

    // Verifica se o usuário tem permissão para editar o space
    const spaceMember = await db
      .select({
        role: spaceMembers.role,
        spaceOwnerId: spaces.ownerId,
      })
      .from(spaceMembers)
      .innerJoin(spaces, eq(spaceMembers.spaceId, spaces.id))
      .where(
        and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, userId)),
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
        error: "Only space owners can rename spaces",
      };
    }

    // Atualiza o space
    const [updatedSpace] = await db
      .update(spaces)
      .set({
        name: name.trim(),
        updatedAt: new Date(),
      })
      .where(eq(spaces.id, spaceId))
      .returning({
        id: spaces.id,
        name: spaces.name,
      });

    return {
      success: true,
      space: updatedSpace,
    };
  } catch (error) {
    console.error("Error updating space:", error);
    return {
      success: false,
      error: "Failed to update space",
    };
  }
}
