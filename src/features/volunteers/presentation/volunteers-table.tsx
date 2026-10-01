"use client";

import * as React from "react";
import Link from "next/link";
import { type SortingState } from "@tanstack/react-table";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable } from "@/components/shared/data-table";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isRole } from "@/lib/rbac";

import type { ListVolunteersParams, Volunteer } from "../volunteer.entity";
import { VOLUNTEER_ROLES } from "../volunteer.schema";

import { roleLabel } from "./labels";
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

  const { data, isLoading, isError, error } = useVolunteers(params);
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion bénévole"
        description="Comptes SUPER_ADMIN, ADMIN et VOLUNTEER de l'association."
        action={
          <Button asChild className="gap-2">
            <Link href="/admin/volunteer-management/add">
              <Plus className="size-4" /> Add bénévole
            </Link>
          </Button>
        }
      />

      {isError ? (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Erreur de chargement."}
        </p>
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
        emptyMessage="Aucun bénévole trouvé."
        toolbar={
          <>
            <div className="relative max-w-sm flex-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPageIndex(0);
                }}
                placeholder="Rechercher un bénévole..."
                className="pl-8"
              />
            </div>
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value ?? ALL);
                setPageIndex(0);
              }}
            >
              <SelectTrigger className="w-40" aria-label="Filtrer par rôle">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous les rôles</SelectItem>
                {VOLUNTEER_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {roleLabel(role)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statutFilter}
              onValueChange={(value) => {
                setStatutFilter(value ?? ALL);
                setPageIndex(0);
              }}
            >
              <SelectTrigger className="w-36" aria-label="Filtrer par statut">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous les statuts</SelectItem>
                <SelectItem value="ACTIF">Actif</SelectItem>
                <SelectItem value="INACTIF">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </>
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
        description="Le compte sera archivé (soft delete) et disparaîtra de la liste. Cette action conserve l'historique."
      />
    </div>
  );
}
