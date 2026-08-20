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

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Activite } from "../domain/activite.entity";

interface ColumnActions {
  onView: (a: Activite) => void;
  onEdit: (a: Activite) => void;
  onDelete: (a: Activite) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR");
}

function SortHeader({
  column,
  label,
}: {
  column: Column<Activite, unknown>;
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

export function getActiviteColumns({
  onView,
  onEdit,
  onDelete,
}: ColumnActions): ColumnDef<Activite>[] {
  return [
    {
      accessorKey: "titre",
      header: ({ column }) => <SortHeader column={column} label="Titre" />,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="block max-w-xs truncate text-muted-foreground">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => <SortHeader column={column} label="Date" />,
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const a = row.original;
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
              <DropdownMenuItem onClick={() => onView(a)}>
                <Eye className="size-4" /> Voir
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(a)}>
                <Pencil className="size-4" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(a)}
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
