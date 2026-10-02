import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { UserItem } from "../types";

const CERTIFICATE_LABELS = {
  NON_DEMANDE: "Non demandé",
  EN_ATTENTE: "En attente",
  APPROUVE: "Approuvé",
  REJETE: "Rejeté",
} as const;

export function createUserColumns(): ColumnDef<UserItem>[] {
  return [
    {
      accessorKey: "matricule",
      header: "Matricule",
      cell: ({ row }) => row.original.matricule || "À renseigner",
    },
    {
      accessorKey: "prenom",
      header: "Nom complet",
      cell: ({ row }) => `${row.original.prenom} ${row.original.nom}`,
    },
    { accessorKey: "email", header: "Email" },
    {
      id: "organisation",
      header: "École / société",
      cell: ({ row }) =>
        row.original.societe || row.original.etablissement || "—",
    },
    {
      accessorKey: "sexe",
      header: "Genre",
      cell: ({ row }) => row.original.sexe || "—",
    },
    {
      accessorKey: "telephone",
      header: "Téléphone",
      cell: ({ row }) => row.original.telephone || row.original.contact || "—",
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
          variant={row.original.statut === "ACTIF" ? "default" : "secondary"}
        >
          {row.original.statut === "ACTIF" ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Fiche",
      cell: ({ row }) => (
        <Button
          asChild
          variant="ghost"
          size="icon"
          aria-label={`Voir la fiche de ${row.original.prenom} ${row.original.nom}`}
          title="Voir la fiche"
        >
          <Link href={`/admin/users/${row.original.id}`}>
            <Eye className="size-4" />
          </Link>
        </Button>
      ),
    },
  ];
}
