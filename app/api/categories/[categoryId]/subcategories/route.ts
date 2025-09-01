import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSubcategories } from "@/server/services/category-service/category-operations";

interface RouteParams {
  categoryId: string;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<RouteParams> },
) {
  try {
    const { categoryId } = await params;

    const result = await getSubcategories(categoryId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error(
      "Error in GET /api/categories/[categoryId]/subcategories:",
      error,
    );
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
