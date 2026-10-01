"use client";

import Link from "next/link";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Eye,
  MoreHorizontal,
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

import type { Volunteer } from "../volunteer.entity";

import { formatDate, formatFullName, roleLabel, statutLabel } from "./labels";

interface ColumnActions {
  onDelete: (volunteer: Volunteer) => void;
}

function SortHeader({
  column,
  label,
}: {
  column: Column<Volunteer, unknown>;
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

export function getVolunteerColumns({
  onDelete,
}: ColumnActions): ColumnDef<Volunteer>[] {
  return [
    {
      accessorKey: "nom",
      header: ({ column }) => <SortHeader column={column} label="Nom" />,
      cell: ({ row }) => (
        <div className="font-medium">{formatFullName(row.original)}</div>
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
          variant={
            row.original.role === "VOLUNTEER" ? "secondary" : "default"
          }
        >
          {roleLabel(row.original.role)}
        </Badge>
      ),
    },
    {
      accessorKey: "statut",
      header: ({ column }) => <SortHeader column={column} label="Statut" />,
      cell: ({ row }) => (
        <Badge variant={row.original.statut === "ACTIF" ? "outline" : "secondary"}>
          {statutLabel(row.original.statut)}
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
      id: "createdBy",
      header: "Créé par",
      cell: ({ row }) => {
        const creator = row.original.createdBy;
        return creator ? (
          <span className="text-sm text-muted-foreground">
            {formatFullName(creator)}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/volunteer-management/${row.original.id}`}>
                <Eye className="size-4" /> Fiche détaillée
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              onClick={() => onDelete(row.original)}
            >
              <Trash2 className="size-4" /> Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
