"use server";

import { db } from "@/server/database";
import { spaces } from "@/server/database/schemas";
import type { CreateSpaceSchema } from "@/server/validators/space-validation";

export async function createSpace(data: CreateSpaceSchema, userId: string) {
  try {
    const [newSpace] = await db
      .insert(spaces)
      .values({
        name: data.name,
        workspaceId: data.workspaceId,
        ownerId: userId,
      })
      .returning({
        id: spaces.id,
        name: spaces.name,
        workspaceId: spaces.workspaceId,
        createdAt: spaces.createdAt,
      });

    return {
      success: true,
      space: newSpace,
    };
  } catch (error) {
    console.error("Error creating space:", error);

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
