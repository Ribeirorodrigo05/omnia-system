import { z } from "zod";

export const registerValidationSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(100, "Nome não pode ter mais de 100 caracteres")
      .trim(),
    email: z
      .string()
      .email("Por favor, insira um email válido")
      .max(100, "Email não pode ter mais de 100 caracteres")
      .trim(),
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(100, "Senha não pode ter mais de 100 caracteres")
      .trim(),
    confirmPassword: z
      .string()
      .min(6, "Confirmação de senha deve ter pelo menos 6 caracteres")
      .max(100, "Confirmação de senha não pode ter mais de 100 caracteres")
      .trim(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso para continuar",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem. Verifique e tente novamente",
    path: ["confirmPassword"],
  });

export type RegisterValidationSchema = z.infer<typeof registerValidationSchema>;

export const registerValidation = (data: RegisterValidationSchema) => {
  const result = registerValidationSchema.safeParse(data);
  if (!result.success) {
    const errors: string[] = [];
    const fieldErrors = result.error.flatten().fieldErrors;

    Object.entries(fieldErrors).forEach(([, messages]) => {
      if (messages && messages.length > 0) {
        errors.push(...messages);
      }
    });

    return {
      success: false,
      errors,
      fieldErrors,
    };
  }
  return { success: true, data: result.data };
};
