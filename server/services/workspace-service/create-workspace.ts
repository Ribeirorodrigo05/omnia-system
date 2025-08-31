"use server";

import { db } from "@/server/database";
import { workspaces } from "@/server/database/schemas";
import type { CreateWorkspaceSchema } from "@/server/validators/workspace-validation";

export async function createWorkspace(
  data: CreateWorkspaceSchema,
  userId: string,
) {
  try {
    const [newWorkspace] = await db
      .insert(workspaces)
      .values({
        name: data.name,
        ownerId: userId,
      })
      .returning({
        id: workspaces.id,
        name: workspaces.name,
      });

    return {
      success: true,
      workspace: newWorkspace,
    };
  } catch (error) {
    console.error("Error creating workspace:", error);

    if (error instanceof Error && error.message.includes("unique")) {
      return {
        success: false,
        error: "Já existe um workspace com este nome",
      };
    }

    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
