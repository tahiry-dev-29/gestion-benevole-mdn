"use client";

import * as React from "react";
import Link from "next/link";
import { type SortingState } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isRole } from "@/lib/rbac";

import type { ListVolunteersParams, Volunteer } from "../volunteer.entity";

import { VolunteerMobileCard } from "./_components/volunteer-mobile-card";
import { VolunteerStatsCards } from "./_components/volunteer-stats-cards";
import { VolunteersTableToolbar } from "./_components/volunteers-table-toolbar";
import { useDeleteVolunteer, useVolunteers } from "./use-volunteers";
import { getVolunteerColumns } from "./volunteer-columns";

const PAGE_SIZE = 10;
const ALL = "ALL";

const SORT_KEYS: readonly string[] = [
  "nom",
  "prenom",
  "email",
  "role",
  "statut",
  "dateEntree",
];

type SortKey = "nom" | "prenom" | "email" | "role" | "statut" | "dateEntree";

function isSortKey(value: string | undefined): value is SortKey {
  return value !== undefined && SORT_KEYS.includes(value);
}

export function VolunteersTable() {
  const [search, setSearch] = React.useState("");
  const [debouncedQ, setDebouncedQ] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<string>(ALL);
  const [statutFilter, setStatutFilter] = React.useState<string>(ALL);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [deleteTarget, setDeleteTarget] = React.useState<Volunteer | null>(
    null
  );

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const sort = sorting[0];
  const sortId = sort?.id;
  const params: ListVolunteersParams = {
    q: debouncedQ || undefined,
    role: isRole(roleFilter) ? roleFilter : undefined,
    statut:
      statutFilter === "ACTIF" || statutFilter === "INACTIF"
        ? statutFilter
        : undefined,
    page: pageIndex + 1,
    pageSize: PAGE_SIZE,
    sortBy: isSortKey(sortId) ? sortId : undefined,
    sortDir: sort?.desc ? "desc" : "asc",
  };

  const { data, isLoading, isError, error, refetch, isFetching } =
    useVolunteers(params);
  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const mobilePageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const deleteMutation = useDeleteVolunteer();

  const columns = React.useMemo(
    () => getVolunteerColumns({ onDelete: (v) => setDeleteTarget(v) }),
    []
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Bénévole supprimé (archivé).");
        setDeleteTarget(null);
      },
      onError: (mutationError) => toast.error(mutationError.message),
    });
  };

  const hasActiveFilters = Boolean(
    search || roleFilter !== ALL || statutFilter !== ALL
  );

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedQ("");
    setRoleFilter(ALL);
    setStatutFilter(ALL);
    setPageIndex(0);
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Gestion bénévole"
        description="Gérez les comptes habilités de l'association (SUPER_ADMIN, ADMIN et Bénévoles)."
        action={
          <Button asChild className="gap-2 shadow-xs">
            <Link href="/admin/volunteer-management/add">
              <UserPlus className="size-4" /> Nouveau bénévole
            </Link>
          </Button>
        }
      />

      <VolunteerStatsCards />

      {isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Erreur de chargement."}
        </div>
      ) : null}

      <VolunteersTableToolbar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPageIndex(0);
        }}
        roleFilter={roleFilter}
        onRoleFilterChange={(value) => {
          setRoleFilter(value ?? ALL);
          setPageIndex(0);
        }}
        statutFilter={statutFilter}
        onStatutFilterChange={(value) => {
          setStatutFilter(value ?? ALL);
          setPageIndex(0);
        }}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        total={total}
        isFetching={isFetching}
        onRefetch={() => void refetch()}
      />

      <div className="hidden xl:block">
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
          emptyMessage="Aucun bénévole ne correspond à votre recherche."
        />
      </div>

      <section
        className="grid gap-3 xl:hidden"
        aria-label="Liste des bénévoles"
      >
        {isLoading
          ? Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} className="h-40 rounded-xl" />
            ))
          : rows.map((volunteer) => (
              <VolunteerMobileCard
                key={volunteer.id}
                volunteer={volunteer}
                onDelete={setDeleteTarget}
              />
            ))}
        {!isLoading && rows.length === 0 ? (
          <div className="glass-sm rounded-xl border-dashed p-8 text-center text-sm text-muted-foreground">
            Aucun bénévole ne correspond à votre recherche.
          </div>
        ) : null}
        {mobilePageCount > 1 ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3">
            <Button
              variant="outline"
              className="min-h-11 gap-2"
              onClick={() => setPageIndex((page) => Math.max(0, page - 1))}
              disabled={pageIndex === 0}
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
              Précédent
            </Button>
            <span className="text-sm text-muted-foreground" aria-live="polite">
              {pageIndex + 1} / {mobilePageCount}
            </span>
            <Button
              variant="outline"
              className="min-h-11 gap-2"
              onClick={() =>
                setPageIndex((page) => Math.min(mobilePageCount - 1, page + 1))
              }
              disabled={pageIndex >= mobilePageCount - 1}
            >
              Suivant
              <ChevronRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        ) : null}
      </section>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title={
          deleteTarget
            ? `Supprimer ${deleteTarget.prenom} ${deleteTarget.nom} ?`
            : "Confirmer la suppression"
        }
        description="Le compte sera archivé (soft delete) et disparaîtra de la liste active. L'historique et les logs restent préservés."
      />
    </div>
  );
}
