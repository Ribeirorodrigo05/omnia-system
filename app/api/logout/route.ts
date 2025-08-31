import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.json({ success: true }, { status: 200 });

  // Remove the authentication cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 0, // Expire immediately
    // secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
