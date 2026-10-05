"use client";

import * as React from "react";
import { type SortingState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { QueryError } from "@/components/shared/query-error";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { Partage } from "../domain/partage.entity";

import { getPartageColumns } from "./partage-columns";
import { PartageForm, type PartageFormValues } from "./partage-form";
import { PartageToolbar } from "./partage-toolbar";
import {
  type PartageInput,
  useDeletePartage,
  usePartages,
  useSavePartage,
} from "./use-partages";

const PAGE_SIZE = 10;

export function PartagesTable() {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "ALL" | "BROUILLON" | "PUBLIE"
  >("ALL");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Partage | null>(null);
  const [deleting, setDeleting] = React.useState<Partage | null>(null);
  const [quickView, setQuickView] = React.useState<Partage | null>(null);

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
  const query = usePartages(params);
  const rows = query.data?.data ?? [];
  const total = query.data?.total ?? 0;
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

  const columns = React.useMemo(
    () =>
      getPartageColumns({
        onEdit: (partage) => {
          setEditing(partage);
          setOpen(true);
        },
        onDelete: (partage) => setDeleting(partage),
        onView: (partage) => setQuickView(partage),
        onTogglePublish: (partage) => togglePublish(partage),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [save]
  );

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
            className="gap-2"
          >
            <Plus className="size-4" /> Publier un partage
          </Button>
        }
      />
      {query.isError ? (
        <QueryError
          message="Impossible de charger les partages."
          onRetry={() => void query.refetch()}
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
        isLoading={query.isLoading}
        hiddenColumnsOnMobile={["contenu", "auteur", "datePublication"]}
        emptyMessage="Aucun partage trouvé."
        toolbar={
          <PartageToolbar
            search={search}
            status={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={(value) => {
              setStatusFilter(value);
              setPageIndex(0);
            }}
            onRefresh={() => void query.refetch()}
            isRefreshing={query.isFetching}
          />
        }
      />
      <Sheet
        open={quickView !== null}
        onOpenChange={(value) => !value && setQuickView(null)}
      >
        <SheetContent className="glass-xl w-full overflow-y-auto sm:max-w-xl">
          {quickView ? (
            <>
              <SheetHeader className="pr-8 text-left">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {(quickView.auteur ?? "A")
                        .split(/\s+/)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <SheetTitle>{quickView.titre}</SheetTitle>
                    <SheetDescription>
                      {quickView.auteur ?? "Auteur non renseigné"} ·{" "}
                      {new Date(quickView.datePublication).toLocaleDateString(
                        "fr-FR"
                      )}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-6 whitespace-pre-wrap text-sm leading-7 text-foreground">
                {quickView.contenu}
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
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
