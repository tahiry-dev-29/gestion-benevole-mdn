"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

import {
  createUserAction,
  deleteUserAction,
  updateUserRoleAction,
} from "@/features/user/user.action";
import type { Sexe } from "@/features/user/user.schema";

import { CreateUserModal } from "./_components/create-user-modal";
import { UserCard } from "./_components/user-card";
import { UsersPagination } from "./_components/users-pagination";
import { UsersTableFilterBar } from "./_components/users-table-filter-bar";
import { UsersTableHeader } from "./_components/users-table-header";
import type { CategoryType, UserFormData, UserItem } from "./types";

const INITIAL_FORM_DATA: UserFormData = {
  prenom: "",
  nom: "",
  email: "",
  role: "BENEVOLE",
  sexe: "",
  age: "",
  contact: "",
  categorie: "",
  etablissement: "",
  facebook: "",
};

export function UsersTable({ initialUsers }: { initialUsers: UserItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);

  const filteredUsers = initialUsers.filter((u) => {
    const searchTarget =
      `${u.prenom} ${u.nom} ${u.email} ${u.role} ${u.etablissement || ""} ${u.contact || ""}`.toLowerCase();
    const matchesSearch =
      search === "" || searchTarget.includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.statut === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const handleRoleChange = (id: number, newRole: "ADMIN" | "BENEVOLE") => {
    startTransition(async () => {
      await updateUserRoleAction({ userId: id, role: newRole });
      router.refresh();
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment désactiver cet utilisateur ?")) {
      startTransition(async () => {
        await deleteUserAction(id);
        router.refresh();
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    startTransition(async () => {
      const res = await createUserAction({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        role: formData.role,
        sexe: (formData.sexe as Sexe) || undefined,
        age: formData.age ? Number(formData.age) : undefined,
        contact: formData.contact || undefined,
        categorie: (formData.categorie as CategoryType) || undefined,
        etablissement: formData.etablissement || undefined,
        facebook: formData.facebook || undefined,
      });

      if (res.success) {
        setIsCreateOpen(false);
        setFormData(INITIAL_FORM_DATA);
        router.refresh();
      } else {
        setFormError(res.error || "Erreur lors de la création.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <UsersTableHeader onOpenCreate={() => setIsCreateOpen(true)} />

      <UsersTableFilterBar
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        roleFilter={roleFilter}
        onRoleFilterChange={(val) => {
          setRoleFilter(val ?? "ALL");
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val ?? "ALL");
          setCurrentPage(1);
        }}
        totalResults={filteredUsers.length}
      />

      {paginatedUsers.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-slate-800 bg-slate-900/20 text-slate-400">
          <Shield className="mx-auto size-10 opacity-30 mb-3" />
          <p className="text-sm font-medium">Aucun utilisateur trouvé</p>
          <p className="text-xs text-slate-500 mt-1">
            Essayez de modifier vos filtres ou effectuez une autre recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              isPending={isPending}
              onRoleChange={handleRoleChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <UsersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        startIndex={startIndex}
        pageSize={pageSize}
        totalUsers={totalUsers}
        onPageChange={setCurrentPage}
      />

      <CreateUserModal
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        isPending={isPending}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
