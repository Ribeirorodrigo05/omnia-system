import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createList } from "@/server/services/list/create-list";
import type { CreateListInput } from "@/server/types/categories";

export async function POST(request: NextRequest) {
  try {
    const body: CreateListInput = await request.json();
    
    const result = await createList(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json(result.list);
  } catch (error) {
    console.error("Error in categories API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}