import { z } from "zod";

export const contactSchema = z.object({
  nom: z.string().min(2, "Le nom est obligatoire"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactInput = z.infer<typeof contactSchema>;
