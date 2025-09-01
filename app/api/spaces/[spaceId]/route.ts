import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/services/auth/get-current-user";
import { renameSpace } from "@/server/services/space-service/rename-space";
import { createSpaceSchema } from "@/server/validators/space-validation";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string }> },
) {
  try {
    const { spaceId } = await params;
    const userId = await getCurrentUser();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const validationResult = createSpaceSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const result = await renameSpace(
      spaceId,
      validationResult.data.name,
      userId,
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      space: result.space,
    });
  } catch (error) {
    console.error("Error renaming space:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
