"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
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

  function togglePublish(partage: Partage) {
    const next = partage.statut === "PUBLIE" ? "BROUILLON" : "PUBLIE";
    save.mutate(
      {
        id: partage.id,
        input: { titre: partage.titre, contenu: partage.contenu, statut: next },
      },
      {
        onSuccess: () =>
          toast.success(
            next === "PUBLIE" ? "Partage publié" : "Partage dépublié"
          ),
        onError: () =>
          toast.error("Impossible de changer l’état de publication"),
      }
    );
  }

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

  function startEditing(partage: Partage) {
    setEditing(partage);
    setOpen(true);
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
      <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-card p-2">
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
            className="h-9 w-[170px]"
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
        <Button
          variant="outline"
          size="icon"
          className="size-9"
          onClick={() => void query.refetch()}
          disabled={query.isFetching}
          aria-label="Actualiser les partages"
          title="Actualiser"
        >
          <RefreshCw
            className={query.isFetching ? "size-4 animate-spin" : "size-4"}
          />
        </Button>
      </div>
      {query.isError ? (
        <p role="alert" className="text-sm text-destructive">
          Impossible de charger les partages.
        </p>
      ) : null}
      <PartagesTableGrid
        rows={query.data?.data ?? []}
        isLoading={query.isLoading}
        onEdit={startEditing}
        onDelete={setDeleting}
        onTogglePublish={togglePublish}
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
