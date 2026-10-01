"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createVolunteerAction,
  deleteVolunteerAction,
  getRoleCountsAction,
  getVolunteerAction,
  listVolunteersAction,
  setStatutAction,
  updateVolunteerAction,
} from "../volunteer.action";
import type { ListVolunteersParams } from "../volunteer.entity";
import type {
  CreateVolunteerInput,
  UpdateVolunteerInput,
} from "../volunteer.schema";

const VOLUNTEERS_KEY = "volunteers";

export function useVolunteers(params: ListVolunteersParams) {
  return useQuery({
    queryKey: [VOLUNTEERS_KEY, params],
    queryFn: async () => {
      const res = await listVolunteersAction(params);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
}

export function useVolunteer(id: number) {
  return useQuery({
    queryKey: [VOLUNTEERS_KEY, "detail", id],
    enabled: Number.isFinite(id),
    queryFn: async () => {
      const res = await getVolunteerAction(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
}

export function useRoleCounts() {
  return useQuery({
    queryKey: [VOLUNTEERS_KEY, "counts"],
    queryFn: async () => {
      const res = await getRoleCountsAction();
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });
}

function useInvalidateVolunteers() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: [VOLUNTEERS_KEY] });
}

export function useCreateVolunteer() {
  const invalidate = useInvalidateVolunteers();
  return useMutation({
    mutationFn: async (input: CreateVolunteerInput) => {
      const res = await createVolunteerAction(input);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: invalidate,
  });
}

export function useUpdateVolunteer() {
  const invalidate = useInvalidateVolunteers();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number;
      input: UpdateVolunteerInput;
    }) => {
      const res = await updateVolunteerAction(id, input);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteVolunteer() {
  const invalidate = useInvalidateVolunteers();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteVolunteerAction(id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: invalidate,
  });
}

export function useSetVolunteerStatut() {
  const invalidate = useInvalidateVolunteers();
  return useMutation({
    mutationFn: async ({
      id,
      statut,
    }: {
      id: number;
      statut: "ACTIF" | "INACTIF";
    }) => {
      const res = await setStatutAction({ id, statut });
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    onSuccess: invalidate,
  });
}
