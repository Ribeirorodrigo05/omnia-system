"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/server/database";
import { categories, spaceMembers } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type SpaceCategory = {
  id: string;
  name: string;
  type: "LIST" | "SPRINT" | "FOLDER";
  url: string;
  spaceId: string;
};

export async function getSpaceCategories(
  spaceId: string,
): Promise<SpaceCategory[]> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return [];
    }

    // Verifica se o usuário é membro do space
    const spaceMember = await db
      .select()
      .from(spaceMembers)
      .where(
        and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, userId)),
      )
      .limit(1);

    if (spaceMember.length === 0) {
      return [];
    }

    // Busca todas as categories do space (sem parent, apenas as de primeiro nível)
    const spaceCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        type: categories.type,
        spaceId: categories.spaceId,
      })
      .from(categories)
      .where(
        and(
          eq(categories.spaceId, spaceId),
          isNull(categories.categoryId), // Apenas categorias de primeiro nível
          isNull(categories.deletedAt), // Não buscar categories deletadas
        ),
      )
      .orderBy(categories.createdAt);

    return spaceCategories.map((category) => ({
      id: category.id,
      name: category.name,
      type: category.type as "LIST" | "SPRINT" | "FOLDER",
      url: `/spaces/${spaceId}/categories/${category.id}`,
      spaceId: category.spaceId,
    }));
  } catch (error) {
    console.error("Error fetching space categories:", error);
    return [];
  }
}
