"use client";

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
import { TableCard } from "@/features/admin/table-card";

import type { Partage } from "../domain/partage.entity";

type Props = {
  rows: Partage[];
  isLoading: boolean;
  onEdit: (partage: Partage) => void;
  onDelete: (partage: Partage) => void;
};

export function PartagesTableGrid({
  rows,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Contenu</TableHead>
            <TableHead>Auteur</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>État</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((partage) => (
            <TableRow key={partage.id}>
              <TableCell className="font-medium">{partage.titre}</TableCell>
              <TableCell className="max-w-sm truncate text-muted-foreground">
                {partage.contenu}
              </TableCell>
              <TableCell>{partage.auteur}</TableCell>
              <TableCell>
                {new Date(partage.datePublication).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    partage.statut === "PUBLIE" ? "default" : "secondary"
                  }
                >
                  {partage.statut === "PUBLIE" ? "Publié" : "Brouillon"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(partage)}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(partage)}
                  >
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!isLoading && rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                Aucun partage.
              </TableCell>
            </TableRow>
          ) : null}
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                Chargement…
              </TableCell>
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </TableCard>
  );
}
