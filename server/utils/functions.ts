import { compare } from "bcryptjs";
export function verifyPassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}
