"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Partage } from "../domain/partage.entity";

import { PartageForm, type PartageFormValues } from "./partage-form";
import { PartagesTableGrid } from "./partages-table-grid";
import {
  type PartageInput,
  useDeletePartage,
  usePartages,
  useSavePartage,
} from "./use-partages";

const PAGE_SIZE = 10;

export function PartagesTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "BROUILLON" | "PUBLIE"
  >("ALL");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partage | null>(null);
  const [deleting, setDeleting] = useState<Partage | null>(null);
  const query = usePartages(
    page,
    statusFilter === "BROUILLON" || statusFilter === "PUBLIE"
      ? statusFilter
      : undefined
  );
  const save = useSavePartage();
  const remove = useDeletePartage();

  function submit(values: PartageFormValues) {
    const input: PartageInput = values;
    save.mutate(
      { id: editing?.id, input },
      {
        onSuccess: () => {
          toast.success(editing ? "Partage modifié" : "Partage créé");
          setOpen(false);
          setEditing(null);
        },
        onError: () => toast.error("Impossible d'enregistrer le partage"),
      }
    );
  }

  function confirmDelete() {
    if (!deleting) return;
    remove.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Partage supprimé");
        setDeleting(null);
      },
      onError: () => toast.error("Impossible de supprimer le partage"),
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partages"
        description="Rédigez, publiez et modérez les contenus partagés."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            Publier un partage
          </Button>
        }
      />
      <div className="flex justify-end">
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            if (
              value === "ALL" ||
              value === "BROUILLON" ||
              value === "PUBLIE"
            ) {
              setStatusFilter(value);
              setPage(1);
            }
          }}
        >
          <SelectTrigger
            className="w-full sm:w-48"
            aria-label="Filtrer par publication"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les statuts</SelectItem>
            <SelectItem value="BROUILLON">Brouillon</SelectItem>
            <SelectItem value="PUBLIE">Publié</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <PartagesTableGrid
        rows={query.data?.data ?? []}
        isLoading={query.isLoading}
        onEdit={(partage) => {
          setEditing(partage);
          setOpen(true);
        }}
        onDelete={setDeleting}
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{query.data?.total ?? 0} partage(s)</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={page === 1}
          >
            Précédent
          </Button>
          <span className="flex items-center px-2">
            Page {page} /{" "}
            {Math.max(1, Math.ceil((query.data?.total ?? 0) / PAGE_SIZE))}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((value) => value + 1)}
            disabled={page >= Math.ceil((query.data?.total ?? 0) / PAGE_SIZE)}
          >
            Suivant
          </Button>
        </div>
      </div>
      <PartageForm
        open={open}
        onOpenChange={setOpen}
        initialData={
          editing
            ? {
                id: editing.id,
                titre: editing.titre,
                contenu: editing.contenu,
                statut: editing.statut,
              }
            : null
        }
        onSubmit={submit}
        isPending={save.isPending}
      />
      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(value) => !value && setDeleting(null)}
        onConfirm={confirmDelete}
        isPending={remove.isPending}
        title={`Supprimer « ${deleting?.titre} » ?`}
      />
    </div>
  );
}
