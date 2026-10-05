import Link from "next/link";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Pencil,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { UserItem } from "../types";

const CERTIFICATE_LABELS = {
  NON_DEMANDE: "Non demandé",
  EN_ATTENTE: "À vérifier",
  APPROUVE: "Approuvé",
  REJETE: "Rejeté",
} as const;

function SortableHeading({
  label,
  column,
}: {
  label: string;
  column: Column<UserItem, unknown>;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 min-h-9 gap-2 px-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown
        aria-hidden="true"
        className="size-3.5 text-muted-foreground"
      />
    </Button>
  );
}

function initials(user: UserItem) {
  return `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toLocaleUpperCase();
}

export function createUserColumns({
  onDelete,
}: {
  onDelete: (user: UserItem) => void;
}): ColumnDef<UserItem>[] {
  return [
    {
      id: "personne",
      accessorFn: (user) => `${user.prenom} ${user.nom}`,
      header: ({ column }) => <SortableHeading label="Nom" column={column} />,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex min-w-0 items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0 rounded-full p-0"
                  aria-label={`Aperçu du compte de ${user.prenom} ${user.nom}`}
                >
                  <Avatar className="size-9">
                    <AvatarImage src={user.photo ?? undefined} alt="" />
                    <AvatarFallback>{initials(user)}</AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72">
                <div className="flex items-start gap-3">
                  <Avatar className="size-11">
                    <AvatarImage src={user.photo ?? undefined} alt="" />
                    <AvatarFallback>{initials(user)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">
                      {user.prenom} {user.nom}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <dl className="mt-4 grid gap-2 border-t pt-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Matricule</dt>
                    <dd className="font-medium">{user.matricule || "—"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Statut</dt>
                    <dd>{user.statut === "ACTIF" ? "Actif" : "Inactif"}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Certificat</dt>
                    <dd>
                      {
                        CERTIFICATE_LABELS[
                          user.certificatStatut ?? "NON_DEMANDE"
                        ]
                      }
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-muted-foreground">Inscription</dt>
                    <dd>
                      {new Date(user.date_entree).toLocaleDateString("fr-FR")}
                    </dd>
                  </div>
                </dl>
              </PopoverContent>
            </Popover>
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {user.prenom} {user.nom}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {user.matricule || "Matricule à renseigner"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <SortableHeading label="Contact" column={column} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] min-w-0">
          <p className="truncate" title={row.original.email}>
            {row.original.email}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {row.original.telephone ||
              row.original.contact ||
              "Téléphone non renseigné"}
          </p>
        </div>
      ),
    },
    {
      id: "organisation",
      header: "Organisation",
      cell: ({ row }) => (
        <span className="max-w-40 truncate">
          {row.original.societe || row.original.etablissement || "—"}
        </span>
      ),
    },
    {
      accessorKey: "certificatStatut",
      header: "Certificat",
      cell: ({ row }) => {
        const status = row.original.certificatStatut ?? "NON_DEMANDE";
        return (
          <Badge
            variant={
              status === "APPROUVE"
                ? "default"
                : status === "REJETE"
                  ? "destructive"
                  : status === "EN_ATTENTE"
                    ? "secondary"
                    : "outline"
            }
          >
            {CERTIFICATE_LABELS[status]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "statut",
      header: "Compte",
      cell: ({ row }) => (
        <Badge
          variant={row.original.statut === "ACTIF" ? "outline" : "secondary"}
        >
          {row.original.statut === "ACTIF" ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-10"
              aria-label={`Actions pour ${row.original.prenom} ${row.original.nom}`}
            >
              <MoreHorizontal aria-hidden="true" className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${row.original.id}`}>
                <Eye aria-hidden="true" />
                Voir la fiche
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/users/${row.original.id}/update`}>
                <Pencil aria-hidden="true" />
                Modifier
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => onDelete(row.original)}
            >
              <UserRound aria-hidden="true" />
              Désactiver
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
