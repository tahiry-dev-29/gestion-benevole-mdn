"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Shield } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable } from "@/components/shared/data-table";
import { ImportExportButtons } from "@/features/excel/import-export-buttons";
import { createUserSchema } from "@/features/user/user.schema";

import { CreateUserModal } from "./_components/create-user-modal";
import { createUserColumns } from "./_components/user-columns";
import { UsersListToolbar } from "./_components/users-list-toolbar";
import { UsersTableHeader } from "./_components/users-table-header";
import { filterUsers } from "./filter-users";
import type { UserFormData, UserItem } from "./types";
import { useCreateUser, useDeleteUser, useUsers } from "./use-users";

const INITIAL_FORM_DATA: UserFormData = {
  prenom: "",
  nom: "",
  email: "",
  role: "USER",
  sexe: "",
  age: "",
  contact: "",
  categorie: "",
  etablissement: "",
  societe: "",
  facebook: "",
  matricule: "",
  telephone: "",
  materielPC: false,
  accepteRegles: false,
  spinneret: "",
};

export function UsersTable({ initialUsers }: { initialUsers: UserItem[] }) {
  const usersQuery = useUsers();
  const queryClient = useQueryClient();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const [deleteTarget, setDeleteTarget] = useState<UserItem | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [certificateFilter, setCertificateFilter] = useState("ALL");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);

  const users =
    usersQuery.data ?? initialUsers.filter((user) => user.role === "USER");
  const filteredUsers = filterUsers(users, {
    query: search,
    statut: statusFilter,
    certificat: certificateFilter,
  });

  const totalUsers = filteredUsers.length;
  const columns = createUserColumns();

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const parsed = createUserSchema.safeParse({
      prenom: formData.prenom,
      nom: formData.nom,
      email: formData.email,
      role: "USER",
      sexe: formData.sexe || undefined,
      age: formData.age ? Number(formData.age) : undefined,
      contact: formData.contact || undefined,
      matricule: formData.matricule,
      telephone: formData.telephone,
      materielPC: formData.materielPC,
      accepteRegles: formData.accepteRegles,
      spinneret: formData.spinneret || undefined,
      categorie: formData.categorie || undefined,
      etablissement: formData.etablissement || undefined,
      societe: formData.societe || undefined,
      facebook: formData.facebook || undefined,
    });
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Vérifiez les champs saisis.";
      setFormError(message);
      toast.error(message);
      return;
    }

    createUser.mutate(parsed.data, {
      onSuccess: () => {
        toast.success("Compte USER créé.");
        setIsCreateOpen(false);
        setFormData(INITIAL_FORM_DATA);
      },
      onError: (error) => {
        setFormError(error.message);
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="space-y-6">
      <ImportExportButtons dataset="users" />
      <UsersTableHeader onOpenCreate={() => setIsCreateOpen(true)} />
      <UsersListToolbar
        total={totalUsers}
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={(value) => setStatusFilter(value ?? "ALL")}
        certificate={certificateFilter}
        onCertificateChange={(value) => setCertificateFilter(value ?? "ALL")}
        onRefresh={() =>
          void queryClient.invalidateQueries({ queryKey: ["users"] })
        }
        isRefreshing={usersQuery.isFetching}
      />

      {usersQuery.isError ? (
        <p role="alert" className="text-sm text-destructive">
          Impossible de charger les comptes USER. Réessayez.
        </p>
      ) : null}
      {filteredUsers.length === 0 && !usersQuery.isPending ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-slate-400">
          <Shield className="mx-auto size-10 opacity-30 mb-3" />
          <p className="text-sm font-medium">Aucun compte USER trouvé</p>
          <p className="text-xs text-slate-500 mt-1">
            Essayez de modifier vos filtres ou effectuez une autre recherche.
          </p>
        </div>
      ) : null}
      {(filteredUsers.length > 0 || usersQuery.isPending) && (
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={usersQuery.isPending}
          emptyMessage="Aucun compte USER trouvé."
        />
      )}

      <CreateUserModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        isPending={createUser.isPending}
        onSubmit={handleCreateSubmit}
      />
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
