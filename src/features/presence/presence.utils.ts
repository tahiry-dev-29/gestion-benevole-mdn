export type CalendarMode = "day" | "week" | "month";

export type DateRange = { du: string; au: string };

export const MODE_LABELS: Record<CalendarMode, string> = {
  day: "Jour",
  week: "Semaine",
  month: "Mois",
};

/** Pas de navigation du calendrier, en jours, pour chaque granularité. */
const MODE_STEP: Record<CalendarMode, number> = { day: 1, week: 7, month: 30 };

export function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Convertit une date ISO et une granularité en intervalle [du, au]
 * couvert par le filtre jour / semaine (lundi à dimanche) / mois.
 */
export function computeRange(
  mode: CalendarMode,
  selectedDate: string
): DateRange {
  const date = new Date(`${selectedDate}T12:00:00`);
  if (mode === "day") return { du: selectedDate, au: selectedDate };

  if (mode === "month") {
    return {
      du: toIsoDate(new Date(date.getFullYear(), date.getMonth(), 1)),
      au: toIsoDate(new Date(date.getFullYear(), date.getMonth() + 1, 0)),
    };
  }

  const mondayOffset = (date.getDay() + 6) % 7;
  const monday = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - mondayOffset
  );
  const sunday = new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 6
  );
  return { du: toIsoDate(monday), au: toIsoDate(sunday) };
}

/** Décale la date courante du pas du mode, dans le sens demandé. */
export function shiftDate(
  mode: CalendarMode,
  selectedDate: string,
  direction: number
) {
  const date = new Date(`${selectedDate}T12:00:00`);
  date.setDate(date.getDate() + MODE_STEP[mode] * direction);
  return toIsoDate(date);
}
export function computeHeures(
  arrivee: string | null,
  depart: string | null
): number | null {
  if (!arrivee || !depart) return null;

  const [arrH, arrM] = arrivee.split(":").map(Number);
  const [depH, depM] = depart.split(":").map(Number);

  const arrMinutes = arrH * 60 + arrM;
  const depMinutes = depH * 60 + depM;

  if (depMinutes < arrMinutes) return null;

  return depMinutes - arrMinutes;
}
