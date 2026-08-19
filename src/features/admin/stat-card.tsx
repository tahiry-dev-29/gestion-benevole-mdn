import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

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
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}) {
  const up = trend === "up";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div
          className={cn(
            "mt-1 flex items-center gap-1 text-xs font-medium",
            up ? "text-primary" : "text-destructive"
          )}
        >
          {up ? (
            <TrendingUp className="size-3" />
          ) : (
            <TrendingDown className="size-3" />
          )}
          {change} vs mois dernier
        </div>
      </CardContent>
    </Card>
  );
}
