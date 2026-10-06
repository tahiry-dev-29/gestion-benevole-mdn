"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { canManageRole, isRole, ROLES } from "@/lib/rbac";

import { VOLUNTEER_ROLES } from "../volunteer.schema";

import { formatFullName, roleLabel, statutLabel } from "./labels";
import { RolesMatrix } from "./roles-matrix";
import {
  useRoleCounts,
  useSetVolunteerStatut,
  useVolunteers,
} from "./use-volunteers";

export function RolesManagement({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionRole = session?.user?.role;
  const actorRole: Role | undefined = isRole(sessionRole)
    ? sessionRole
    : undefined;
  const currentId = session?.user?.id
    ? Number.parseInt(session.user.id, 10)
    : undefined;

  const countsQuery = useRoleCounts();
  const listQuery = useVolunteers({ pageSize: 100, sortBy: "nom" });
  const statutMutation = useSetVolunteerStatut();
  const accounts = listQuery.data?.data ?? [];

  const toggle = (id: number, statut: "ACTIF" | "INACTIF") => {
    statutMutation.mutate(
      { id, statut },
      {
        onSuccess: () => {
          toast.success("Statut mis à jour.");
          router.refresh();
        },
        onError: (mutationError) => toast.error(mutationError.message),
      }
    );
  };

  return (
    <div className="grid gap-6">
      <PageHeader
        title="Rôles & permissions"
        description="Matrice des rôles, comptes par rôle et bascule d'activation."
        action={
          !embedded ? (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 shadow-xs"
            >
              <Link href="/admin/volunteer-management">
                <ArrowLeft className="size-4" /> Retour aux bénévoles
              </Link>
            </Button>
          ) : undefined
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ROLES.map((role) => (
          <Card
            key={role}
            className="glass-sm transition-shadow hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {roleLabel(role)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold tracking-tight">
                {countsQuery.data ? countsQuery.data[role] : "—"}
              </span>
            </CardContent>
          </Card>
        ))}
      </section>

      <RolesMatrix />

      <div className="grid gap-6">
        {VOLUNTEER_ROLES.map((role) => {
          const roleAccounts = accounts.filter(
            (account) => account.role === role
          );
          return (
            <Card key={role}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {roleLabel(role)} — {roleAccounts.length} compte(s)
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {listQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">Chargement…</p>
                ) : roleAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun compte pour ce rôle.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roleAccounts.map((account) => {
                        const isSelf = currentId === account.id;
                        const canManage = Boolean(
                          actorRole &&
                          canManageRole(actorRole, account.role) &&
                          !isSelf
                        );
                        const nextStatut =
                          account.statut === "ACTIF" ? "INACTIF" : "ACTIF";
                        return (
                          <ContextMenu key={account.id}>
                            <ContextMenuTrigger asChild>
                              <TableRow className="cursor-context-menu">
                                <TableCell className="font-medium">
                                  {formatFullName(account)}
                                  {isSelf ? (
                                    <span className="ml-2 text-xs text-muted-foreground">
                                      (vous)
                                    </span>
                                  ) : null}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {account.email}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      account.statut === "ACTIF"
                                        ? "outline"
                                        : "secondary"
                                    }
                                  >
                                    {statutLabel(account.statut)}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    disabled={
                                      !canManage || statutMutation.isPending
                                    }
                                    onClick={() =>
                                      toggle(account.id, nextStatut)
                                    }
                                  >
                                    {statutMutation.isPending ? (
                                      <Loader2 className="size-4 animate-spin" />
                                    ) : null}
                                    {nextStatut === "ACTIF"
                                      ? "Activer"
                                      : "Désactiver"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-56">
                              <ContextMenuItem
                                onSelect={() =>
                                  router.push(
                                    `/admin/volunteer-management/${account.id}`
                                  )
                                }
                              >
                                Voir la fiche
                                <ContextMenuShortcut>↵</ContextMenuShortcut>
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                disabled={
                                  !canManage || statutMutation.isPending
                                }
                                onSelect={() => toggle(account.id, nextStatut)}
                              >
                                {nextStatut === "ACTIF"
                                  ? "Activer le compte"
                                  : "Désactiver le compte"}
                              </ContextMenuItem>
                              {isSelf ? (
                                <>
                                  <ContextMenuSeparator />
                                  <ContextMenuItem disabled>
                                    Vous ne pouvez pas modifier votre propre
                                    compte
                                  </ContextMenuItem>
                                </>
                              ) : null}
                            </ContextMenuContent>
                          </ContextMenu>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
