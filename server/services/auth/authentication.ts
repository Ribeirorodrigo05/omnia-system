import jwt from "jsonwebtoken";
import { findUserByEmail } from "@/server/repositories/users-repository/users";
import { verifyPassword } from "@/server/utils/functions";
import type { LoginSchema } from "@/server/validators/login-validation";

export const authenticateUser = async ({ email, password }: LoginSchema) => {
  // Implement authentication logic here
  const user = await findUserByEmail(email);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return { success: false, error: "Invalid password" };
  }

  // generate JWT token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    },
  );

  return {
    success: true,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  };
};
