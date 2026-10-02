"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSeatAction,
  createTableAction,
  deleteSeatAction,
  listSeatsAction,
  renameTableAction,
} from "../places.action";
import type { SeatGrid } from "../places.schema";

const PLACES_KEY = ["places"] as const;

export function usePlaces(initialTables: SeatGrid[]) {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: PLACES_KEY,
    initialData: initialTables,
    queryFn: async () => {
      const result = await listSeatsAction();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
  const invalidate = async () =>
    client.invalidateQueries({ queryKey: PLACES_KEY });
  const createTable = useMutation({
    mutationFn: async (input: { seatCount: string }) => {
      const result = await createTableAction(input);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: invalidate,
  });
  const renameTable = useMutation({
    mutationFn: async (input: { oldNumber: number; newNumber: string }) => {
      const result = await renameTableAction(input);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: invalidate,
  });
  const createSeat = useMutation({
    mutationFn: async (input: { tableNumber: number; seatNumber: number }) => {
      const result = await createSeatAction(input);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: invalidate,
  });
  const deleteSeat = useMutation({
    mutationFn: async (input: { seatId: number }) => {
      const result = await deleteSeatAction(input);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: invalidate,
  });
  return { query, createTable, renameTable, createSeat, deleteSeat };
}
