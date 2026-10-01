"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUserAction,
  deleteUserAction,
} from "@/features/user/user.action";

import { CreateUserModal } from "./_components/create-user-modal";
import { UserCard } from "./_components/user-card";
import { UsersPagination } from "./_components/users-pagination";
import type { CertificatStatutType, UserItem } from "./types";

const CERT_LABELS: Record<CertificatStatutType, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  NON_DEMANDE: { label: "—", variant: "outline" },
  EN_ATTENTE: { label: "En attente", variant: "secondary" },
  APPROUVE: { label: "Approuvé", variant: "default" },
  REJETE: { label: "Rejeté", variant: "destructive" },
};

export function UsersTable({ initialUsers }: { initialUsers: UserItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [certFilter, setCertFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formError, setFormError] = useState("");

  const filteredUsers = initialUsers.filter((u) => {
    const target =
      `${u.prenom} ${u.nom} ${u.email} ${u.matricule ?? ""} ${u.etablissement ?? ""} ${u.societe ?? ""}`.toLowerCase();
    const matchesSearch = search === "" || target.includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesCert =
      certFilter === "ALL" || u.certificatStatut === certFilter;
    return matchesSearch && matchesRole && matchesCert;
  });

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const handleDelete = (id: number) => {
    if (confirm("Voulez-vous vraiment désactiver cet utilisateur ?")) {
      startTransition(async () => {
        await deleteUserAction(id);
        router.refresh();
      });
    }
  };

  const handleCreateSubmit = async (data: Record<string, unknown>) => {
    setFormError("");
    startTransition(async () => {
      const res = await createUserAction(data as Parameters<typeof createUserAction>[0]);
      if (res.success) {
        setIsCreateOpen(false);
        router.refresh();
      } else {
        setFormError(res.error ?? "Erreur lors de la création.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Utilisateurs</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestion des comptes USER et conversion en VOLUNTEER
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs gap-2"
        >
          + Ajouter un utilisateur
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Rechercher nom, email, matricule…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-xs bg-slate-950/60 border-slate-800 text-slate-200 text-xs"
        />

        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v ?? "ALL"); setCurrentPage(1); }}>
          <SelectTrigger className="w-36 bg-slate-950/60 border-slate-800 text-slate-200 text-xs h-9">
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            <SelectItem value="USER">USER</SelectItem>
            <SelectItem value="VOLUNTEER">VOLUNTEER</SelectItem>
            <SelectItem value="ADMIN">ADMIN</SelectItem>
            <SelectItem value="SUPER_ADMIN">SUPER_ADMIN</SelectItem>
          </SelectContent>
        </Select>

        <Select value={certFilter} onValueChange={(v) => { setCertFilter(v ?? "ALL"); setCurrentPage(1); }}>
          <SelectTrigger className="w-40 bg-slate-950/60 border-slate-800 text-slate-200 text-xs h-9">
            <SelectValue placeholder="Certificat" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
            <SelectItem value="ALL">Tous</SelectItem>
            <SelectItem value="NON_DEMANDE">Non demandé</SelectItem>
            <SelectItem value="EN_ATTENTE">En attente</SelectItem>
            <SelectItem value="APPROUVE">Approuvé</SelectItem>
            <SelectItem value="REJETE">Rejeté</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-slate-400 ml-auto">
          {filteredUsers.length} résultat{filteredUsers.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Grille */}
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
          {paginatedUsers.map((u) => {
            const certMeta = CERT_LABELS[u.certificatStatut ?? "NON_DEMANDE"];
            return (
              <UserCard
                key={u.id}
                user={u}
                isPending={isPending}
                onDelete={handleDelete}
                certBadge={
                  <Badge variant={certMeta.variant} className="text-xs">
                    {certMeta.label}
                  </Badge>
                }
              />
            );
          })}
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
        formError={formError}
        isPending={isPending}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
