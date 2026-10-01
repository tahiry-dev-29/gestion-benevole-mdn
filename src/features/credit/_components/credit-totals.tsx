import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type { CumulEntry } from "../credit-cumul.action";

interface CreditTotalsProps {
  totalGlobal: number;
  cumul: CumulEntry[];
}

export function CreditTotals({ totalGlobal, cumul }: CreditTotalsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="pt-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Total global
          </div>
          <div className="mt-1 text-2xl font-bold">
            {totalGlobal.toFixed(2)} €
          </div>
        </CardContent>
      </Card>
      <Card className="sm:col-span-2">
        <CardContent className="pt-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
            Par bénévole
          </div>
          <div className="flex flex-wrap gap-2">
            {cumul.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                Aucune donnée
              </span>
            ) : (
              cumul.map((c) => (
                <Badge key={c.userId} variant="secondary">
                  {c.benevole} : {c.total.toFixed(2)} €
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
