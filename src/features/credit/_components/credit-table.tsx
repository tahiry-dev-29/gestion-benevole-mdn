"use client";

import { Trash2 } from "lucide-react";

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

export interface CreditItem {
  id: number;
  userId: number;
  benevole: string;
  montant: number;
  date: string;
  motif: string;
}

interface CreditTableProps {
  credits: CreditItem[];
  onDeleteClick: (creditId: number) => void;
}

export function CreditTable({ credits, onDeleteClick }: CreditTableProps) {
  return (
    <TableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bénévole</TableHead>
            <TableHead>Motif</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {credits.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground py-8"
              >
                Aucun crédit pour les filtres sélectionnés
              </TableCell>
            </TableRow>
          ) : (
            credits.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.benevole}</TableCell>
                <TableCell className="text-muted-foreground">{c.motif}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {c.date}
                </TableCell>
                <TableCell className="text-right font-medium">
                  <Badge variant="secondary">{c.montant.toFixed(2)} €</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDeleteClick(c.id)}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">Supprimer</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableCard>
  );
}
