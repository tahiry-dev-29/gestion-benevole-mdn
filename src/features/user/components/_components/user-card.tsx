import Image from "next/image";
import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Phone, Shield, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { UserItem } from "../types";

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-red-950/80 text-red-300 border-red-800/60",
  ADMIN: "bg-purple-950/80 text-purple-300 border-purple-800/60",
  VOLUNTEER: "bg-cyan-950/80 text-cyan-300 border-cyan-800/60",
  USER: "bg-amber-950/80 text-amber-300 border-amber-800/60",
};

interface UserCardProps {
  user: UserItem;
  isPending: boolean;
  onDelete: (id: number) => void;
  certBadge?: React.ReactNode;
}

export function UserCard({ user: u, isPending, onDelete, certBadge }: UserCardProps) {
  const initials = `${u.prenom[0] ?? ""}${u.nom[0] ?? ""}`.toUpperCase() || "U";
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  }).format(new Date(u.date_entree || u.createdAt));

  const roleColor = ROLE_COLORS[u.role] ?? "bg-slate-800 text-slate-300 border-slate-700";

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative size-11 rounded-full bg-cyan-950/90 text-cyan-400 font-bold flex items-center justify-center shrink-0 border border-cyan-800/50 text-sm overflow-hidden">
              {u.photo ? (
                <Image
                  src={u.photo}
                  alt={`${u.prenom} ${u.nom}`}
                  fill
                  sizes="44px"
                  className="object-cover"
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
              {u.matricule && (
                <p className="text-[10px] text-slate-500 mt-0.5">#{u.matricule}</p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-slate-900 border-slate-800 text-slate-200"
            >
              <DropdownMenuLabel className="text-xs text-slate-400">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem asChild>
                <Link href={`/admin/users/${u.id}`} className="cursor-pointer gap-2">
                  <Eye className="size-3.5 text-slate-400" />
                  Voir la fiche
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/users/${u.id}/update`} className="cursor-pointer gap-2">
                  <Pencil className="size-3.5 text-slate-400" />
                  Modifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-800" />
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => onDelete(u.id)}
                className="text-red-400 focus:text-red-300 focus:bg-red-950/40 cursor-pointer gap-2"
              >
                <Trash2 className="size-3.5 text-red-400" />
                Désactiver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${roleColor}`}>
            <Shield className="size-3" />
            {u.role}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              u.statut === "ACTIF"
                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            <span className={`size-1.5 rounded-full ${u.statut === "ACTIF" ? "bg-emerald-400" : "bg-slate-500"}`} />
            {u.statut}
          </span>

          {certBadge}
        </div>

        <div className="mt-4 space-y-1.5 text-xs text-slate-400">
          {u.telephone && (
            <div className="flex items-center gap-2 truncate">
              <Phone className="size-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{u.telephone}</span>
            </div>
          )}
          {u.etablissement && u.etablissement !== "Non renseigné" && (
            <p className="truncate">{u.etablissement}</p>
          )}
          {u.societe && <p className="truncate">{u.societe}</p>}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 text-xs text-slate-500 flex justify-between">
        <span>{u.categorie ?? "—"}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}
