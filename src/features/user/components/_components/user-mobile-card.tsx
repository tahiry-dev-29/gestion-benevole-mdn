import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import type { UserItem } from "../types";

const certificateLabel = {
  NON_DEMANDE: "Certificat non demandé",
  EN_ATTENTE: "Certificat à vérifier",
  APPROUVE: "Certificat approuvé",
  REJETE: "Certificat rejeté",
} as const;

export function UserMobileCard({ user }: { user: UserItem }) {
  const certificate = user.certificatStatut ?? "NON_DEMANDE";
  const organization =
    user.societe || user.etablissement || "Organisation non renseignée";

  return (
    <article className="glass-sm rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="size-11 shrink-0">
            <AvatarImage src={user.photo ?? undefined} alt="" />
            <AvatarFallback>
              {`${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-foreground">
              {user.prenom} {user.nom}
            </h3>
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {organization}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge
            className="max-w-36 truncate text-[11px] sm:max-w-none sm:text-xs"
            variant={
              certificate === "EN_ATTENTE"
                ? "secondary"
                : certificate === "REJETE"
                  ? "destructive"
                  : certificate === "APPROUVE"
                    ? "default"
                    : "outline"
            }
          >
            {certificateLabel[certificate]}
          </Badge>
          <Badge variant={user.statut === "ACTIF" ? "outline" : "secondary"}>
            {user.statut === "ACTIF" ? "Actif" : "Inactif"}
          </Badge>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
        <p className="flex min-w-0 items-center gap-2">
          <Mail aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{user.email}</span>
        </p>
        <p className="flex items-center gap-2">
          <Phone aria-hidden="true" className="size-4 shrink-0" />
          <span>
            {user.telephone || user.contact || "Téléphone non renseigné"}
          </span>
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <div>
          <p className="text-xs text-muted-foreground">Matricule</p>
          <p className="mt-0.5 font-medium text-foreground">
            {user.matricule || "À renseigner"}
          </p>
        </div>
        <Link
          href={`/admin/users/${user.id}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-primary transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Ouvrir la fiche de ${user.prenom} ${user.nom}`}
        >
          Ouvrir la fiche
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </article>
  );
}
