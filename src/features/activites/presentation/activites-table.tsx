"use client";

import * as React from "react";
import { type SortingState } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Activite } from "../domain/activite.entity";

import { getActiviteColumns } from "./activite-columns";
import { ActiviteForm, type ActiviteFormValues } from "./activite-form";
import {
  useActivites,
  useCreateActivite,
  useDeleteActivite,
  useUpdateActivite,
} from "./use-activites";

const PAGE_SIZE = 10;

export function ActivitesTable() {
  const [search, setSearch] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Activite | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Activite | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const sort = sorting[0];
  const params = {
    q: debouncedQ || undefined,
    page: pageIndex + 1,
    pageSize: PAGE_SIZE,
    sortBy: sort?.id,
    sortDir: sort?.desc ? "desc" : "asc",
  };

  const { data, isLoading } = useActivites(params);
  const rows = data?.data ?? [];
  const total = data?.total ?? 0;

  const createMutation = useCreateActivite();
  const updateMutation = useUpdateActivite();
  const deleteMutation = useDeleteActivite();
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const columns = React.useMemo(
    () =>
      getActiviteColumns({
        onView: (a) => {
          setEditing(a);
          setFormOpen(true);
        },
        onEdit: (a) => {
          setEditing(a);
          setFormOpen(true);
        },
        onDelete: (a) => setDeleteTarget(a),
      }),
    []
  );

  const handleSubmit = (values: ActiviteFormValues) => {
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, input: values },
        {
          onSuccess: () => {
            toast.success("Activité mise à jour");
            setFormOpen(false);
            setEditing(null);
          },
          onError: () => toast.error("Échec de la mise à jour"),
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          toast.success("Activité créée");
          setFormOpen(false);
        },
        onError: () => toast.error("Échec de la création"),
      });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Activité supprimée");
        setDeleteTarget(null);
      },
      onError: () => toast.error("Échec de la suppression"),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activités"
        description="Gérez les activités et formations de l'association."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="size-4" /> Ajouter
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={rows}
        total={total}
        pageCount={Math.ceil(total / PAGE_SIZE)}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={{ pageIndex, pageSize: PAGE_SIZE }}
        onPaginationChange={(updater) => {
          const next =
            typeof updater === "function"
              ? updater({ pageIndex, pageSize: PAGE_SIZE })
              : updater;
          setPageIndex(next.pageIndex);
        }}
        isLoading={isLoading}
        emptyMessage="Aucune activité trouvée."
        toolbar={
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une activité…"
              className="pl-8"
            />
          </div>
        }
      />

      <ActiviteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editing}
        onSubmit={handleSubmit}
        isPending={isPending}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title={`Supprimer « ${deleteTarget?.titre} » ?`}
      />
    </div>
  );
}
