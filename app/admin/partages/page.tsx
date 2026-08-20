import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { partages } from "@/features/admin/admin.data";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";

export default function PartagesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Partages"
        description="Ressources et contenus partagés par l'association."
        action={
          <Button size="sm">
            <Plus className="size-4" />
            Publier un partage
          </Button>
        }
      />

      <TableCard>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Contenu</TableHead>
                <TableHead>Publication</TableHead>
                <TableHead>Auteur</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partages.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.titre}</TableCell>
                  <TableCell className="max-w-md text-muted-foreground">
                    {p.contenu}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.date_publication}
                  </TableCell>
                  <TableCell>{p.auteur ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableCard>
    </div>
  );
}
