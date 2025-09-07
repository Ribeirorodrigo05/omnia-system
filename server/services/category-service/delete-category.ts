import { eq } from "drizzle-orm";
import { db } from "@/server/database";
import { categories } from "@/server/database/schemas/categories";
import { logAuditEvent } from "@/server/utils/audit-logger";

export const deleteCategory = async (
  categoryId: string,
  spaceId: string,
  userId: string,
) => {
  try {
    // Verificar se a category existe e pertence ao space
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!category.length) {
      return { success: false, error: "Category not found" };
    }

    if (category[0].spaceId !== spaceId) {
      return {
        success: false,
        error: "Category does not belong to this space",
      };
    }

    // Log da ação antes da deleção
    await logAuditEvent({
      action: "DELETE_CATEGORY",
      resourceId: categoryId,
      userId,
      resourceType: "category",
      details: {
        categoryName: category[0].name,
        categoryType: category[0].type,
        spaceId,
      },
    });

    // Deletar a category (cascade irá deletar tasks, comments, etc.)
    await db.delete(categories).where(eq(categories.id, categoryId));

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete category",
    };
  }
};
