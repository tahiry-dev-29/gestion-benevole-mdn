import { z } from "zod";

export const temoignageSchema = z.object({
  nom_auteur: z.string().trim().max(80, "80 caractères maximum").optional(),
  contenu: z
    .string()
    .trim()
    .min(20, "Votre témoignage doit contenir au moins 20 caractères")
    .max(2000, "2000 caractères maximum"),
  website: z.string().max(0).optional(),
});

export const moderationSchema = z.object({
  id: z.number().int().positive(),
  action: z.enum(["publier", "rejeter", "supprimer"]),
});

export type TemoignageInput = z.infer<typeof temoignageSchema>;
