import { z } from "zod";

export const createActiviteSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").max(150),
  description: z.string().min(1, "La description est requise"),
  date: z.string().min(1, "La date est requise"),
});

export const updateActiviteSchema = createActiviteSchema.partial();

export type CreateActiviteDto = z.infer<typeof createActiviteSchema>;
export type UpdateActiviteDto = z.infer<typeof updateActiviteSchema>;
