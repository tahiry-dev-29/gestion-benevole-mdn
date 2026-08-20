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
import { users } from "@/features/admin/admin.data";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";

const benevoles = users.filter((u) => u.role === "BENEVOLE");

export default function VolunteersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bénévoles"
        description="Suivez les bénévoles et leur engagement."
        action={
          <Button size="sm">
            <Plus className="size-4" />
            Ajouter un bénévole
          </Button>
        }
      />

      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d&apos;entrée</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benevoles.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.prenom} {u.nom}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.email}
                </TableCell>
                <TableCell>
                  <Badge variant="default">Actif</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.date_entree}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  );
}
