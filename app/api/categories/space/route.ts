import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCategoriesBySpace } from "@/server/services/category-service/category-operations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get("spaceId");

    if (!spaceId) {
      return NextResponse.json(
        { error: "spaceId é obrigatório" },
        { status: 400 },
      );
    }

    const result = await getCategoriesBySpace(spaceId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error in GET /api/categories:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
