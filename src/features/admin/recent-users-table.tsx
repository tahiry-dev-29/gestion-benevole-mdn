"use client";

import type { Role } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";

export interface RecentUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
}

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  VOLUNTEER: "Bénévole",
  USER: "Utilisateur",
};

const columns: ColumnDef<RecentUser>[] = [
  {
    id: "personne",
    accessorFn: (user) => `${user.prenom} ${user.nom}`,
    header: "Nom",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.prenom} {row.original.nom}
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="truncate text-muted-foreground">
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original.role === "ADMIN" || row.original.role === "SUPER_ADMIN"
            ? "default"
            : "secondary"
        }
      >
        {ROLE_LABELS[row.original.role]}
      </Badge>
    ),
  },
];

export function RecentUsersTable({ users }: { users: RecentUser[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      emptyMessage="Aucun compte n’est encore enregistré."
    />
  );
}
