"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MOIS_LABELS } from "@/features/observation/observation.constants";
import type { ObservationItem } from "@/features/observation/observation-queries.action";

interface ObservationColumnsOptions {
  currentUserId: number;
  isAdmin: boolean;
  onView: (item: ObservationItem) => void;
  onEdit: (item: ObservationItem) => void;
  onDelete: (id: number) => void;
}

export function createObservationColumns({
  currentUserId,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}: ObservationColumnsOptions): ColumnDef<ObservationItem>[] {
  return [
    {
      accessorKey: "benevole",
      header: "Bénévole",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.benevole}
        </span>
      ),
    },
    {
      id: "periode",
      header: "Période",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {MOIS_LABELS[row.original.mois]} {row.original.annee}
        </Badge>
      ),
    },
    {
      accessorKey: "contenu",
      header: "Observation",
      cell: ({ row }) => (
        <p className="max-w-md whitespace-normal break-words text-sm text-muted-foreground">
          {row.original.contenu}
        </p>
      ),
    },
    {
      accessorKey: "auteur",
      header: "Auteur",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.auteur ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const obs = row.original;
        const canModify = isAdmin || obs.auteurId === currentUserId;
        if (!canModify) return null;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-10"
                  aria-label={`Actions pour l’observation de ${obs.benevole}`}
                >
                  <MoreHorizontal className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => onView(obs)}>
                  <Eye aria-hidden="true" /> Voir l’observation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => onEdit(obs)}>
                  <Pencil aria-hidden="true" /> Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={() => onDelete(obs.id)}
                >
                  <Trash2 aria-hidden="true" /> Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
