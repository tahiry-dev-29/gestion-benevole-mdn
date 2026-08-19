import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { credits } from "@/features/admin/admin.data";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";

export default function CreditsPage() {
  const total = credits.reduce((sum, c) => sum + c.montant, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crédits"
        description="Suivez les remboursements et les crédits attribués."
        action={
          <Button size="sm">
            <Plus className="size-4" />
            Ajouter un crédit
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Total crédits
            </div>
            <div className="mt-1 text-2xl font-bold">{total} €</div>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardContent className="pt-6">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Nombre de transactions
            </div>
            <div className="mt-1 text-2xl font-bold">{credits.length}</div>
          </CardContent>
        </Card>
      </div>

      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bénévole</TableHead>
              <TableHead>Motif</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credits.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.benevole}</TableCell>
                <TableCell className="text-muted-foreground">
                  {c.motif}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {c.date}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <Badge variant="secondary">{c.montant} €</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  );
}
