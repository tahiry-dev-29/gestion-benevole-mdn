import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
}) {
  const up = trend !== "down";

  return (
    <Card className="glass glass-gloss overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        {change ? (
          <Badge variant="secondary" className={cn("mt-2 gap-1", up ? "text-primary" : "text-destructive")}>
            {up ? <TrendingUp aria-hidden="true" /> : <TrendingDown aria-hidden="true" />}
            {change}
          </Badge>
        ) : null}
      </CardContent>
    </Card>
  );
}
