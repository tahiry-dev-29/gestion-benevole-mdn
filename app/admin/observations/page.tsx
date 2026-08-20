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
import { observations } from "@/features/admin/admin.data";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";

const mois = [
  "",
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function ObservationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Observations"
        description="Notes et suivis mensuels des bénévoles."
        action={
          <Button size="sm">
            <Plus className="size-4" />
            Ajouter une observation
          </Button>
        }
      />

      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bénévole</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Contenu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.benevole}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {mois[o.mois]} {o.annee}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-md text-muted-foreground">
                  {o.contenu}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  );
}
