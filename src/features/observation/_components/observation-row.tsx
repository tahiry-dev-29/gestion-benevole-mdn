"use client";

import { Loader2, Pencil, Save, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { MOIS_LABELS } from "@/features/observation/observation.constants";

import type { ObservationItem } from "../observation-queries.action";

interface ObservationRowProps {
  obs: ObservationItem;
  canModify: boolean;
  isEditing: boolean;
  editContenu: string;
  isSaving: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onEditChange: (val: string) => void;
  onSaveEdit: () => void;
  onDeleteClick: () => void;
}

export function ObservationRow({
  obs,
  canModify,
  isEditing,
  editContenu,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onSaveEdit,
  onDeleteClick,
}: ObservationRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{obs.benevole}</TableCell>
      <TableCell>
        <Badge variant="outline">
          {MOIS_LABELS[obs.mois]} {obs.annee}
        </Badge>
      </TableCell>
      <TableCell className="max-w-md">
        {isEditing ? (
          <textarea
            rows={3}
            value={editContenu}
            onChange={(e) => onEditChange(e.target.value)}
            maxLength={1000}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        ) : (
          <span className="text-muted-foreground">{obs.contenu}</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {obs.auteur ?? "—"}
      </TableCell>
      <TableCell>
        {canModify && (
          <div className="flex items-center gap-1">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isSaving}
                  onClick={onSaveEdit}
                >
                  {isSaving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4 text-green-600" />
                  )}
                  <span className="sr-only">Sauvegarder</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={onCancelEdit}>
                  <X className="size-4" />
                  <span className="sr-only">Annuler</span>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={onStartEdit}>
                  <Pencil className="size-4" />
                  <span className="sr-only">Modifier</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={onDeleteClick}
                >
                  <X className="size-4" />
                  <span className="sr-only">Supprimer</span>
                </Button>
              </>
            )}
          </div>
        )}
      </TableCell>
    </TableRow>
  );
}
