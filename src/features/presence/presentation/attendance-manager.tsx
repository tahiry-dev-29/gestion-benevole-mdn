"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ImportExportButtons } from "@/features/excel/import-export-buttons";
import type { SeatGrid } from "@/features/places/places.schema";

import type { PresenceRecord } from "../presence.schema";
import { type CalendarMode, computeRange, toIsoDate } from "../presence.utils";

import { AttendanceCalendar } from "./_components/attendance-calendar";
import {
  AttendanceForm,
  type PointageFormState,
} from "./_components/attendance-form";
import { AttendanceTable } from "./_components/attendance-table";
import { useAttendance, usePointAttendance } from "./use-attendance";

const INITIAL_FORM: PointageFormState = {
  userId: "",
  tableNumber: "",
  seatId: "",
  status: "PRESENT",
  arrivee: "",
  depart: "",
};

/** Sièges déjà pris à la date choisie, hors bénévole en cours de pointage. */
function collectBusySeats(
  rows: PresenceRecord[],
  selectedDate: string,
  userId: string
) {
  return new Set(
    rows
      .filter(
        (row) => row.date === selectedDate && row.userId !== Number(userId)
      )
      .map((row) => row.seatId)
      .filter((id): id is number => id !== null)
  );
}

export function AttendanceManager({
  volunteers,
  tables,
}: {
  volunteers: { id: number; nom: string; prenom: string }[];
  tables: SeatGrid[];
}) {
  const [mode, setMode] = useState<CalendarMode>("day");
  const [selectedDate, setSelectedDate] = useState(() => toIsoDate(new Date()));
  const [form, setForm] = useState<PointageFormState>(INITIAL_FORM);

  const range = useMemo(
    () => computeRange(mode, selectedDate),
    [mode, selectedDate]
  );
  const attendanceQuery = useAttendance(range);
  const pointMutation = usePointAttendance();
  const rows: PresenceRecord[] = useMemo(
    () => attendanceQuery.data ?? [],
    [attendanceQuery.data]
  );

  const busySeatIds = useMemo(
    () => collectBusySeats(rows, selectedDate, form.userId),
    [rows, selectedDate, form.userId]
  );

  function submit() {
    if (!form.userId) return toast.error("Choisissez un bénévole.");
    pointMutation.mutate(
      {
        userId: form.userId,
        date: selectedDate,
        seatId: form.seatId || null,
        statut: form.status,
        arrivee: form.arrivee || null,
        depart: form.depart || null,
      },
      {
        onSuccess: () => toast.success("Pointage enregistré."),
        onError: (error) => toast.error(error.message),
      }
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ImportExportButtons dataset="presences" exportRange={range} />
      </div>
      <AttendanceCalendar
        mode={mode}
        selectedDate={selectedDate}
        range={range}
        onModeChange={setMode}
        onDateChange={setSelectedDate}
      />
      <AttendanceForm
        volunteers={volunteers}
        tables={tables}
        busySeatIds={busySeatIds}
        value={form}
        isPending={pointMutation.isPending}
        onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
        onSubmit={submit}
      />
      <AttendanceTable rows={rows} isPending={attendanceQuery.isPending} />
      {attendanceQuery.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {attendanceQuery.error.message}
        </p>
      ) : null}
    </div>
  );
}
