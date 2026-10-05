import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface MetricRow {
  label: string;
  value: number;
}

export function DistributionPanel({
  title,
  rows,
}: {
  title: string;
  rows: MetricRow[];
}) {
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return (
    <Card className="glass-sm">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune donnée.</p>
        ) : (
          rows.map((row) => (
            <div key={row.label} className="grid gap-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium tabular-nums">{row.value}</span>
              </div>
              <Progress
                value={total ? (row.value / total) * 100 : 0}
                aria-label={`${row.label}: ${row.value}`}
              />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCard({
  title,
  value,
  caption,
  trend,
  trendLabel,
}: {
  title: string;
  value: string;
  caption?: string;
  trend?: number;
  trendLabel?: string;
}) {
  return (
    <Card className="glass glass-gloss">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        {trendLabel !== undefined ? (
          <div className="mt-2 grid justify-items-start gap-1.5">
            <Badge
              variant={
                trend === 0
                  ? "secondary"
                  : trend !== undefined && trend < 0
                    ? "destructive"
                    : "default"
              }
              aria-label={trendLabel}
            >
              {trend === 0 ? "→" : trend !== undefined && trend < 0 ? "↓" : "↑"}{" "}
              {trendLabel}
            </Badge>
            {caption ? (
              <p className="text-xs text-muted-foreground">{caption}</p>
            ) : null}
          </div>
        ) : caption ? (
          <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
