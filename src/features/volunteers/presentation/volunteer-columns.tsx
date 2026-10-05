"use client";

import Link from "next/link";
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

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
      className="-mx-2 inline-flex min-h-9 items-center gap-1 rounded px-2 py-1 font-medium hover:text-foreground"
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

function getInitials(prenom: string, nom: string): string {
  const first = prenom?.trim().charAt(0) ?? "";
  const last = nom?.trim().charAt(0) ?? "";
  return `${first}${last}`.toUpperCase() || "U";
}

function RoleBadge({ role }: { role: Volunteer["role"] }) {
  return (
    <Badge
      variant={role === "SUPER_ADMIN" ? "outline" : "secondary"}
      className={
        role === "SUPER_ADMIN"
          ? "border-primary/30 bg-primary/10 font-medium text-primary"
          : "font-medium"
      }
    >
      {roleLabel(role)}
    </Badge>
  );
}

function StatutBadge({ statut }: { statut: Volunteer["statut"] }) {
  const isActif = statut === "ACTIF";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        isActif
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-muted bg-muted/60 text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActif ? "bg-primary" : "bg-muted-foreground"
        )}
      />
      {statutLabel(statut)}
    </Badge>
  );
}

export function getVolunteerColumns({
  onDelete,
}: ColumnActions): ColumnDef<Volunteer>[] {
  return [
    {
      accessorKey: "nom",
      header: ({ column }) => <SortHeader column={column} label="Bénévole" />,
      cell: ({ row }) => {
        const initials = getInitials(row.original.prenom, row.original.nom);
        const fullName = formatFullName(row.original);
        return (
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0 rounded-full p-0"
                  aria-label={`Aperçu du compte de ${fullName}`}
                >
                  <Avatar className="size-9 border shadow-2xs">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72">
                <p className="font-semibold text-foreground">{fullName}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {row.original.email}
                </p>
                <dl className="mt-3 grid gap-2 border-t pt-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Rôle</dt>
                    <dd>{roleLabel(row.original.role)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Statut</dt>
                    <dd>{statutLabel(row.original.statut)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Entrée</dt>
                    <dd>{formatDate(row.original.dateEntree)}</dd>
                  </div>
                </dl>
              </PopoverContent>
            </Popover>
            <div className="flex flex-col">
              <Link
                href={`/admin/volunteer-management/${row.original.id}`}
                className="font-medium hover:underline focus:outline-none"
              >
                {fullName}
              </Link>
              <span className="text-xs text-muted-foreground">
                {row.original.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => <SortHeader column={column} label="Rôle" />,
      cell: ({ row }) => <RoleBadge role={row.original.role} />,
    },
    {
      accessorKey: "statut",
      header: ({ column }) => <SortHeader column={column} label="Statut" />,
      cell: ({ row }) => <StatutBadge statut={row.original.statut} />,
    },
    {
      accessorKey: "dateEntree",
      header: ({ column }) => (
        <SortHeader column={column} label="Date d'entrée" />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.dateEntree)}
        </span>
      ),
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
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/volunteer-management/${row.original.id}`}
                className="cursor-pointer gap-2"
              >
                <Eye className="size-4 text-muted-foreground" /> Fiche détaillée
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/volunteer-management/${row.original.id}#modifier`}
                className="cursor-pointer gap-2"
              >
                <Pencil className="size-4 text-muted-foreground" /> Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
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
