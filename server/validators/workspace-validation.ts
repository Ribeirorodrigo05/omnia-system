import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(4, "O nome deve ter pelo menos 4 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "O nome deve conter apenas letras, números, espaços, hífens e sublinhados",
    )
    .trim(),
});

export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;
