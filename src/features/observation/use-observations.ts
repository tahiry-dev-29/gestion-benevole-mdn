"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createObservationAction,
  deleteObservationAction,
  updateObservationAction,
} from "./observation.action";
import type {
  CreateObservationInput,
  ListObservationsInput,
  UpdateObservationInput,
} from "./observation.schema";
import {
  listObservationsAction,
  type ObservationItem,
} from "./observation-queries.action";

const OBSERVATIONS_KEY = ["observations"] as const;

export function useObservations(filters: ListObservationsInput) {
  return useQuery<ObservationItem[]>({
    queryKey: [...OBSERVATIONS_KEY, filters],
    queryFn: async () => {
      const result = await listObservationsAction(filters);
      if (!result.success) throw new Error(result.error);
      return result.data ?? [];
    },
  });
}

export function useCreateObservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateObservationInput) => {
      const result = await createObservationAction(input);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: OBSERVATIONS_KEY });
    },
  });
}

export function useUpdateObservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateObservationInput) => {
      const result = await updateObservationAction(input);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: OBSERVATIONS_KEY });
    },
  });
}

export function useDeleteObservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (observationId: number) => {
      const result = await deleteObservationAction({ observationId });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: OBSERVATIONS_KEY });
    },
  });
}
