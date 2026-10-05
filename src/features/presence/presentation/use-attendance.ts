"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listAttendanceAction, pointAction } from "../presence.action";
import type { DateRange } from "../presence.utils";

const ATTENDANCE_KEY = ["attendance"] as const;

export type AttendanceFilters = {
  query: string;
  statut: string;
  seatId: string;
  volunteerId: string;
};

export function useAttendance(
  range: DateRange,
  filters?: AttendanceFilters,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...ATTENDANCE_KEY, range, filters],
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const result = await listAttendanceAction({
        ...range,
        ...(filters?.query.trim() ? { query: filters.query.trim() } : {}),
        ...(filters?.statut && filters.statut !== "ALL"
          ? { statut: filters.statut }
          : {}),
        ...(filters?.seatId ? { seatId: Number(filters.seatId) } : {}),
        ...(filters?.volunteerId
          ? { volunteerId: Number(filters.volunteerId) }
          : {}),
      });
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
  });
}

export function usePointAttendance() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      userId: string;
      date: string;
      seatId: string | null;
      statut: string;
      arrivee: string | null;
      depart: string | null;
    }) => {
      const result = await pointAction(input);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ATTENDANCE_KEY }),
  });
}
