"use server";

import { db } from "@/server/database";
import { categories } from "@/server/database/schemas";

export async function testCategories() {
  try {
    console.log("Testing categories table...");

    // Busca todas as categories
    const allCategories = await db.select().from(categories);
    console.log("All categories:", allCategories);

    return allCategories;
  } catch (error) {
    console.error("Error testing categories:", error);
    return [];
  }
}