import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import { StatsCard } from "./stats-domain-panel";

export function StatsPresencePanel({ today, days }: { today: number; days: { date: string; value: number }[] }) {
  const peak = Math.max(1, ...days.map((day) => day.value));
  const total = days.reduce((sum, day) => sum + day.value, 0);
  return (
    <div className="grid gap-4">
      <StatsCard title="Présences aujourd’hui" value={String(today)} caption="Pointages enregistrés aujourd’hui" />
      <Card className="glass-sm">
        <CardHeader><CardTitle className="text-base">Présences sur 30 jours</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {days.length === 0 ? <p className="text-sm text-muted-foreground">Aucune présence enregistrée sur cette période.</p> : days.map((day) => (
              <div key={day.date} className="grid grid-cols-[5rem_minmax(0,1fr)_2rem] items-center gap-3 text-xs">
                <time dateTime={day.date} className="text-muted-foreground">{new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", timeZone: "UTC" }).format(new Date(`${day.date}T12:00:00Z`))}</time>
                <Progress value={(day.value / peak) * 100} aria-label={`${day.date}: ${day.value} présences`} />
                <span className="text-right tabular-nums">{day.value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{total} pointages présents au total</p>
        </CardContent>
      </Card>
    </div>
  );
}
