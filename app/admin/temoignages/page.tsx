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
import { temoignages } from "@/features/admin/admin.data";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";

function statusBadge(statut: string) {
  if (statut === "APPROUVE")
    return <Badge variant="default">Approuvé</Badge>;
  if (statut === "REJETE")
    return <Badge variant="outline">Rejeté</Badge>;
  return <Badge variant="secondary">En attente</Badge>;
}

export default function TemoignagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Témoignages"
        description="Modérez les témoignages des bénévoles et du public."
        action={
          <Button size="sm">
            <Plus className="size-4" />
            Ajouter un témoignage
          </Button>
        }
      />

      <TableCard>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Auteur</TableHead>
                <TableHead>Contenu</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {temoignages.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.nom_auteur}</TableCell>
                  <TableCell className="max-w-md text-muted-foreground">
                    {t.contenu}
                  </TableCell>
                  <TableCell>{statusBadge(t.statut)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableCard>
    </div>
  );
}
