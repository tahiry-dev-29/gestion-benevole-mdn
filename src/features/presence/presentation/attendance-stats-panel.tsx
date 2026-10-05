"use client";

import { useMemo } from "react";
import { CalendarCheck, Trophy, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { PresenceRecord } from "../presence.schema";
import { toIsoDate } from "../presence.utils";

function formatShortDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function AttendanceStatsPanel({
  selectedDate,
  statisticsRows,
  monthRows,
}: {
  selectedDate: string;
  statisticsRows: PresenceRecord[];
  monthRows: PresenceRecord[];
}) {
  const stats = useMemo(() => {
    const countsByDay = new Map<string, number>();
    for (const row of statisticsRows) {
      if (row.statut === "PRESENT") {
        countsByDay.set(row.date, (countsByDay.get(row.date) ?? 0) + 1);
      }
    }
    const days = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(`${selectedDate}T12:00:00`);
      date.setDate(date.getDate() - (29 - index));
      const isoDate = toIsoDate(date);
      return { date: isoDate, count: countsByDay.get(isoDate) ?? 0 };
    });

    const weekStart = new Date(`${selectedDate}T12:00:00`);
    weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
    const weekStartIso = toIsoDate(weekStart);
    const elapsedWeekDays = Math.min(
      7,
      Math.max(
        1,
        Math.floor(
          (new Date(`${selectedDate}T12:00:00`).getTime() -
            weekStart.getTime()) /
            86_400_000
        ) + 1
      )
    );
    const currentWeek = statisticsRows.filter(
      (row) =>
        row.date >= weekStartIso &&
        row.date <= selectedDate &&
        row.statut === "PRESENT"
    ).length;
    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    const previousWeekStartIso = toIsoDate(previousWeekStart);
    const previousWeek = statisticsRows.filter(
      (row) =>
        row.date >= previousWeekStartIso &&
        row.date < weekStartIso &&
        row.statut === "PRESENT"
    ).length;

    const volunteers = new Map<string, { name: string; count: number }>();
    for (const row of monthRows) {
      if (row.statut !== "PRESENT") continue;
      const entry = volunteers.get(String(row.userId)) ?? {
        name: row.benevole,
        count: 0,
      };
      entry.count += 1;
      volunteers.set(String(row.userId), entry);
    }

    return {
      days,
      selectedDateCount: statisticsRows.filter(
        (row) => row.date === selectedDate && row.statut === "PRESENT"
      ).length,
      weeklyAverage: currentWeek / elapsedWeekDays,
      trend: currentWeek / elapsedWeekDays - previousWeek / 7,
      mostPresent: [...volunteers.values()].sort(
        (a, b) => b.count - a.count
      )[0],
      maxCount: Math.max(1, ...days.map((day) => day.count)),
      hasActivity: days.some((day) => day.count > 0),
    };
  }, [monthRows, selectedDate, statisticsRows]);
  const firstDay = stats.days[0]?.date;
  const lastDay = stats.days.at(-1)?.date;

  return (
    <div className="grid gap-4">
      <section
        className="grid gap-3 sm:grid-cols-3"
        aria-label="Résumé de la période"
      >
        <Card className="glass-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <CalendarCheck aria-hidden="true" className="size-4" /> Présents
              le {formatShortDate(selectedDate)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold tabular-nums">
            {stats.selectedDateCount}
          </CardContent>
        </Card>
        <Card className="glass-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UsersRound aria-hidden="true" className="size-4" /> Moyenne cette
              semaine
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2 text-2xl font-semibold tabular-nums">
            {stats.weeklyAverage.toLocaleString("fr-FR", {
              maximumFractionDigits: 1,
            })}
            <span className="text-sm font-normal text-muted-foreground">
              présents / jour
            </span>
            <Badge
              variant={stats.trend >= 0 ? "secondary" : "destructive"}
              className="text-xs"
            >
              {stats.trend > 0 ? "+" : ""}
              {stats.trend.toLocaleString("fr-FR", {
                maximumFractionDigits: 1,
              })}{" "}
              vs semaine passée
            </Badge>
          </CardContent>
        </Card>
        <Card className="glass-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Trophy aria-hidden="true" className="size-4" /> Plus assidu ce
              mois
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">
            {stats.mostPresent ? (
              <span>
                {stats.mostPresent.name}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  {stats.mostPresent.count} présence(s)
                </span>
              </span>
            ) : (
              <span className="text-sm font-normal text-muted-foreground">
                Aucune présence enregistrée
              </span>
            )}
          </CardContent>
        </Card>
      </section>
      <Card className="glass-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Présences sur les 30 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="relative grid h-28 grid-cols-[repeat(15,minmax(0,1fr))] items-end gap-1 sm:grid-cols-[repeat(30,minmax(0,1fr))] sm:gap-1.5"
            role="img"
            aria-label={`Graphique des présences quotidiennes sur les 30 derniers jours : ${stats.days.reduce((total, day) => total + day.count, 0)} présences`}
          >
            {stats.days.map((day) => (
              <div
                key={day.date}
                className="group relative flex h-full items-end"
                title={`${day.date} : ${day.count} présence(s)`}
              >
                <div
                  className="w-full rounded-t-sm bg-primary/80 transition-colors group-hover:bg-primary"
                  style={{
                    height: `${day.count > 0 ? Math.max(12, (day.count / stats.maxCount) * 100) : stats.hasActivity ? 3 : 0}%`,
                  }}
                  aria-hidden="true"
                />
              </div>
            ))}
            {!stats.hasActivity ? (
              <p className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                Aucune présence sur cette période
              </p>
            ) : null}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{firstDay ? formatShortDate(firstDay) : ""}</span>
            <span>{lastDay ? formatShortDate(lastDay) : ""}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
