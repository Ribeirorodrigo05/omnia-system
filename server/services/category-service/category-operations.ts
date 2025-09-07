"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "../../database";
import { categories } from "../../database/schemas/categories";
import type { CreateCategoryRequest } from "../../types/categories";
import { getCurrentUser } from "../auth/get-current-user";

export async function createCategory(data: CreateCategoryRequest) {
  try {
    const userId = await getCurrentUser();
    if (!userId) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    const [category] = await db
      .insert(categories)
      .values({
        name: data.name,
        type: data.type,
        spaceId: data.spaceId,
        categoryId: data.categoryId || null,
        ownerId: userId,
      })
      .returning();

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error: "Erro ao criar categoria",
    };
  }
}

export async function getCategoriesBySpace(spaceId: string) {
  try {
    const spaceCategories = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.spaceId, spaceId),
          isNull(categories.deletedAt),
          isNull(categories.categoryId), // Apenas categorias de nível superior
        ),
      )
      .orderBy(categories.createdAt);

    return {
      success: true,
      data: spaceCategories,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: "Erro ao buscar categorias",
    };
  }
}

export async function getSubcategories(categoryId: string) {
  try {
    const subcategories = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.categoryId, categoryId),
          isNull(categories.deletedAt),
        ),
      )
      .orderBy(categories.createdAt);

    return {
      success: true,
      data: subcategories,
    };
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return {
      success: false,
      error: "Erro ao buscar subcategorias",
    };
  }
}

export async function renameCategory(categoryId: string, name: string) {
  try {
    const userId = await getCurrentUser();
    if (!userId) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    const [category] = await db
      .update(categories)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(categories.id, categoryId),
          eq(categories.ownerId, userId),
          isNull(categories.deletedAt),
        ),
      )
      .returning();

    if (!category) {
      return {
        success: false,
        error: "Categoria não encontrada ou você não tem permissão",
      };
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error("Error renaming category:", error);
    return {
      success: false,
      error: "Erro ao renomear categoria",
    };
  }
}
