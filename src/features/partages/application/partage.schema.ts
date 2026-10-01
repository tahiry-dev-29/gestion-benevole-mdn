import { z } from "zod";

export const createPartageSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est requis").max(150),
  contenu: z.string().trim().min(1, "Le contenu est requis").max(20000),
  statut: z.enum(["BROUILLON", "PUBLIE"]).default("BROUILLON"),
});

export const updatePartageSchema = createPartageSchema.partial();

export type CreatePartageInput = z.infer<typeof createPartageSchema>;
export type UpdatePartageInput = z.infer<typeof updatePartageSchema>;
