import { z } from "zod";

export const userSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  role: z.enum(["ADMIN", "BENEVOLE"]).default("BENEVOLE"),
});

export type UserInput = z.infer<typeof userSchema>;
