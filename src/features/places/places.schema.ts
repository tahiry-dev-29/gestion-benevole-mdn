import { z } from "zod";

export const createTableSchema = z.object({
  seatCount: z.coerce.number().int().min(1).max(100),
  tableNumber: z.coerce.number().int().positive().optional(),
});

export const renameTableSchema = z.object({
  oldNumber: z.coerce.number().int().positive(),
  newNumber: z.coerce.number().int().positive(),
});

export const seatSchema = z.object({
  tableNumber: z.coerce.number().int().positive(),
  seatNumber: z.coerce.number().int().positive(),
});

export const updateSeatNumberSchema = seatSchema.extend({
  seatId: z.coerce.number().int().positive(),
});

export const deleteSeatSchema = z.object({
  seatId: z.coerce.number().int().positive(),
});

export type SeatGrid = {
  tableNumber: number;
  seats: {
    id: number;
    seatNumber: number;
    label: string | null;
    occupiedToday: boolean;
  }[];
};
