import { z } from "zod";

export const roleEnum = z.enum(["ADMIN", "BENEVOLE"]);

export const createBenevoleSchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(100),
  prenom: z.string().min(1, "Le prénom est requis").max(100),
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  role: roleEnum.default("BENEVOLE"),
  dateEntree: z.string().optional(),
});

export const updateBenevoleSchema = z.object({
  nom: z.string().min(1).max(100).optional(),
  prenom: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: roleEnum.optional(),
  dateEntree: z.string().optional(),
});

export type CreateBenevoleDto = z.infer<typeof createBenevoleSchema>;
export type UpdateBenevoleDto = z.infer<typeof updateBenevoleSchema>;
