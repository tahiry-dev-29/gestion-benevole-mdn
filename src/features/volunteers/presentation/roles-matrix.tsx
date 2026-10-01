"use client";

import { Check, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { canCreate, canLogin, ROLES } from "@/lib/rbac";

import { roleLabel } from "./labels";

function Cell({ granted }: { granted: boolean }) {
  return granted ? (
    <Check className="mx-auto size-4 text-emerald-500" aria-label="Autorisé" />
  ) : (
    <X className="mx-auto size-4 text-muted-foreground" aria-label="Refusé" />
  );
}

const CREATE_TARGETS = ["SUPER_ADMIN", "ADMIN", "VOLUNTEER"] as const;

export function RolesMatrix() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Matrice rôles × permissions</CardTitle>
        <CardDescription>
          Source unique de vérité appliquée côté serveur (canCreate). Seul un
          SUPER_ADMIN peut faire évoluer ces règles.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-center">Connexion</TableHead>
              {CREATE_TARGETS.map((target) => (
                <TableHead key={target} className="text-center">
                  Créer {roleLabel(target)}
                </TableHead>
              ))}
              <TableHead className="text-center">Gérer les rôles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROLES.map((role) => (
              <TableRow key={role}>
                <TableCell className="font-medium">{roleLabel(role)}</TableCell>
                <TableCell>
                  <Cell granted={canLogin(role)} />
                </TableCell>
                {CREATE_TARGETS.map((target) => (
                  <TableCell key={target}>
                    <Cell granted={canCreate(role, target)} />
                  </TableCell>
                ))}
                <TableCell>
                  <Cell granted={role === "SUPER_ADMIN"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
