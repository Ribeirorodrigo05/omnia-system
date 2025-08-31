import { type NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/server/services/auth/authentication";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { email, password } = await request.json();

  const result = await authenticateUser({ email, password });
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const response = NextResponse.json({ user: result.user }, { status: 200 });

  response.cookies.set("token", result.token ?? "", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 dia
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
