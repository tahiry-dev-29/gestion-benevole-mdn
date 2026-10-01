"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";

import type { SeatGrid } from "@/features/places/places.schema";

import { listAttendanceAction, pointAction } from "../presence.action";
import type { PresenceRecord } from "../presence.schema";
import {
  type CalendarMode,
  computeRange,
  type DateRange,
  toIsoDate,
} from "../presence.utils";

import { AttendanceCalendar } from "./_components/attendance-calendar";
import {
  AttendanceForm,
  type PointageFormState,
} from "./_components/attendance-form";
import { AttendanceTable } from "./_components/attendance-table";

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
  const [rows, setRows] = useState<PresenceRecord[]>([]);
  const [form, setForm] = useState<PointageFormState>(INITIAL_FORM);
  const [pending, startTransition] = useTransition();

  const range = useMemo(
    () => computeRange(mode, selectedDate),
    [mode, selectedDate]
  );

  const refresh = useCallback(async (nextRange: DateRange) => {
    const result = await listAttendanceAction(nextRange);
    if (result.success) setRows(result.data);
    else toast.error(result.error);
  }, []);

  useEffect(() => {
    startTransition(() => {
      void refresh(range);
    });
  }, [range, refresh]);

  const busySeatIds = useMemo(
    () => collectBusySeats(rows, selectedDate, form.userId),
    [rows, selectedDate, form.userId]
  );

  function submit() {
    if (!form.userId) return toast.error("Choisissez un bénévole.");
    startTransition(() => {
      void (async () => {
        const result = await pointAction({
          userId: form.userId,
          date: selectedDate,
          seatId: form.seatId || null,
          statut: form.status,
          arrivee: form.arrivee || null,
          depart: form.depart || null,
        });
        if (!result.success) return toast.error(result.error);
        toast.success("Pointage enregistré.");
        await refresh(range);
      })();
    });
  }

  return (
    <div className="space-y-6">
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
        isPending={pending}
        onChange={(patch) => setForm((current) => ({ ...current, ...patch }))}
        onSubmit={submit}
      />
      <AttendanceTable rows={rows} isPending={pending} />
    </div>
  );
}
