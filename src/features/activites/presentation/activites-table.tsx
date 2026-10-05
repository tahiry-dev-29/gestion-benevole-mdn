"use client";

import * as React from "react";
import { type SortingState } from "@tanstack/react-table";
import { toast } from "sonner";

import { DataTable } from "@/components/shared/data-table";
import { QueryError } from "@/components/shared/query-error";

import type { Activite } from "../domain/activite.entity";

import { getActiviteColumns } from "./activite-columns";
import { ActiviteDeleteDialog } from "./activite-delete-dialog";
import { ActiviteForm, type ActiviteFormValues } from "./activite-form";
import { ActivitePageHeader } from "./activite-page-header";
import { ActiviteToolbar } from "./activite-toolbar";
import {
  useActivites,
  useCreateActivite,
  useDeleteActivite,
  useUpdateActivite,
} from "./use-activites";

const PAGE_SIZE = 10;

export function ActivitesTable() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "ALL" | "BROUILLON" | "PUBLIE"
  >("ALL");
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
    statut:
      statusFilter === "BROUILLON" || statusFilter === "PUBLIE"
        ? statusFilter
        : undefined,
  };

  const { data, isLoading, isError, refetch } = useActivites(params);
  const rows = data?.data ?? [];
  const total = data?.total ?? 0;

  const createMutation = useCreateActivite();
  const updateMutation = useUpdateActivite();
  const deleteMutation = useDeleteActivite();
  const togglePublication = useUpdateActivite();
  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const columns = React.useMemo(
    () =>
      getActiviteColumns({
        onEdit: (a) => {
          setEditing(a);
          setFormOpen(true);
        },
        onDelete: (a) => setDeleteTarget(a),
        onTogglePublish: (a) =>
          togglePublication.mutate(
            {
              id: a.id,
              input: { statut: a.statut === "PUBLIE" ? "BROUILLON" : "PUBLIE" },
            },
            {
              onSuccess: () =>
                toast.success(
                  a.statut === "PUBLIE"
                    ? "Activité dépubliée"
                    : "Activité publiée"
                ),
              onError: () =>
                toast.error("Impossible de changer l’état de publication"),
            }
          ),
      }),
    [togglePublication]
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
      <ActivitePageHeader
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
      />

      {isError ? (
        <QueryError
          message="Impossible de charger les activités."
          onRetry={() => void refetch()}
        />
      ) : null}

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
        hiddenColumnsOnMobile={["description", "date"]}
        emptyMessage="Aucune activité trouvée."
        toolbar={
          <ActiviteToolbar
            search={search}
            status={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={(value) => {
              setStatusFilter(value);
              setPageIndex(0);
            }}
          />
        }
      />

      <ActiviteForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editing}
        onSubmit={handleSubmit}
        isPending={isPending}
      />

      <ActiviteDeleteDialog
        target={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
