"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  CreateBenevoleDto,
  UpdateBenevoleDto,
} from "../application/benevole.schema";
import type { Benevole } from "../domain/benevole.entity";

export type BenevoleQueryParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
};

async function fetchBenevoles(params: BenevoleQueryParams): Promise<{
  data: Benevole[];
  total: number;
}> {
  const sp = new URLSearchParams();
  if (params.q) sp.set("q", params.q);
  sp.set("page", String(params.page ?? 1));
  sp.set("pageSize", String(params.pageSize ?? 10));
  if (params.sortBy) sp.set("sortBy", params.sortBy);
  if (params.sortDir) sp.set("sortDir", params.sortDir);

  const res = await fetch(`/api/benevoles?${sp.toString()}`);
  if (!res.ok) throw new Error("Impossible de charger les bénévoles");
  return res.json();
}

export function useBenevoles(params: BenevoleQueryParams) {
  return useQuery({
    queryKey: ["benevoles", params],
    queryFn: () => fetchBenevoles(params),
  });
}

export function useCreateBenevole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateBenevoleDto) => {
      const res = await fetch("/api/benevoles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Échec de la création");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["benevoles"] }),
  });
}

export function useUpdateBenevole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: number;
      input: UpdateBenevoleDto;
    }) => {
      const res = await fetch(`/api/benevoles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Échec de la mise à jour");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["benevoles"] }),
  });
}

export function useDeleteBenevole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/benevoles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec de la suppression");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["benevoles"] }),
  });
}
