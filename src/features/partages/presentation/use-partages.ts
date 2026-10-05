"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import type { Partage } from "../domain/partage.entity";

export type PartageInput = {
  titre: string;
  contenu: string;
  statut: "BROUILLON" | "PUBLIE";
};

export type PartageQueryParams = {
  q?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: string;
  statut?: "BROUILLON" | "PUBLIE";
};

type PartagesResult = { data: Partage[]; total: number };

const partageResponseSchema = z.object({
  id: z.number(),
  titre: z.string(),
  contenu: z.string(),
  datePublication: z.string(),
  statut: z.enum(["BROUILLON", "PUBLIE"]),
  auteur: z.string().nullable(),
});
const partagesResponseSchema = z.object({
  data: z.array(partageResponseSchema),
  total: z.number().int().nonnegative(),
});
const deleteResponseSchema = z.object({ success: z.literal(true) });

async function requestJson<T>(
  url: string,
  schema: z.ZodType<T>,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error("La requête a échoué");
  const payload: unknown = await response.json();
  return schema.parse(payload);
}

export function usePartages(params: PartageQueryParams) {
  return useQuery({
    queryKey: ["partages", params],
    queryFn: () => {
      const sp = new URLSearchParams();
      if (params.q) sp.set("q", params.q);
      sp.set("page", String(params.page ?? 1));
      sp.set("pageSize", String(params.pageSize ?? 10));
      if (params.sortBy) sp.set("sortBy", params.sortBy);
      if (params.sortDir) sp.set("sortDir", params.sortDir);
      if (params.statut) sp.set("statut", params.statut);
      return requestJson<PartagesResult>(
        `/api/partages?${sp.toString()}`,
        partagesResponseSchema
      );
    },
  });
}

export function useSavePartage() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: PartageInput }) =>
      requestJson<Partage>(
        id ? `/api/partages/${id}` : "/api/partages",
        partageResponseSchema,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }
      ),
    onSuccess: () => client.invalidateQueries({ queryKey: ["partages"] }),
  });
}

export function useDeletePartage() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      requestJson<{ success: true }>(
        `/api/partages/${id}`,
        deleteResponseSchema,
        { method: "DELETE" }
      ),
    onSuccess: () => client.invalidateQueries({ queryKey: ["partages"] }),
  });
}
