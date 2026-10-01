import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  type CalendarMode,
  type DateRange,
  MODE_LABELS,
  shiftDate,
} from "../../presence.utils";

type AttendanceCalendarProps = {
  mode: CalendarMode;
  selectedDate: string;
  range: DateRange;
  onModeChange: (mode: CalendarMode) => void;
  onDateChange: (date: string) => void;
};

const MODES: CalendarMode[] = ["day", "week", "month"];

/** Sélecteur de période jour / semaine / mois du pointage. */
export function AttendanceCalendar({
  mode,
  selectedDate,
  range,
  onModeChange,
  onDateChange,
}: AttendanceCalendarProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendrier des présences</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDateChange(shiftDate(mode, selectedDate, -1))}
          aria-label="Période précédente"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Input
          type="date"
          value={selectedDate}
          onChange={(event) => onDateChange(event.target.value)}
          className="w-44"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDateChange(shiftDate(mode, selectedDate, 1))}
          aria-label="Période suivante"
        >
          <ChevronRight className="size-4" />
        </Button>
        {MODES.map((value) => (
          <Button
            key={value}
            variant={mode === value ? "default" : "outline"}
            onClick={() => onModeChange(value)}
          >
            {MODE_LABELS[value]}
          </Button>
        ))}
        <span className="text-sm text-muted-foreground">
          {range.du} — {range.au}
        </span>
      </CardContent>
    </Card>
  );
}
