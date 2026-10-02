"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canManageRole, isRole } from "@/lib/rbac";

import type { Volunteer } from "../volunteer.entity";

import { VolunteerHeroCard } from "./_components/volunteer-hero-card";
import { VolunteerMetadataCard } from "./_components/volunteer-metadata-card";
import { formatFullName } from "./labels";
import { useDeleteVolunteer, useSetVolunteerStatut } from "./use-volunteers";
import { VolunteerForm } from "./volunteer-form";

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

  const isActif = volunteer.statut === "ACTIF";

  const toggleStatut = () => {
    statutMutation.mutate(
      {
        id: volunteer.id,
        statut: isActif ? "INACTIF" : "ACTIF",
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
      <VolunteerHeroCard
        volunteer={volunteer}
        canManage={canManage}
        isPending={statutMutation.isPending}
        onToggleStatut={toggleStatut}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <VolunteerMetadataCard volunteer={volunteer} />

        <Card className="shadow-xs lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Modifier les informations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {canManage ? (
              <VolunteerForm mode="edit" initialData={volunteer} />
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                {isSelf
                  ? "Vous ne pouvez pas modifier votre propre rôle ou statut depuis cet écran."
                  : "Vous ne possédez pas les permissions requises pour modifier un compte de ce rang."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive/30 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-destructive">
            Zone sensible
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            L&apos;archivage retire ce compte de la liste active des bénévoles tout en préservant l&apos;historique des activités et présences passées.
          </p>
          <Button
            variant="destructive"
            className="gap-2 shrink-0 shadow-xs"
            disabled={!canManage}
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="size-4" /> Supprimer ce compte
          </Button>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title={`Archiver ${formatFullName(volunteer)} ?`}
        description="Le compte sera désactivé et archivé (soft delete). Cette action est réversible par un administrateur."
      />
    </div>
  );
}
