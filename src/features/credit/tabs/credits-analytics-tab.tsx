import { Coins, Trophy, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { CumulEntry } from "../credit-cumul.action";

export function CreditsAnalyticsTab({
  cumul,
  totalGlobal,
}: {
  cumul: CumulEntry[];
  totalGlobal: number;
}) {
  const average = cumul.length > 0 ? totalGlobal / cumul.length : 0;
  const top = cumul.slice(0, 5);
  const topValue = top[0]?.total ?? 0;

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Coins}
          label="Crédits attribués"
          value={`${totalGlobal.toFixed(2)} €`}
        />
        <MetricCard
          icon={UsersRound}
          label="Moyenne par bénévole"
          value={`${average.toFixed(2)} €`}
        />
        <MetricCard
          icon={Trophy}
          label="Bénévoles crédités"
          value={String(cumul.length)}
        />
      </div>
      <Card className="glass-sm">
        <CardHeader>
          <CardTitle className="text-base">Top bénévoles</CardTitle>
          <p className="text-sm text-muted-foreground">
            Classement selon le cumul de la période sélectionnée.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          {top.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun crédit sur cette période.
            </p>
          ) : (
            top.map((entry, index) => (
              <div key={entry.userId} className="grid gap-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate">
                    <span className="mr-2 text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {entry.benevole}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">
                    {entry.total.toFixed(2)} €
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label={`Cumul de ${entry.benevole}`}
                  aria-valuemin={0}
                  aria-valuemax={topValue}
                  aria-valuenow={entry.total}
                >
                  <div
                    className="h-full rounded-full bg-primary transition-[width]"
                    style={{
                      width: `${topValue > 0 ? (entry.total / topValue) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
}) {
  return (
    <Card className="glass glass-gloss">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent className="text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </CardContent>
    </Card>
  );
}
