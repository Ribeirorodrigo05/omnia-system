import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/server/database";
import { categories } from "@/server/database/schemas/categories";
import { spaces } from "@/server/database/schemas/spaces";
import { workspaces } from "@/server/database/schemas/workspaces";
import { getCurrentUser } from "@/server/services/auth/get-current-user";
import { renameCategory } from "@/server/services/category-service/category-operations";
import { deleteCategory } from "@/server/services/category-service/delete-category";

const renameCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(50, "Nome deve ter no máximo 50 caracteres"),
});

interface RouteParams {
  categoryId: string;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { categoryId } = await params;
    const body = await request.json();
    const validation = renameCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", issues: validation.error.issues },
        { status: 400 },
      );
    }

    const result = await renameCategory(categoryId, validation.data.name);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in PATCH /api/categories/[categoryId]:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { categoryId } = await params;
    const userId = await getCurrentUser();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { spaceId } = body;

    if (!spaceId) {
      return NextResponse.json(
        { error: "Space ID is required" },
        { status: 400 },
      );
    }

    // Verificar se a category existe através da cadeia category -> space -> workspace
    const categoryWithWorkspace = await db
      .select({
        workspaceId: workspaces.id,
      })
      .from(categories)
      .innerJoin(spaces, eq(categories.spaceId, spaces.id))
      .innerJoin(workspaces, eq(spaces.workspaceId, workspaces.id))
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!categoryWithWorkspace.length) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const result = await deleteCategory(categoryId, spaceId, userId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/categories/[categoryId]:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
