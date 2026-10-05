"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Clock3, UsersRound } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  };
  const attendanceQuery = useAttendance(range, attendanceFilters);
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

  function editRecord(record: PresenceRecord) {
    setIsEditing(true);
    setMode("day");
    setSelectedDate(record.date);
    setForm({
      userId: String(record.userId),
      tableNumber: record.tableNumber ? String(record.tableNumber) : "",
      seatId: record.seatId ? String(record.seatId) : "",
      status: record.statut,
      arrivee: record.heure_arrivee ?? "",
      depart: record.heure_depart ?? "",
    });
  }

  return (
    <div className="grid gap-5">
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
        <section
          className="grid gap-3 sm:grid-cols-3"
          aria-label="Résumé de la période"
        >
          <Card className="glass-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CalendarCheck aria-hidden="true" className="size-4" />{" "}
                Pointages
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tabular-nums">
              {rows.length}
            </CardContent>
          </Card>
          <Card className="glass-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <UsersRound aria-hidden="true" className="size-4" /> Bénévoles
                présents
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tabular-nums">
              {
                new Set(
                  rows
                    .filter((row) => row.statut === "PRESENT")
                    .map((row) => row.userId)
                ).size
              }
            </CardContent>
          </Card>
          <Card className="glass-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock3 aria-hidden="true" className="size-4" /> Heures
                enregistrées
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold tabular-nums">
              {rows
                .reduce((total, row) => total + (row.heuresTravaillees ?? 0), 0)
                .toLocaleString("fr-FR", { maximumFractionDigits: 1 })}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                h
              </span>
            </CardContent>
          </Card>
        </section>
      ) : null}
      <AttendanceTable
        rows={rows}
        isPending={attendanceQuery.isPending}
        tables={tables}
        filters={filters}
        onFiltersChange={setFilters}
        isFetching={attendanceQuery.isFetching || occupancyQuery.isFetching}
        onRefresh={() => {
          void Promise.all([
            attendanceQuery.refetch(),
            occupancyQuery.refetch(),
          ]);
        }}
        onEdit={view === "pointage" ? editRecord : () => undefined}
      />
      {attendanceQuery.isError || occupancyQuery.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {attendanceQuery.isError
            ? attendanceQuery.error.message
            : "Impossible de vérifier les sièges déjà occupés."}
        </p>
      ) : null}
    </div>
  );
}
