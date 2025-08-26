import { authenticateUser } from "@/server/services/auth/authentication";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest, response:NextResponse): Promise<NextResponse> {
  const { email, password } = await request.json();

  const result = await authenticateUser({ email, password });
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  return NextResponse.json({ user: result.user, token: result.token }, { status: 200 });
}