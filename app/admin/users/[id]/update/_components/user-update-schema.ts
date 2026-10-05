import { z } from "zod";

export const userUpdateFormSchema = z
  .object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    sexe: z.enum(["Masculin", "Féminin", "Non précisé"]).optional(),
    matricule: z.string().min(1, "Le matricule est requis"),
    telephone: z.string().min(1, "Le téléphone est requis"),
    materielPC: z.boolean(),
    accepteRegles: z.boolean(),
    spinneret: z.string().optional(),
    etablissement: z.string().optional(),
    societe: z.string().optional(),
    age: z.number().int().min(1).max(120).optional(),
    dateNaissance: z.string().optional(),
    socialProfile: z.string().optional(),
    cvUrl: z.string().optional(),
    certificatUrl: z.string().optional(),
    siteWeb: z.string().optional(),
    joursDisponibles: z.array(z.string()).optional(),
    contactUrgence: z.string().optional(),
    facebook: z.string().optional(),
    categorie: z
      .enum(["PRIMAIRE", "COLLEGIEN", "UNIVERSITAIRE", "SALARIE"])
      .optional(),
    statut: z.enum(["ACTIF", "INACTIF"]).optional(),
  })
  .refine(
    (data) => Boolean(data.etablissement?.trim() || data.societe?.trim()),
    {
      message: "Une école ou une société est requise",
      path: ["etablissement"],
    }
  );

export type FormValues = z.infer<typeof userUpdateFormSchema>;
