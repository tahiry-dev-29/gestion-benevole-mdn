"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canManageRole, isRole } from "@/lib/rbac";

import type { Volunteer } from "../volunteer.entity";

import { formatDate, formatFullName, roleLabel, statutLabel } from "./labels";
import { useDeleteVolunteer, useSetVolunteerStatut } from "./use-volunteers";
import { VolunteerForm } from "./volunteer-form";

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

export function VolunteerDetail({ volunteer }: { volunteer: Volunteer }) {
  const router = useRouter();
  const { data: session } = useSession();
  const sessionRole = session?.user?.role;
  const actorRole: Role | undefined = isRole(sessionRole)
    ? sessionRole
    : undefined;
  const currentId = session?.user?.id
    ? Number.parseInt(session.user.id, 10)
    : undefined;

  const isSelf = currentId === volunteer.id;
  const canManage = Boolean(
    actorRole && canManageRole(actorRole, volunteer.role) && !isSelf
  );

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const deleteMutation = useDeleteVolunteer();
  const statutMutation = useSetVolunteerStatut();

  const toggleStatut = () => {
    statutMutation.mutate(
      {
        id: volunteer.id,
        statut: volunteer.statut === "ACTIF" ? "INACTIF" : "ACTIF",
      },
      {
        onSuccess: () => {
          toast.success("Statut mis à jour.");
          router.refresh();
        },
        onError: (mutationError) => toast.error(mutationError.message),
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(volunteer.id, {
      onSuccess: () => {
        toast.success("Bénévole supprimé (archivé).");
        setDeleteOpen(false);
        router.push("/admin/volunteer-management");
      },
      onError: (mutationError) => toast.error(mutationError.message),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-lg">
            Informations
            <Badge
              variant={volunteer.role === "VOLUNTEER" ? "secondary" : "default"}
            >
              {roleLabel(volunteer.role)}
            </Badge>
            <Badge
              variant={volunteer.statut === "ACTIF" ? "outline" : "secondary"}
            >
              {statutLabel(volunteer.statut)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="Nom complet" value={formatFullName(volunteer)} />
          <InfoRow label="Email" value={volunteer.email} />
          <InfoRow
            label="Date d'entrée"
            value={formatDate(volunteer.dateEntree)}
          />
          <InfoRow label="Créé le" value={formatDate(volunteer.createdAt)} />
          <InfoRow
            label="Créé par"
            value={
              volunteer.createdBy ? formatFullName(volunteer.createdBy) : "—"
            }
          />
          <InfoRow label="ID créateur" value={volunteer.createdById ?? "—"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="text-lg">Modifier</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            disabled={!canManage || statutMutation.isPending}
            onClick={toggleStatut}
          >
            {statutMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : null}
            {volunteer.statut === "ACTIF" ? "Désactiver" : "Activer"} le compte
          </Button>
        </CardHeader>
        <CardContent>
          {canManage ? (
            <VolunteerForm mode="edit" initialData={volunteer} />
          ) : (
            <p className="text-sm text-muted-foreground">
              Vous ne pouvez pas modifier ce compte (compte de rang supérieur ou
              votre propre compte).
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">
            Zone sensible
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            La suppression est un archivage (soft delete) : le compte disparaît
            de la liste mais l&apos;historique est conservé.
          </p>
          <Button
            variant="destructive"
            className="gap-2"
            disabled={!canManage}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" /> Supprimer
          </Button>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title={`Supprimer ${formatFullName(volunteer)} ?`}
        description="Le compte sera archivé (soft delete) et disparaîtra de la liste."
      />
    </div>
  );
}
