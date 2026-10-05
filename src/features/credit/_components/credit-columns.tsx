"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface CreditItem {
  id: number;
  userId: number;
  benevole: string;
  montant: number;
  date: string;
  motif: string;
}

interface CreditColumnsOptions {
  onDelete: (id: number) => void;
}

export function createCreditColumns({
  onDelete,
}: CreditColumnsOptions): ColumnDef<CreditItem>[] {
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
      accessorKey: "motif",
      header: "Motif",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.motif}</span>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.date}
        </span>
      ),
    },
    {
      accessorKey: "montant",
      header: () => <div className="text-right">Montant</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <Badge variant="secondary" className="font-medium">
            {row.original.montant.toFixed(2)} €
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10"
                aria-label={`Actions pour le crédit de ${row.original.benevole}`}
              >
                <MoreHorizontal className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onSelect={() => onDelete(row.original.id)}
              >
                <Trash2 aria-hidden="true" /> Supprimer le crédit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}
