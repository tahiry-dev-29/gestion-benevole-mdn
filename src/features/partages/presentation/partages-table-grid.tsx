"use client";

import Link from "next/link";
import {
  Eye,
  Globe,
  GlobeLock,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  onTogglePublish: (partage: Partage) => void;
};

export function PartagesTableGrid({
  rows,
  isLoading,
  onEdit,
  onDelete,
  onTogglePublish,
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onTogglePublish(partage)}
                  className="h-8 gap-2 px-2"
                  aria-label={`${partage.statut === "PUBLIE" ? "Dépublier" : "Publier"} ${partage.titre}`}
                  title={`${partage.statut === "PUBLIE" ? "Dépublier" : "Publier"} ce partage`}
                >
                  <Badge
                    variant={
                      partage.statut === "PUBLIE" ? "default" : "secondary"
                    }
                    className="gap-1.5 font-medium"
                  >
                    {partage.statut === "PUBLIE" ? (
                      <Globe className="size-3.5" aria-hidden="true" />
                    ) : (
                      <GlobeLock className="size-3.5" aria-hidden="true" />
                    )}
                    {partage.statut === "PUBLIE" ? "Publié" : "Brouillon"}
                  </Badge>
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Actions pour ${partage.titre}`}
                        title="Actions"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {partage.statut === "PUBLIE" ? (
                        <DropdownMenuItem asChild>
                          <Link href={`/partages/${partage.id}`}>
                            <Eye className="size-4" /> Voir le partage
                          </Link>
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem onClick={() => onEdit(partage)}>
                        <Pencil className="size-4" /> Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(partage)}
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="size-4" /> Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
