import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  rememberMe: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const validateLogin = (data: LoginSchema) => {
  return loginSchema.safeParse(data);
};
