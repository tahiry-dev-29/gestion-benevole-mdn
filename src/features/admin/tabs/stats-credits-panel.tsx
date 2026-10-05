import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { StatsCard } from "./stats-domain-panel";

export function StatsCreditsPanel({
  total,
  users,
}: {
  total: number;
  users: { userId: number; total: number; name: string }[];
}) {
  const top = users.slice(0, 5);
  const average = users.length ? total / users.length : 0;
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatsCard title="Crédits attribués" value={`${total.toFixed(2)} €`} />
        <StatsCard
          title="Moyenne par bénévole crédité"
          value={`${average.toFixed(2)} €`}
        />
        <StatsCard title="Bénévoles crédités" value={String(users.length)} />
      </div>
      <Card className="glass-sm">
        <CardHeader>
          <CardTitle className="text-base">Top 5 des bénévoles</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {top.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun crédit attribué.
            </p>
          ) : (
            top.map((user, index) => (
              <div
                key={user.userId}
                className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-3 py-2"
              >
                <span className="text-sm">
                  <span className="mr-3 text-muted-foreground">
                    {index + 1}
                  </span>
                  {user.name}
                </span>
                <span className="font-medium tabular-nums">
                  {user.total.toFixed(2)} €
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
