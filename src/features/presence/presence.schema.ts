import { z } from "zod";

export const presenceFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  dateDebut: z.string().date().optional(),
  dateFin: z.string().date().optional(),
  userId: z.coerce.number().int().optional(),
});

export type PresenceFilterInput = z.infer<typeof presenceFilterSchema>;

export type PresenceRecord = {
  id: number;
  userId: number;
  benevole: string;
  date: string;
  heure_arrivee: string | null;
  heure_depart: string | null;
  statut: string;
  heuresTravaillees: number | null;
};
