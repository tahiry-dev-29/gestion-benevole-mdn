import { z } from "zod";

import { CategoryEnum, SexeEnum } from "@/features/user/user.schema";

export const excelUserSchema = z.object({
  nom: z.string().trim().min(2),
  prenom: z.string().trim().min(2),
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  role: z.enum(["ADMIN", "BENEVOLE"]).default("BENEVOLE"),
  statut: z.enum(["ACTIF", "INACTIF"]).default("ACTIF"),
  sexe: SexeEnum.default("Non précisé"),
  age: z.coerce.number().int().min(1).max(120).default(18),
  contact: z.string().default(""),
  categorie: CategoryEnum.default("UNIVERSITAIRE"),
  etablissement: z.string().default("Non renseigné"),
  facebook: z.string().default(""),
});

export const excelPresenceSchema = z.object({
  date: z.string().date(),
  email: z.string().trim().email().transform((email) => email.toLowerCase()),
  statut: z.enum(["PRESENT", "ABSENT", "RETARD"]),
  heure_arrivee: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).or(z.literal("")),
  heure_depart: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).or(z.literal("")),
});

export type ExcelUserInput = z.infer<typeof excelUserSchema>;
export type ExcelPresenceInput = z.infer<typeof excelPresenceSchema>;

export type ExcelRowError = { ligne: number; champ: string; message: string };
