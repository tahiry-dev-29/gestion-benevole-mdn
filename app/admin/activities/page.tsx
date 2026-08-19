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
import { activities } from "@/features/admin/admin.data";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Activités"
        description="Planifiez et suivez les activités de l'association."
        action={
          <Button size="sm">
            <Plus className="size-4" />
            Nouvelle activité
          </Button>
        }
      />

      <TableCard>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.titre}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {a.description}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {a.date}
                  </TableCell>
                  <TableCell>{a.responsable ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableCard>
    </div>
  );
}
