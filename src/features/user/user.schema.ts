import type { Prisma } from "@prisma/client";
import { z } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
export const jsonSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(z.string(), jsonSchema)])
);

export const CategoryEnum = z.enum([
  "PRIMAIRE",
  "COLLEGIEN",
  "UNIVERSITAIRE",
  "SALARIE",
]);

export type Category = z.infer<typeof CategoryEnum>;

export const SexeEnum = z.enum(["Masculin", "Féminin", "Non précisé"]);

export type Sexe = z.infer<typeof SexeEnum>;

export const RoleEnum = z.enum(["SUPER_ADMIN", "ADMIN", "VOLUNTEER", "USER"]);
export type RoleType = z.infer<typeof RoleEnum>;

export const CertificatStatutEnum = z.enum([
  "NON_DEMANDE",
  "EN_ATTENTE",
  "APPROUVE",
  "REJETE",
]);
export type CertificatStatut = z.infer<typeof CertificatStatutEnum>;

// Schéma de création d'un USER (role forcé à USER côté serveur)
export const createUserSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  sexe: SexeEnum.optional(),
  matricule: z.string().min(1, "Le matricule est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  materielPC: z.boolean().default(false),
  accepteRegles: z.boolean().default(false),
  spinneret: z.string().min(1, "Le spinneret est requis"),
  etablissement: z.string().optional(),
  societe: z.string().optional(),
  // Optionnels
  age: z.coerce
    .number()
    .int()
    .min(1)
    .max(120)
    .optional(),
  dateNaissance: z.string().optional(),
  socialProfile: z.string().url("URL invalide").optional().or(z.literal("")),
  cvUrl: z
    .string()
    .optional()
    .refine((v) => !v || v.endsWith(".pdf"), { message: "Le CV doit être un fichier PDF" }),
  siteWeb: z.string().url("URL invalide").optional().or(z.literal("")),
  joursDisponibles: z.array(z.string()).optional(),
  disponibilites: jsonSchema.optional(),
  contactUrgence: z.string().optional(),
  facebook: z.string().optional(),
  categorie: CategoryEnum.optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// Schéma de mise à jour (similaire, email non modifiable ici)
export const updateUserSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  sexe: SexeEnum.optional(),
  matricule: z.string().min(1, "Le matricule est requis"),
  telephone: z.string().min(1, "Le téléphone est requis"),
  materielPC: z.boolean(),
  accepteRegles: z.boolean(),
  spinneret: z.string().optional(),
  etablissement: z.string().optional(),
  societe: z.string().optional(),
  age: z.coerce.number().int().min(1).max(120).optional(),
  dateNaissance: z.string().optional(),
  socialProfile: z.string().url("URL invalide").optional().or(z.literal("")),
  cvUrl: z
    .string()
    .optional()
    .refine((v) => !v || v.endsWith(".pdf"), { message: "Le CV doit être un fichier PDF" }),
  certificatUrl: z
    .string()
    .optional()
    .refine((v) => !v || v.endsWith(".pdf"), { message: "Le certificat doit être un fichier PDF" }),
  siteWeb: z.string().url("URL invalide").optional().or(z.literal("")),
  joursDisponibles: z.array(z.string()).optional(),
  disponibilites: jsonSchema.optional(),
  contactUrgence: z.string().optional(),
  facebook: z.string().optional(),
  categorie: CategoryEnum.optional(),
  statut: z.enum(["ACTIF", "INACTIF"]).optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// Ancien schéma conservé pour compatibilité
export const userSchema = createUserSchema;
export type UserInput = CreateUserInput;

export const updateRoleSchema = z.object({
  userId: z.number(),
  role: RoleEnum,
});

export const updateProfileSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  photo: z.string().nullable().optional(),
  sexe: SexeEnum.optional(),
  age: z.coerce.number().int().min(1).max(120).optional(),
  contact: z.string().optional(),
  categorie: CategoryEnum.optional(),
  etablissement: z.string().optional(),
  facebook: z.string().optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export const approveCertificateSchema = z.object({
  userId: z.number().int().positive(),
});

export const rejectCertificateSchema = z.object({
  userId: z.number().int().positive(),
  motif: z.string().min(1, "Le motif de rejet est requis"),
});

export type ApproveCertificateInput = z.infer<typeof approveCertificateSchema>;
export type RejectCertificateInput = z.infer<typeof rejectCertificateSchema>;
