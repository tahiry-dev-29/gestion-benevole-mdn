"use client";

import { useEffect, useMemo, useState } from "react";
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
import { AttendanceStatsPanel } from "./attendance-stats-panel";
import {
  type AttendanceFilters,
  useAttendance,
  usePointAttendance,
} from "./use-attendance";

const INITIAL_FORM: PointageFormState = {
  userId: "",
  tableNumber: "",
  seatId: "",
  status: "PRESENT",
  arrivee: "",
  depart: "",
};
const EMPTY_ROWS: PresenceRecord[] = [];

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
  view = "pointage",
}: {
  volunteers: { id: number; nom: string; prenom: string }[];
  tables: SeatGrid[];
  view?: "pointage" | "historique" | "statistiques";
}) {
  const [mode, setMode] = useState<CalendarMode>(
    view === "statistiques" ? "month" : "day"
  );
  const [selectedDate, setSelectedDate] = useState(() => toIsoDate(new Date()));
  const [form, setForm] = useState<PointageFormState>(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState<AttendanceFilters>({
    query: "",
    statut: "ALL",
    seatId: "",
    volunteerId: "",
  });
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedQuery(filters.query),
      300
    );
    return () => window.clearTimeout(timeout);
  }, [filters.query]);

  const range = useMemo(
    () => computeRange(mode, selectedDate),
    [mode, selectedDate]
  );
  const attendanceFilters: AttendanceFilters = {
    query: debouncedQuery,
    statut: filters.statut,
    seatId: filters.seatId,
    volunteerId: filters.volunteerId,
  };
  const attendanceQuery = useAttendance(range, attendanceFilters);
  const statsEnd = view === "statistiques" ? selectedDate : range.au;
  const statsStartDate = new Date(`${statsEnd}T12:00:00`);
  statsStartDate.setDate(statsStartDate.getDate() - 29);
  const statsRange = { du: toIsoDate(statsStartDate), au: statsEnd };
  const selectedMonthRange = useMemo(
    () => computeRange("month", selectedDate),
    [selectedDate]
  );
  const statsQuery = useAttendance(
    statsRange,
    {
      query: "",
      statut: "ALL",
      seatId: "",
      volunteerId: "",
    },
    { enabled: view === "statistiques" }
  );
  const periodStatsQuery = useAttendance(
    selectedMonthRange,
    {
      query: "",
      statut: "ALL",
      seatId: "",
      volunteerId: "",
    },
    { enabled: view === "statistiques" }
  );
  const occupancyQuery = useAttendance({ du: selectedDate, au: selectedDate });
  const pointMutation = usePointAttendance();
  const rows: PresenceRecord[] = useMemo(
    () => attendanceQuery.data ?? [],
    [attendanceQuery.data]
  );
  const occupancyRows = useMemo(
    () => occupancyQuery.data ?? [],
    [occupancyQuery.data]
  );
  const dataError =
    attendanceQuery.error?.message ??
    statsQuery.error?.message ??
    periodStatsQuery.error?.message ??
    (occupancyQuery.isError
      ? "Impossible de vérifier les sièges déjà occupés."
      : null);
  const busySeatIds = useMemo(
    () => collectBusySeats(occupancyRows, selectedDate, form.userId),
    [occupancyRows, selectedDate, form.userId]
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
        onSuccess: () => {
          toast.success("Pointage enregistré.");
          setForm(INITIAL_FORM);
          setIsEditing(false);
        },
        onError: (error) => toast.error(error.message),
      }
    );
  }

  return (
    <div className="grid gap-5">
      {view !== "statistiques" ? (
        <div className="flex justify-end">
          <ImportExportButtons dataset="presences" exportRange={range} />
        </div>
      ) : null}
      <AttendanceCalendar
        mode={mode}
        selectedDate={selectedDate}
        range={range}
        onModeChange={setMode}
        onDateChange={setSelectedDate}
      />
      {view === "pointage" ? (
        <AttendanceForm
          volunteers={volunteers}
          tables={tables}
          busySeatIds={busySeatIds}
          value={form}
          isPending={pointMutation.isPending}
          isEditing={isEditing}
          onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
          onCancelEdit={() => {
            setIsEditing(false);
            setForm(INITIAL_FORM);
          }}
          onSubmit={submit}
        />
      ) : null}
      {view === "statistiques" ? (
        <AttendanceStatsPanel
          selectedDate={selectedDate}
          statisticsRows={statsQuery.data ?? EMPTY_ROWS}
          monthRows={periodStatsQuery.data ?? EMPTY_ROWS}
        />
      ) : null}
      {view === "historique" ? (
        <AttendanceTable
          rows={rows}
          isPending={attendanceQuery.isPending}
          tables={tables}
          volunteers={volunteers}
          filters={filters}
          onFiltersChange={setFilters}
          isFetching={attendanceQuery.isFetching || occupancyQuery.isFetching}
          onRefresh={() => {
            void Promise.all([
              attendanceQuery.refetch(),
              occupancyQuery.refetch(),
            ]);
          }}
          onEdit={() => undefined}
          readOnly
        />
      ) : null}
      {dataError ? (
        <p role="alert" className="text-sm text-destructive">
          {dataError}
        </p>
      ) : null}
    </div>
  );
}
