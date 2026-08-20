"use client";

import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Eye,
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

import type { Benevole } from "../domain/benevole.entity";

interface ColumnActions {
  onView: (b: Benevole) => void;
  onEdit: (b: Benevole) => void;
  onDelete: (b: Benevole) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR");
}

function SortHeader({
  column,
  label,
}: {
  column: Column<Benevole, unknown>;
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

export function getBenevoleColumns({
  onView,
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Benevole>[] {
  return [
    {
      accessorKey: "nom",
      header: ({ column }) => <SortHeader column={column} label="Nom" />,
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.prenom} {row.original.nom}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <SortHeader column={column} label="Email" />,
    },
    {
      accessorKey: "role",
      header: ({ column }) => <SortHeader column={column} label="Rôle" />,
      cell: ({ row }) => (
        <Badge
          variant={row.original.role === "ADMIN" ? "default" : "secondary"}
        >
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "dateEntree",
      header: ({ column }) => (
        <SortHeader column={column} label="Date d'entrée" />
      ),
      cell: ({ row }) => formatDate(row.original.dateEntree),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const b = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Actions" />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onView(b)}>
                <Eye className="size-4" /> Voir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(b)}>
                <Pencil className="size-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(b)}
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
