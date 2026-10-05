"use client";

import { useState } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import {
  BarChart3,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { createUserColumns } from "./_components/user-columns";
import { UserMobileCard } from "./_components/user-mobile-card";
import { UsersListToolbar } from "./_components/users-list-toolbar";
import { UsersTableHeader } from "./_components/users-table-header";
import { UsersAnalyticsTab } from "./tabs/users-analytics-tab";
import { UsersPresenceTab } from "./tabs/users-presence-tab";
import { filterUsers } from "./filter-users";
import type { UserItem } from "./types";
import { useDeleteUser, useUsers } from "./use-users";

export function UsersTable({ initialUsers }: { initialUsers: UserItem[] }) {
  const usersQuery = useUsers();
  const queryClient = useQueryClient();
  const deleteUser = useDeleteUser();
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [certificateFilter, setCertificateFilter] = useState("ALL");
  const [mobilePage, setMobilePage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([]);

  const users =
    usersQuery.data ?? initialUsers.filter((user) => user.role === "USER");
  const filteredUsers = filterUsers(users, {
    query: search,
    statut: statusFilter,
    certificat: certificateFilter,
  });

  const totalUsers = filteredUsers.length;
  const columns = createUserColumns({ onDelete: setDeleteTarget });
  const mobilePageSize = 8;
  const mobilePageCount = Math.max(1, Math.ceil(totalUsers / mobilePageSize));
  const safeMobilePage = Math.min(mobilePage, mobilePageCount - 1);
  const mobileUsers = filteredUsers.slice(
    safeMobilePage * mobilePageSize,
    (safeMobilePage + 1) * mobilePageSize
  );

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5 pb-8">
      <UsersTableHeader />
      <Tabs defaultValue="liste" className="gap-4">
        <TabsList className="glass-sm flex h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
          <TabsTrigger value="liste" className="min-h-10 flex-none gap-2 px-3">
            <UsersRound aria-hidden="true" />
            Liste
          </TabsTrigger>
          <TabsTrigger
            value="presences"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <CalendarCheck aria-hidden="true" />
            Présences
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <BarChart3 aria-hidden="true" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="liste" className="grid gap-4">
          <UsersListToolbar
            total={totalUsers}
            search={search}
            onSearchChange={(value) => {
              setSearch(value);
              setMobilePage(0);
            }}
            status={statusFilter}
            onStatusChange={(value) => {
              setStatusFilter(value ?? "ALL");
              setMobilePage(0);
            }}
            certificate={certificateFilter}
            onCertificateChange={(value) => {
              setCertificateFilter(value ?? "ALL");
              setMobilePage(0);
            }}
            onRefresh={() =>
              void queryClient.invalidateQueries({ queryKey: ["users"] })
            }
            isRefreshing={usersQuery.isFetching}
          />

          {usersQuery.isError ? (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
            >
              <p>
                Impossible de charger les comptes. Vérifiez votre connexion puis
                réessayez.
              </p>
              <Button
                variant="outline"
                onClick={() => void usersQuery.refetch()}
              >
                Réessayer
              </Button>
            </div>
          ) : null}
          {filteredUsers.length === 0 && !usersQuery.isPending ? (
            <div className="rounded-lg border border-dashed bg-card px-5 py-12 text-center">
              <Shield
                aria-hidden="true"
                className="mx-auto mb-3 size-8 text-muted-foreground"
              />
              <p className="font-medium text-foreground">Aucun compte trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Modifiez votre recherche ou ajoutez une préinscription.
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/users/create">Ajouter un compte</Link>
              </Button>
            </div>
          ) : null}
          {(filteredUsers.length > 0 || usersQuery.isPending) && (
            <>
              <div className="hidden md:block min-w-0">
                <DataTable
                  columns={columns}
                  data={filteredUsers}
                  compactColumns
                  isLoading={usersQuery.isPending}
                  sorting={sorting}
                  onSortingChange={setSorting}
                  emptyMessage="Aucun compte trouvé."
                />
              </div>
              <section
                className="grid gap-3 md:hidden"
                aria-label="Comptes USER"
              >
                {usersQuery.isPending
                  ? Array.from({ length: 3 }, (_, index) => (
                      <div
                        key={index}
                        className="h-40 animate-pulse rounded-lg border bg-card"
                      />
                    ))
                  : mobileUsers.map((user) => (
                      <UserMobileCard key={user.id} user={user} />
                    ))}
                {totalUsers > mobilePageSize ? (
                  <div className="flex items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
                    <Button
                      variant="outline"
                      className="min-h-11 gap-2"
                      onClick={() =>
                        setMobilePage((page) => Math.max(0, page - 1))
                      }
                      disabled={safeMobilePage === 0}
                    >
                      <ChevronLeft aria-hidden="true" className="size-4" />
                      Précédent
                    </Button>
                    <span
                      className="text-sm text-muted-foreground"
                      aria-live="polite"
                    >
                      {safeMobilePage + 1} / {mobilePageCount}
                    </span>
                    <Button
                      variant="outline"
                      className="min-h-11 gap-2"
                      onClick={() =>
                        setMobilePage((page) =>
                          Math.min(mobilePageCount - 1, page + 1)
                        )
                      }
                      disabled={safeMobilePage >= mobilePageCount - 1}
                    >
                      Suivant
                      <ChevronRight aria-hidden="true" className="size-4" />
                    </Button>
                  </div>
                ) : null}
              </section>
            </>
          )}
        </TabsContent>
        <TabsContent value="presences">
          <UsersPresenceTab />
        </TabsContent>
        <TabsContent value="analytics">
          <UsersAnalyticsTab users={users} />
        </TabsContent>
      </Tabs>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Désactiver ce compte USER ?"
        description="Le compte sera archivé et ne pourra plus ouvrir de session."
        isPending={deleteUser.isPending}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteUser.mutate(deleteTarget.id, {
            onSuccess: () => {
              toast.success("Compte USER archivé.");
              setDeleteTarget(null);
            },
            onError: (error) => toast.error(error.message),
          });
        }}
      />
    </div>
  );
}
