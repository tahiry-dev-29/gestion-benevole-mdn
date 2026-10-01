import { z } from "zod";

export const createObservationSchema = z.object({
  userId: z.number().int().positive("L'identifiant bénévole est requis"),
  mois: z
    .number()
    .int()
    .min(1, "Le mois doit être compris entre 1 et 12")
    .max(12, "Le mois doit être compris entre 1 et 12"),
  annee: z
    .number()
    .int()
    .min(2000, "L'année est invalide")
    .max(2100, "L'année est invalide"),
  contenu: z
    .string()
    .min(5, "Le contenu est trop court")
    .max(1000, "Le contenu ne doit pas dépasser 1000 caractères"),
});

export const updateObservationSchema = z.object({
  observationId: z.number().int().positive(),
  contenu: z
    .string()
    .min(5, "Le contenu est trop court")
    .max(1000, "Le contenu ne doit pas dépasser 1000 caractères"),
});

export const deleteObservationSchema = z.object({
  observationId: z.number().int().positive(),
});

export const listObservationsSchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  mois: z.coerce.number().int().min(1).max(12).optional(),
  annee: z.coerce.number().int().min(2000).max(2100).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateObservationInput = z.infer<typeof createObservationSchema>;
export type UpdateObservationInput = z.infer<typeof updateObservationSchema>;
export type DeleteObservationInput = z.infer<typeof deleteObservationSchema>;
export type ListObservationsInput = z.input<typeof listObservationsSchema>;
