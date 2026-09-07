import { z } from "zod";

export const CategoryEnum = z.enum([
  "PRIMAIRE",
  "COLLEGIEN",
  "UNIVERSITAIRE",
  "SALARIE",
]);

export type Category = z.infer<typeof CategoryEnum>;

export const SexeEnum = z.enum(["Masculin", "Féminin", "Non précisé"]);

export type Sexe = z.infer<typeof SexeEnum>;

export const userSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  role: z.enum(["ADMIN", "BENEVOLE"]).default("BENEVOLE"),
  statut: z.enum(["ACTIF", "INACTIF"]).default("ACTIF"),
  photo: z.string().nullable().optional(),
  sexe: SexeEnum.optional(),
  age: z.coerce
    .number()
    .int("L'âge doit être un nombre entier")
    .min(1, "L'âge doit être compris entre 1 et 120 ans")
    .max(120, "L'âge doit être compris entre 1 et 120 ans")
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
  sexe: SexeEnum.optional(),
  age: z.coerce
    .number()
    .int("L'âge doit être un nombre entier")
    .min(1, "L'âge doit être compris entre 1 et 120 ans")
    .max(120, "L'âge doit être compris entre 1 et 120 ans")
    .optional(),
  contact: z.string().optional(),
  categorie: CategoryEnum.optional(),
  etablissement: z.string().optional(),
  facebook: z.string().optional(),
});

export type UserInput = z.infer<typeof userSchema>;
export type CreateUserInput = z.input<typeof userSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
