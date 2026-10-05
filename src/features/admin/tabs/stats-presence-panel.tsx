import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { StatsCard } from "./stats-domain-panel";

export function StatsPresencePanel({
  today,
  days,
  trend,
}: {
  today: number;
  days: { date: string; value: number }[];
  trend: number;
}) {
  const peak = Math.max(1, ...days.map((day) => day.value));
  const total = days.reduce((sum, day) => sum + day.value, 0);
  const dailyAverage = days.length ? total / days.length : 0;
  return (
    <div className="grid gap-4">
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Indicateurs de présence">
        <StatsCard title="Aujourd’hui" value={String(today)} caption="Pointages présents" />
        <StatsCard title="Sur 30 jours" value={String(total)} caption="Présences enregistrées" />
        <StatsCard title="Moyenne quotidienne" value={dailyAverage.toFixed(1)} trend={trend} trendLabel={`${trend > 0 ? "+" : ""}${trend} cette semaine`} caption="Variation des 7 jours vs la semaine précédente" />
      </section>
      <Card className="glass-sm">
        <CardHeader>
          <CardTitle className="text-base">Présences sur 30 jours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {days.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune présence enregistrée sur cette période.
              </p>
            ) : (
              days.map((day) => (
                <div
                  key={day.date}
                  className="grid grid-cols-[5rem_minmax(0,1fr)_2rem] items-center gap-3 text-xs"
                >
                  <time dateTime={day.date} className="text-muted-foreground">
                    {new Intl.DateTimeFormat("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      timeZone: "UTC",
                    }).format(new Date(`${day.date}T12:00:00Z`))}
                  </time>
                  <Progress
                    value={(day.value / peak) * 100}
                    aria-label={`${day.date}: ${day.value} présences`}
                  />
                  <span className="text-right tabular-nums">{day.value}</span>
                </div>
              ))
            )}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {total} pointages présents au total
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
