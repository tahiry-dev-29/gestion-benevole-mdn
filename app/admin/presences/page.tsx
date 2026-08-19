import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { presences } from "@/features/admin/admin.data";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";

function statusBadge(statut: string) {
  if (statut === "PRESENT")
    return <Badge variant="default">Présent</Badge>;
  if (statut === "RETARD")
    return <Badge variant="secondary">Retard</Badge>;
  return <Badge variant="outline">Absent</Badge>;
}

export default function PresencesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Présences"
        description="Historique des présences des bénévoles."
        action={
          <Button size="sm">
            <Plus className="size-4" />
            Enregistrer une présence
          </Button>
        }
      />

      <TableCard>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bénévole</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Arrivée</TableHead>
                <TableHead>Départ</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {presences.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.benevole}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.date}
                  </TableCell>
                  <TableCell>{p.heure_arrivee ?? "—"}</TableCell>
                  <TableCell>{p.heure_depart ?? "—"}</TableCell>
                  <TableCell>{statusBadge(p.statut)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableCard>
    </div>
  );
}
