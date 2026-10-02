"use client";

import * as React from "react";
import Link from "next/link";
import { type SortingState } from "@tanstack/react-table";
import { ShieldCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { isRole } from "@/lib/rbac";

import type { ListVolunteersParams, Volunteer } from "../volunteer.entity";

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
  const [deleteTarget, setDeleteTarget] = React.useState<Volunteer | null>(null);

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
    <div className="space-y-6">
      <PageHeader
        title="Gestion bénévole"
        description="Gérez les comptes habilités de l'association (SUPER_ADMIN, ADMIN et Bénévoles)."
        action={
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="gap-2 shadow-xs">
              <Link href="/admin/volunteer-management/roles">
                <ShieldCheck className="size-4" /> Rôles & permissions
              </Link>
            </Button>
            <Button asChild className="gap-2 shadow-xs">
              <Link href="/admin/volunteer-management/add">
                <UserPlus className="size-4" /> Nouveau bénévole
              </Link>
            </Button>
          </div>
        }
      />

      <VolunteerStatsCards />

      {isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {error instanceof Error ? error.message : "Erreur de chargement."}
        </div>
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
        emptyMessage="Aucun bénévole ne correspond à votre recherche."
        toolbar={
          <VolunteersTableToolbar
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPageIndex(0);
            }}
            roleFilter={roleFilter}
            onRoleFilterChange={(v) => {
              setRoleFilter(v ?? ALL);
              setPageIndex(0);
            }}
            statutFilter={statutFilter}
            onStatutFilterChange={(v) => {
              setStatutFilter(v ?? ALL);
              setPageIndex(0);
            }}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            total={total}
            isFetching={isFetching}
            onRefetch={() => void refetch()}
          />
        }
      />

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
