import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/features/admin/page-header";
import { TableCard } from "@/features/admin/table-card";
import { users } from "@/features/users/user.data";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Utilisateurs"
        description="Comptes et rôles des utilisateurs de l'association."
        action={
          <Button size="sm">
            <Users className="size-4" />
            Gérer les utilisateurs
          </Button>
        }
      />

      <TableCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date d&apos;entrée</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">
                  {u.prenom} {u.nom}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={u.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {u.role === "ADMIN" ? "Admin" : "Bénévole"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {u.date_entree}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableCard>
    </div>
  );
}