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
  const formatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={Coins}
          label="Crédits attribués"
          value={formatter.format(totalGlobal)}
        />
        <MetricCard
          icon={UsersRound}
          label="Moyenne par bénévole crédité"
          value={formatter.format(average)}
        />
        <MetricCard
          icon={Trophy}
          label="Bénévole le mieux crédité"
          value={top[0]?.benevole ?? "—"}
          detail={top[0] ? formatter.format(top[0].total) : "Aucun crédit"}
          valueClassName="text-lg leading-snug"
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
                    {formatter.format(entry.total)}
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
  detail,
  valueClassName,
}: {
  icon: typeof Coins;
  label: string;
  value: string;
  detail?: string;
  valueClassName?: string;
}) {
  return (
    <Card className="glass glass-gloss">
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-4 text-primary" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p
          className={`font-semibold tracking-tight ${valueClassName ?? "text-2xl tabular-nums"}`}
        >
          {value}
        </p>
        {detail ? (
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
