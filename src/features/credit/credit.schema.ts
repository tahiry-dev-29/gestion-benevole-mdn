import { z } from "zod";

export const createCreditSchema = z.object({
  userId: z.number().int().positive("L'identifiant bénévole est requis"),
  montant: z
    .number()
    .positive("Le montant doit être positif")
    .refine((v) => Math.round(v * 100) / 100 === v, {
      message: "Le montant ne doit pas dépasser 2 décimales",
    }),
  date: z.coerce.date(),
  motif: z.string().min(2, "Le motif est requis").max(255),
});

export const listCreditsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  userId: z.coerce.number().int().positive().optional(),
  mois: z.coerce.number().int().min(1).max(12).optional(),
  annee: z.coerce.number().int().min(2000).max(2100).optional(),
});

export const deleteCreditSchema = z.object({
  creditId: z.number().int().positive(),
});

export type CreateCreditInput = z.infer<typeof createCreditSchema>;
export type ListCreditsInput = z.input<typeof listCreditsSchema>;
export type DeleteCreditInput = z.infer<typeof deleteCreditSchema>;
