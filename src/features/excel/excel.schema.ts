import { z } from "zod";

import {
  CategoryEnum,
  CertificatStatutEnum,
  jsonSchema,
  SexeEnum,
} from "@/features/user/user.schema";

const optionalJsonValue = z.string().transform((value, context) => {
  if (!value.trim()) return undefined;
  try {
    const parsed = jsonSchema.safeParse(JSON.parse(value));
    if (parsed.success) return parsed.data;
  } catch {
    // Report malformed JSON through the row validation result below.
  }
  context.addIssue({
    code: "custom",
    message: "JSON de disponibilités invalide.",
  });
  return z.NEVER;
});

const booleanFromText = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .pipe(z.enum(["true", "false", "oui", "non"]).or(z.literal("")))
  .transform((value) => value === "true" || value === "oui");

export const excelUserSchema = z.object({
  nom: z.string().trim().min(2),
  prenom: z.string().trim().min(2),
  email: z
    .string()
    .trim()
    .email()
    .transform((email) => email.toLowerCase()),
  role: z.literal("USER"),
  statut: z
    .string()
    .transform((value) => value || "ACTIF")
    .pipe(z.enum(["ACTIF", "INACTIF"])),
  sexe: z
    .string()
    .transform((value) => value || "Non précisé")
    .pipe(SexeEnum),
  age: z
    .string()
    .transform((value) => (value.trim() ? Number(value) : 18))
    .pipe(z.number().int().min(1).max(120)),
  contact: z.string().default(""),
  categorie: z
    .string()
    .transform((value) => value || "UNIVERSITAIRE")
    .pipe(CategoryEnum),
  etablissement: z.string().default("Non renseigné"),
  facebook: z.string().default(""),
  date_entree: z.string().date().or(z.literal("")),
  matricule: z.string().trim().min(1, "Le matricule est requis"),
  societe: z.string().default(""),
  telephone: z.string().trim().min(1, "Le téléphone est requis"),
  dateNaissance: z.string().date().or(z.literal("")),
  siteWeb: z.string().url().or(z.literal("")),
  cvUrl: z
    .string()
    .refine((value) => !value || value.toLowerCase().endsWith(".pdf"), {
      message: "Le CV doit être un fichier PDF.",
    }),
  socialProfile: z.string().url().or(z.literal("")),
  joursDisponibles: z.string().transform((value) =>
    value
      .split(";")
      .map((day) => day.trim())
      .filter(Boolean)
  ),
  disponibilites: optionalJsonValue,
  contactUrgence: z.string().default(""),
  spinneret: z.string().default(""),
  accepteRegles: booleanFromText,
  reglesAccepteesAt: z.string().datetime().or(z.literal("")),
  materielPC: booleanFromText,
  certificatUrl: z
    .string()
    .refine((value) => !value || value.toLowerCase().endsWith(".pdf"), {
      message: "Le certificat doit être un fichier PDF.",
    }),
  certificatStatut: z
    .string()
    .transform((value) => value || "NON_DEMANDE")
    .pipe(CertificatStatutEnum),
});

const optionalPositiveNumber = z
  .string()
  .trim()
  .transform((value) => (value ? Number(value) : undefined))
  .pipe(z.number().int().positive().optional());

export const excelPresenceSchema = z
  .object({
    date: z.string().date(),
    email: z
      .string()
      .trim()
      .email()
      .transform((email) => email.toLowerCase()),
    statut: z.enum(["PRESENT", "ABSENT", "RETARD"]),
    heure_arrivee: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .or(z.literal("")),
    heure_depart: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .or(z.literal("")),
    tableNumber: optionalPositiveNumber,
    seatNumber: optionalPositiveNumber,
  })
  .refine(
    ({ tableNumber, seatNumber }) =>
      (tableNumber === undefined) === (seatNumber === undefined),
    { message: "La table et le siège doivent être renseignés ensemble." }
  );

export type ExcelUserInput = z.infer<typeof excelUserSchema>;
export type ExcelPresenceInput = z.infer<typeof excelPresenceSchema>;

export type ExcelRowError = { ligne: number; champ: string; message: string };
