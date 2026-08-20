"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateActiviteDto,
  UpdateActiviteDto,
} from "../application/activite.schema";
import type { Activite } from "../domain/activite.entity";

export type ActiviteQueryParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
};

async function fetchActivites(params: ActiviteQueryParams): Promise<{
  data: Activite[];
  total: number;
}> {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 10));
  if (params.sortBy) sp.set("sortBy", params.sortBy);
  if (params.sortDir) sp.set("sortDir", params.sortDir);

  const res = await fetch(`/api/activites?${sp.toString()}`);
  if (!res.ok) throw new Error("Impossible de charger les activités");
  return res.json();
}

export function useActivites(params: ActiviteQueryParams) {
  return useQuery({
    queryKey: ["activites", params],
    queryFn: () => fetchActivites(params),
  });
}

export function useCreateActivite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateActiviteDto) => {
      const res = await fetch("/api/activites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Échec de la création");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activites"] }),
  });
}

export function useUpdateActivite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number;
      input: UpdateActiviteDto;
    }) => {
      const res = await fetch(`/api/activites/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Échec de la mise à jour");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activites"] }),
  });
}

export function useDeleteActivite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/activites/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activites"] }),
  });
}
