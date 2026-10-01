import { z } from "zod";

export const presenceFilterSchema = z.object({
  du: z.string().date().optional(),
  au: z.string().date().optional(),
  table: z.coerce.number().int().positive().optional(),
  statut: z.enum(["PRESENT", "ABSENT", "RETARD"]).optional(),
});

export const pointSchema = z.object({
  userId: z.coerce.number().int().positive(),
  date: z.string().date(),
  seatId: z.coerce.number().int().positive().nullable().optional(),
  statut: z.enum(["PRESENT", "ABSENT", "RETARD"]).default("PRESENT"),
  arrivee: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),
  depart: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .nullable()
    .optional(),
});

export type PresenceRecord = {
  id: number;
  userId: number;
  benevole: string;
  date: string;
  tableNumber: number | null;
  seatNumber: number | null;
  seatId: number | null;
  heure_arrivee: string | null;
  heure_depart: string | null;
  statut: string;
  heuresTravaillees: number | null;
};
