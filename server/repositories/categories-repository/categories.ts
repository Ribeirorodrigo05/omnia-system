import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/server/database";
import { categories } from "@/server/database/schemas";
import type {
  CategoryData,
  Category,
  CategoryType,
} from "@/server/types/categories";

export async function createCategory(data: CategoryData): Promise<Category> {
  const [category] = await db
    .insert(categories)
    .values({
      name: data.name.trim(),
      type: data.type,
      spaceId: data.spaceId,
      ownerId: data.ownerId,
      categoryId: data.categoryId || null,
    })
    .returning();

  return category;
}

export async function findCategoryByNameAndSpace(
  name: string,
  spaceId: string,
  type: CategoryType,
): Promise<Category | null> {
  const [category] = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.name, name.trim()),
        eq(categories.spaceId, spaceId),
        eq(categories.type, type),
        isNull(categories.deletedAt),
      ),
    )
    .limit(1);

  return category || null;
}

export async function findCategoriesBySpace(
  spaceId: string,
  parentCategoryId?: string,
): Promise<Category[]> {
  const categoryList = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.spaceId, spaceId),
        parentCategoryId
          ? eq(categories.categoryId, parentCategoryId)
          : isNull(categories.categoryId),
        isNull(categories.deletedAt),
      ),
    )
    .orderBy(categories.createdAt);

  return categoryList;
}

export async function findCategoryById(id: string): Promise<Category | null> {
  const [category] = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), isNull(categories.deletedAt)))
    .limit(1);

  return category || null;
}
