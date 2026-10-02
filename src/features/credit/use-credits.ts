"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createCreditAction,
  deleteCreditAction,
  listCreditsAction,
} from "./credit.action";
import type { CreateCreditInput, ListCreditsInput } from "./credit.schema";
import { getCumulCreditsAction } from "./credit-cumul.action";

const CREDITS_KEY = ["credits"] as const;
const CREDIT_TOTALS_KEY = ["credits-cumul"] as const;

export function useCredits(filters: ListCreditsInput) {
  return useQuery({
    queryKey: [...CREDITS_KEY, filters],
    queryFn: async () => {
      const result = await listCreditsAction(filters);
      if (!result.success) throw new Error(result.error);
      return result.data ?? [];
    },
  });
}

export function useCreditTotals(filters: { mois?: number; annee?: number }) {
  return useQuery({
    queryKey: [...CREDIT_TOTALS_KEY, filters],
    queryFn: async () => {
      const result = await getCumulCreditsAction(filters);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function useCreateCredit() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCreditInput) => {
      const result = await createCreditAction(input);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: CREDITS_KEY }),
        client.invalidateQueries({ queryKey: CREDIT_TOTALS_KEY }),
      ]);
    },
  });
}

export function useDeleteCredit() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (creditId: number) => {
      const result = await deleteCreditAction({ creditId });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: CREDITS_KEY }),
        client.invalidateQueries({ queryKey: CREDIT_TOTALS_KEY }),
      ]);
    },
  });
}
