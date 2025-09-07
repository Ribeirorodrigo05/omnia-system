import { eq } from "drizzle-orm";
import { db } from "@/server/database";
import { spaces } from "@/server/database/schemas/spaces";
import { logAuditEvent } from "@/server/utils/audit-logger";

export const deleteSpace = async (
  spaceId: string,
  workspaceId: string,
  userId: string,
) => {
  try {
    // Verificar se o space existe e pertence ao workspace
    const space = await db
      .select()
      .from(spaces)
      .where(eq(spaces.id, spaceId))
      .limit(1);

    if (!space.length) {
      return { success: false, error: "Space not found" };
    }

    if (space[0].workspaceId !== workspaceId) {
      return {
        success: false,
        error: "Space does not belong to this workspace",
      };
    }

    // Log da ação antes da deleção
    await logAuditEvent({
      action: "DELETE_SPACE",
      resourceId: spaceId,
      userId,
      resourceType: "space",
      details: {
        spaceName: space[0].name,
        workspaceId,
      },
    });

    // Deletar o space (cascade irá deletar categories, tasks, comments, etc.)
    await db.delete(spaces).where(eq(spaces.id, spaceId));

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting space:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete space",
    };
  }
};
