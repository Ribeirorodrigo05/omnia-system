"use server";

import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/server/database";
import { categories, spaceMembers, spaces } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type WorkspaceSpace = {
  id: string;
  name: string;
  url: string;
  role: string;
  isOwner: boolean;
  categories?: Array<{
    id: string;
    name: string;
    type: "LIST" | "SPRINT" | "FOLDER";
    url: string;
  }>;
};

export async function getWorkspaceSpaces(
  workspaceId: string,
): Promise<WorkspaceSpace[]> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return [];
    }

    // Busca spaces do workspace onde o usuário é membro
    const userSpaces = await db
      .select({
        id: spaces.id,
        name: spaces.name,
        ownerId: spaces.ownerId,
        role: spaceMembers.role,
      })
      .from(spaceMembers)
      .innerJoin(spaces, eq(spaceMembers.spaceId, spaces.id))
      .where(
        and(
          eq(spaceMembers.userId, userId),
          eq(spaces.workspaceId, workspaceId),
        ),
      );

    // Para cada space, busca suas categories
    const spacesWithCategories = await Promise.all(
      userSpaces.map(async (space) => {
        const spaceCategories = await db
          .select({
            id: categories.id,
            name: categories.name,
            type: categories.type,
          })
          .from(categories)
          .where(
            and(
              eq(categories.spaceId, space.id),
              isNull(categories.categoryId), // Apenas categorias de primeiro nível
              isNull(categories.deletedAt), // Não buscar categories deletadas
            ),
          )
          .orderBy(categories.createdAt);

        return {
          id: space.id,
          name: space.name,
          url: `/spaces/${space.id}`,
          role: space.role,
          isOwner: space.ownerId === userId || space.role === "owner",
          categories: spaceCategories.map((category) => ({
            id: category.id,
            name: category.name,
            type: category.type as "LIST" | "SPRINT" | "FOLDER",
            url: `/spaces/${space.id}/categories/${category.id}`,
          })),
        };
      }),
    );

    return spacesWithCategories;
  } catch (error) {
    console.error("Error fetching workspace spaces:", error);
    return [];
  }
}
