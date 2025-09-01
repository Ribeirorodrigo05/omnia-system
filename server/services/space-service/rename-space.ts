"use server";

import { db } from "@/server/database";
import { spaces } from "@/server/database/schemas";
import { eq, and } from "drizzle-orm";

export async function renameSpace(
  spaceId: string,
  newName: string,
  userId: string,
) {
  try {
    const [updatedSpace] = await db
      .update(spaces)
      .set({
        name: newName,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(spaces.id, spaceId),
          eq(spaces.ownerId, userId), // Only owner can rename
        ),
      )
      .returning({
        id: spaces.id,
        name: spaces.name,
        workspaceId: spaces.workspaceId,
        createdAt: spaces.createdAt,
      });

    if (!updatedSpace) {
      return {
        success: false,
        error: "Space não encontrado ou você não tem permissão para renomeá-lo",
      };
    }

    return {
      success: true,
      space: updatedSpace,
    };
  } catch (error) {
    console.error("Error renaming space:", error);

    if (error instanceof Error && error.message.includes("unique")) {
      return {
        success: false,
        error: "Já existe um space com este nome neste workspace",
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
