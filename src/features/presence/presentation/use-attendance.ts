"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { listAttendanceAction, pointAction } from "../presence.action";
import type { DateRange } from "../presence.utils";

const ATTENDANCE_KEY = ["attendance"] as const;

export function useAttendance(range: DateRange) {
  return useQuery({
    queryKey: [...ATTENDANCE_KEY, range],
    queryFn: async () => {
      const result = await listAttendanceAction(range);
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
