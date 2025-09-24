"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/server/database";
import { spaceMembers } from "@/server/database/schemas";
import { getCurrentUser } from "@/server/services/auth/get-current-user";
import { 
  createCategory, 
  findCategoryByNameAndSpace 
} from "@/server/repositories/categories-repository/categories";
import type { CreateListInput, CreateListResult } from "@/server/types/categories";

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

    const spaceMember = await db
      .select()
      .from(spaceMembers)
      .where(
        and(eq(spaceMembers.spaceId, spaceId), eq(spaceMembers.userId, userId)),
      )
      .limit(1);

    if (spaceMember.length === 0) {
      return {
        success: false,
        error: "You don't have permission to create lists in this space",
      };
    }

    const existingCategory = await findCategoryByNameAndSpace(
      name.trim(),
      spaceId,
      "LIST"
    );

    if (existingCategory) {
      return {
        success: false,
        error: "A list with this name already exists in this space",
      };
    }

    const newList = await createCategory({
      name: name.trim(),
      type: "LIST",
      spaceId: spaceId,
      ownerId: userId,
    });

    return {
      success: true,
      list: {
        id: newList.id,
        name: newList.name,
        type: newList.type,
      },
    };
  } catch (error) {
    console.error("Error creating list:", error);
    return {
      success: false,
      error: "Failed to create list",
    };
  }
}
