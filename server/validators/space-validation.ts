import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(255, "O nome deve ter no máximo 255 caracteres")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "O nome deve conter apenas letras, números, espaços, hífens e sublinhados",
    )
    .trim(),
  workspaceId: z.string().uuid("ID do workspace inválido"),
});

export type CreateSpaceSchema = z.infer<typeof createSpaceSchema>;
