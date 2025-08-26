import type { UserInsertData } from "@/server/types/users";
import { db } from "../../database";
import { users } from "../../database/schemas/users";
import { eq } from "drizzle-orm";

export const saveUser = async ({ name, email, password }: UserInsertData) => {
  // Implement the logic to save the user to the database
  const result = await db
    .insert(users)
    .values({
      name,
      email,
      password,
    })
    .returning();

  return result[0]; // Return the created user
};

export const findUserByEmail = async (email: string) => {
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
        password: users.password,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .execute();

  return user[0] || null;
};
