import type { UserInsertData } from "@/server/types/users";
import { db } from "../../database";
import { users } from "../../database/schemas/users";

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
