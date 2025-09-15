"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { categories, spaceMembers } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";

export type CreateListInput = {
  name: string;
  spaceId: string;
};

export type CreateListResult = {
  success: boolean;
  list?: {
    id: string;
    name: string;
    type: string;
  };
  error?: string;
};

export async function createList(
  input: CreateListInput,
): Promise<CreateListResult> {
  try {
    const userId = await getCurrentUser();

    if (!userId) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const { name, spaceId } = input;

    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "List name is required",
      };
    }

    if (!spaceId) {
      return {
        success: false,
        error: "Space ID is required",
      };
    }

    // Verifica se o usuário é membro do space
    const spaceMember = await db
      .select()
      .from(spaceMembers)
      .where(
        and(
          eq(spaceMembers.spaceId, spaceId),
          eq(spaceMembers.userId, userId)
        )
      )
      .limit(1);

    if (spaceMember.length === 0) {
      return {
        success: false,
        error: "You don't have permission to create lists in this space",
      };
    }

    // Verifica se já existe uma categoria com o mesmo nome no space
    const existingCategory = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.name, name.trim()),
          eq(categories.spaceId, spaceId),
          eq(categories.type, "LIST")
        )
      )
      .limit(1);

    if (existingCategory.length > 0) {
      return {
        success: false,
        error: "A list with this name already exists in this space",
      };
    }

    // Cria a nova categoria do tipo LIST
    const [newList] = await db
      .insert(categories)
      .values({
        name: name.trim(),
        type: "LIST",
        spaceId: spaceId,
        ownerId: userId,
      })
      .returning({
        id: categories.id,
        name: categories.name,
        type: categories.type,
      });

    return {
      success: true,
      list: newList,
    };
  } catch (error) {
    console.error("Error creating list:", error);
    return {
      success: false,
      error: "Failed to create list",
    };
  }
}