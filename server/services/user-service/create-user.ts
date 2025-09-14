import bcrypt from "bcryptjs";

import { saveUser } from "@/server/repositories/users-repository/users";
import type { RegisterValidationSchema } from "@/server/validators/register-validation";
import { registerValidation } from "@/server/validators/register-validation";

export const createUser = async (data: RegisterValidationSchema) => {
  try {
    const validation = registerValidation(data);
    if (!validation.success) {
      console.log("User registration validation failed:", validation.errors);
      return {
        success: false,
        errors: validation.errors,
        fieldErrors: validation.fieldErrors,
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await saveUser({
      name: data.fullName,
      email: data.email,
      password: hashedPassword,
    });

    return {
      success: true,
      user: result,
    };
  } catch (error: unknown) {
    console.error("Error creating user:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }

  // use bcrypt or another hashing library to hash the password
};

export const getUserWorkspaces = async (userId: string) => {
  try {
  } catch (error: unknown) {}
};
