import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";
import { TemoignageModerationActions } from "@/features/temoignage/temoignage-moderation-actions";
import { prisma } from "@/lib/prisma";

function statusBadge(statut: string) {
  if (statut === "PUBLIE") return <Badge variant="default">Publié</Badge>;
  if (statut === "REJETE") return <Badge variant="outline">Rejeté</Badge>;
  return <Badge variant="secondary">En attente</Badge>;
}

export const dynamic = "force-dynamic";

export default async function TemoignagesPage() {
  const temoignages = await prisma.temoignage.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  const tri = [...temoignages].sort((left, right) => {
    if (left.statut === "EN_ATTENTE" && right.statut !== "EN_ATTENTE")
      return -1;
    if (right.statut === "EN_ATTENTE" && left.statut !== "EN_ATTENTE") return 1;
    return right.createdAt.getTime() - left.createdAt.getTime();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Témoignages"
        description="Modérez les témoignages des bénévoles et du public."
      />

      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Auteur</TableHead>
              <TableHead>Contenu</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tri.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  Aucun témoignage à modérer. Les soumissions du public
                  apparaîtront ici.
                </TableCell>
              </TableRow>
            ) : null}
            {tri.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.nom_auteur}</TableCell>
                <TableCell className="max-w-md whitespace-pre-wrap text-muted-foreground">
                  {t.contenu}
                </TableCell>
                <TableCell>{statusBadge(t.statut)}</TableCell>
                <TableCell>
                  <TemoignageModerationActions id={t.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  );
}
