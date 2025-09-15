"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { spaceMembers, spaces } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type CreateSpaceInput = {
  name: string;
  workspaceId: string;
};

export type CreateSpaceResult = {
  success: boolean;
  space?: {
    id: string;
    name: string;
  };
  error?: string;
};

export async function createSpace(
  input: CreateSpaceInput,
): Promise<CreateSpaceResult> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { name, workspaceId } = input;

    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "Space name is required",
      };
    }

    if (!workspaceId) {
      return {
        success: false,
        error: "Workspace ID is required",
      };
    }

    // Verifica se já existe um space com o mesmo nome no workspace
    const existingSpace = await db
      .select()
      .from(spaces)
      .where(
        and(eq(spaces.name, name.trim()), eq(spaces.workspaceId, workspaceId)),
      )
      .limit(1);

    if (existingSpace.length > 0) {
      return {
        success: false,
        error: "A space with this name already exists in this workspace",
      };
    }

    // Cria o novo space
    const [newSpace] = await db
      .insert(spaces)
      .values({
        name: name.trim(),
        workspaceId: workspaceId,
        ownerId: userId,
      })
      .returning({
        id: spaces.id,
        name: spaces.name,
      });

    // Adiciona o usuário como membro owner do space
    await db.insert(spaceMembers).values({
      spaceId: newSpace.id,
      userId: userId,
      role: "owner",
    });

    return {
      success: true,
      space: newSpace,
    };
  } catch (error) {
    console.error("Error creating space:", error);
    return {
      success: false,
      error: "Failed to create space",
    };
  }
}
