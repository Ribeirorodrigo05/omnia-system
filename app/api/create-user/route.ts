import { type NextRequest, NextResponse } from "next/server";
import { createUser } from "@/server/services/users-service/create-user";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();

  try {
    const result = await createUser(data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          errors: result.errors,
          fieldErrors: result.fieldErrors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true, user: result.user });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
