"use client";

import Link from "next/link";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Partage } from "../domain/partage.entity";

interface ColumnActions {
  onEdit: (partage: Partage) => void;
  onDelete: (partage: Partage) => void;
  onView: (partage: Partage) => void;
  onTogglePublish: (partage: Partage) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR");
}

function SortHeader({
  column,
  label,
}: {
  column: Column<Partage, unknown>;
  label: string;
}) {
  const sorted = column.getIsSorted();
  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className="-mx-2 inline-flex items-center gap-1 rounded px-2 py-1 hover:text-foreground"
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5" />
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-50" />
      )}
    </button>
  );
}

export function getPartageColumns({
  onEdit,
  onDelete,
  onView,
  onTogglePublish,
}: ColumnActions): ColumnDef<Partage>[] {
  return [
    {
      accessorKey: "titre",
      header: ({ column }) => <SortHeader column={column} label="Titre" />,
    },
    {
      accessorKey: "contenu",
      header: "Contenu",
      cell: ({ row }) => (
        <span className="block max-w-xs truncate text-muted-foreground">
          {row.original.contenu}
        </span>
      ),
    },
    {
      accessorKey: "auteur",
      header: "Auteur",
      cell: ({ row }) => row.original.auteur ?? "—",
    },
    {
      accessorKey: "datePublication",
      header: ({ column }) => <SortHeader column={column} label="Date" />,
      cell: ({ row }) => formatDate(row.original.datePublication),
    },
    {
      accessorKey: "statut",
      header: "Publication",
      cell: ({ row }) => {
        const published = row.original.statut === "PUBLIE";
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTogglePublish(row.original)}
            className="h-8 gap-2 px-2"
            aria-label={`${published ? "Dépublier" : "Publier"} ${row.original.titre}`}
            title={`${published ? "Dépublier" : "Publier"} ce partage`}
          >
            <Badge
              variant={published ? "default" : "secondary"}
              className="gap-1.5 font-medium"
            >
              {published ? (
                <Globe className="size-3.5" aria-hidden="true" />
              ) : (
                <GlobeLock className="size-3.5" aria-hidden="true" />
              )}
              {published ? "Publié" : "Brouillon"}
            </Badge>
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const partage = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Actions pour ${partage.titre}`}
                title="Actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => onView(partage)}>
                <Eye className="size-4" /> Aperçu
              </DropdownMenuItem>
              {partage.statut === "PUBLIE" ? (
                <DropdownMenuItem asChild>
                  <Link href={`/partages/${partage.id}`}>
                    <Eye className="size-4" /> Voir en ligne
                  </Link>
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem onClick={() => onEdit(partage)}>
                <Pencil className="size-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => onDelete(partage)}
              >
                <Trash2 className="size-4" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
