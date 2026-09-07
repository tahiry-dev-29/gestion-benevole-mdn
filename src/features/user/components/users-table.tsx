"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Filter,
  Loader2,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  updateUserRoleAction,
} from "@/features/user/user.action";
import type { Sexe } from "@/features/user/user.schema";

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

type CategoryType = "PRIMAIRE" | "COLLEGIEN" | "UNIVERSITAIRE" | "SALARIE";

interface UserItem {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: "ADMIN" | "BENEVOLE";
  statut: "ACTIF" | "INACTIF";
  photo: string | null;
  sexe?: string | null;
  age?: number | null;
  contact?: string | null;
  categorie?: CategoryType | null;
  etablissement?: string | null;
  facebook?: string | null;
  date_entree: Date;
  createdAt: Date;
}

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
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    role: "BENEVOLE" as "ADMIN" | "BENEVOLE",
    sexe: "",
    age: "",
    contact: "",
    categorie: "" as CategoryType | "",
    etablissement: "",
    facebook: "",
  });

  const filteredUsers = initialUsers.filter((u) => {
    const searchTarget = `${u.prenom} ${u.nom} ${u.email} ${u.role} ${u.etablissement || ""} ${u.contact || ""}`.toLowerCase();
    const matchesSearch = searchTarget.includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.statut === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const handleRoleChange = (userId: number, currentRole: "ADMIN" | "BENEVOLE") => {
    const newRole = currentRole === "ADMIN" ? "BENEVOLE" : "ADMIN";
    startTransition(async () => {
      await updateUserRoleAction({ userId, role: newRole });
      router.refresh();
    });
  };

  const handleDelete = (userId: number) => {
    if (confirm("Êtes-vous sûr de vouloir désactiver cet utilisateur ?")) {
      startTransition(async () => {
        await deleteUserAction(userId);
        router.refresh();
      });
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    startTransition(async () => {
      const res = await createUserAction({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        role: formData.role,
        sexe: (formData.sexe || undefined) as Sexe | undefined,
        age: formData.age ? Number(formData.age) : undefined,
        contact: formData.contact || undefined,
        categorie: formData.categorie ? (formData.categorie as CategoryType) : undefined,
        etablissement: formData.etablissement || undefined,
        facebook: formData.facebook || undefined,
      });

      if (res.success) {
        setIsCreateOpen(false);
        setFormData({
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
        });
        router.refresh();
      } else {
        setFormError(res.error || "Une erreur est survenue.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">Utilisateurs</h1>
            <span className="inline-flex items-center rounded-full bg-cyan-950/80 px-3 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-800/60">
              {initialUsers.length} membres
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Comptes, profils et rôles des membres de l&apos;association.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium gap-2 self-start sm:self-auto"
        >
          <Plus className="size-4" /> Ajouter un utilisateur
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Rechercher nom, email, établissement..."
            className="pl-9 bg-slate-900/60 border-slate-800 text-slate-200 placeholder:text-slate-500 focus-visible:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              if (val) setRoleFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] bg-slate-900/60 border-slate-800 text-slate-200">
              <SelectValue>
                {roleFilter === "ALL"
                  ? "Tous les rôles"
                  : roleFilter === "ADMIN"
                  ? "Admin"
                  : "Bénévole"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value="ALL">Tous les rôles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="BENEVOLE">Bénévole</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(val) => {
              if (val) setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px] bg-slate-900/60 border-slate-800 text-slate-200">
              <SelectValue>
                {statusFilter === "ALL"
                  ? "Tous les statuts"
                  : statusFilter === "ACTIF"
                  ? "Actif"
                  : "Inactif"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              <SelectItem value="ACTIF">Actif</SelectItem>
              <SelectItem value="INACTIF">Inactif</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="bg-slate-900/60 border-slate-800 text-slate-300">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      {paginatedUsers.length === 0 ? (
        <div className="text-center py-12 text-slate-500 border border-slate-800/60 rounded-xl bg-slate-950/20">
          Aucun utilisateur ne correspond à votre recherche.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((u) => {
            const initials = `${u.prenom[0] ?? ""}${u.nom[0] ?? ""}`.toUpperCase();
            const formattedDate = new Date(u.date_entree).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={u.id}
                className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-11 rounded-full bg-cyan-950/90 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-800/50 text-sm">
                        {u.photo ? (
                          <img
                            src={u.photo}
                            alt={`${u.prenom} ${u.nom}`}
                            className="size-full rounded-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-100 text-base leading-snug truncate">
                          {u.prenom} {u.nom}
                        </h3>
                        <p className="text-xs font-mono text-cyan-400/90 truncate mt-0.5">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 -mr-1"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/benevoles/${u.id}`} className="cursor-pointer">
                            <Pencil className="mr-2 size-4" /> Éditer le profil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(u.id, u.role)} className="cursor-pointer">
                          <Shield className="mr-2 size-4" /> Passer en {u.role === "ADMIN" ? "Bénévole" : "Admin"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                          onClick={() => handleDelete(u.id)}
                          className="text-rose-400 focus:text-rose-400 focus:bg-rose-950/40 cursor-pointer"
                        >
                          <Trash2 className="mr-2 size-4" /> Désactiver le compte
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        u.role === "ADMIN"
                          ? "bg-blue-950/80 text-blue-400 border-blue-800/60"
                          : "bg-cyan-950/80 text-cyan-400 border-cyan-800/60"
                      }`}
                    >
                      {u.role === "ADMIN" ? "Admin" : "Bénévole"}
                    </span>

                    {u.categorie && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                        {u.categorie}
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        u.statut === "ACTIF"
                          ? "bg-emerald-950/50 text-emerald-400 border-emerald-800/50"
                          : "bg-rose-950/50 text-rose-400 border-rose-800/50"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          u.statut === "ACTIF" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      />
                      {u.statut === "ACTIF" ? "Actif" : "Inactif"}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs text-slate-400">
                    {u.contact && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="size-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{u.contact}</span>
                      </div>
                    )}
                    {u.facebook && (
                      <div className="flex items-center gap-2 truncate">
                        <FacebookIcon className="size-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{u.facebook}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      ÉTABLISSEMENT
                    </span>
                    <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                      {u.etablissement || "—"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      ENTRÉE / DÉTAILS
                    </span>
                    <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                      {u.sexe ? `${u.sexe}, ` : ""}{u.age ? `${u.age} ans` : formattedDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800/60 text-xs text-slate-400">
        <div>
          Affichage de <strong className="text-slate-200">{totalUsers > 0 ? startIndex + 1 : 0}</strong> à{" "}
          <strong className="text-slate-200">{Math.min(startIndex + pageSize, totalUsers)}</strong> sur{" "}
          <strong className="text-slate-200">{totalUsers}</strong> utilisateurs
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="bg-slate-900/60 border-slate-800 text-slate-300 disabled:opacity-40"
          >
            Précédent
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={
                currentPage === page
                  ? "bg-cyan-600 hover:bg-cyan-500 text-white font-bold size-8 p-0"
                  : "bg-slate-900/60 border-slate-800 text-slate-300 size-8 p-0"
              }
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="bg-slate-900/60 border-slate-800 text-slate-300 disabled:opacity-40"
          >
            Suivant
          </Button>
        </div>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Ajouter un utilisateur
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 py-2">
            {formError && (
              <div className="p-3 text-xs bg-rose-950/80 border border-rose-800/80 text-rose-300 rounded-lg">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prenom" className="text-xs text-slate-300">
                  Prénom
                </Label>
                <Input
                  id="prenom"
                  required
                  value={formData.prenom}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                  placeholder="Jean"
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nom" className="text-xs text-slate-300">
                  Nom
                </Label>
                <Input
                  id="nom"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Dupont"
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jean.dupont@exemple.com"
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="contact" className="text-xs text-slate-300">
                  Contact
                </Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="+261 34 00 000 00"
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Sexe</Label>
                <Select
                  value={formData.sexe}
                  onValueChange={(val) => setFormData({ ...formData, sexe: val ?? "" })}
                >
                  <SelectTrigger className="bg-slate-950/60 border-slate-800 text-slate-200">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="Non précisé">Non précisé</SelectItem>
                    <SelectItem value="Masculin">Masculin</SelectItem>
                    <SelectItem value="Féminin">Féminin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="age" className="text-xs text-slate-300">
                  Âge
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  placeholder="20"
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Catégorie</Label>
                <Select
                  value={formData.categorie}
                  onValueChange={(val) => setFormData({ ...formData, categorie: val as CategoryType })}
                >
                  <SelectTrigger className="bg-slate-950/60 border-slate-800 text-slate-200">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="PRIMAIRE">Primaire</SelectItem>
                    <SelectItem value="COLLEGIEN">Collégien</SelectItem>
                    <SelectItem value="UNIVERSITAIRE">Universitaire</SelectItem>
                    <SelectItem value="SALARIE">Salarié</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-slate-300">Rôle</Label>
                <Select
                  value={formData.role}
                  onValueChange={(val) => {
                    if (val === "ADMIN" || val === "BENEVOLE") {
                      setFormData({ ...formData, role: val });
                    }
                  }}
                >
                  <SelectTrigger className="bg-slate-950/60 border-slate-800 text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                    <SelectItem value="BENEVOLE">Bénévole</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="etablissement" className="text-xs text-slate-300">
                  Établissement
                </Label>
                <Input
                  id="etablissement"
                  value={formData.etablissement}
                  onChange={(e) =>
                    setFormData({ ...formData, etablissement: e.target.value })
                  }
                  placeholder="Lycée / Université"
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="facebook" className="text-xs text-slate-300">
                  Facebook
                </Label>
                <Input
                  id="facebook"
                  value={formData.facebook}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="Lien ou Nom Facebook"
                  className="bg-slate-950/60 border-slate-800 text-slate-200"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium gap-2"
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}
                Créer l&apos;utilisateur
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}