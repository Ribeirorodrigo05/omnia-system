import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { renameCategory } from "@/server/services/category-service/category-operations";

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
