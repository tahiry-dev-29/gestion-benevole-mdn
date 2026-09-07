import { z } from "zod";

export const CategoryEnum = z.enum([
  "PRIMAIRE",
  "COLLEGIEN",
  "UNIVERSITAIRE",
  "SALARIE",
]);

export const userSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  role: z.enum(["ADMIN", "BENEVOLE"]).default("BENEVOLE"),
  statut: z.enum(["ACTIF", "INACTIF"]).default("ACTIF"),
  photo: z.string().nullable().optional(),
  sexe: z.string().optional(),
  age: z.coerce
    .number()
    .int("L'âge doit être un nombre entier")
    .positive("L'âge doit être positif")
    .optional(),
  contact: z.string().optional(),
  categorie: CategoryEnum.optional(),
  etablissement: z.string().optional(),
  facebook: z.string().optional(),
});

export const updateRoleSchema = z.object({
  userId: z.number(),
  role: z.enum(["ADMIN", "BENEVOLE"]),
});

export const updateProfileSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  photo: z.string().nullable().optional(),
  sexe: z.string().optional(),
  age: z.coerce
    .number()
    .int("L'âge doit être un nombre entier")
    .positive("L'âge doit être positif")
    .optional(),
  contact: z.string().optional(),
  categorie: CategoryEnum.optional(),
  etablissement: z.string().optional(),
  facebook: z.string().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;