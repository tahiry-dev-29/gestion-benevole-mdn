"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { Role } from "@prisma/client";
import {
  ArrowUpRight,
  CalendarCheck,
  MessageSquareText,
  Trash2,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { canManageRole, isRole } from "@/lib/rbac";

import type { Volunteer } from "../volunteer.entity";

import { VolunteerHeroCard } from "./_components/volunteer-hero-card";
import { VolunteerMetadataCard } from "./_components/volunteer-metadata-card";
import { formatFullName } from "./labels";
import { useDeleteVolunteer, useSetVolunteerStatut } from "./use-volunteers";
import { VolunteerForm } from "./volunteer-form";

function RelatedModule({
  title,
  description,
  href,
  action,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
  icon: typeof CalendarCheck;
}) {
  return (
    <Card className="glass-sm">
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="min-h-11">
          <Link href={href}>
            {action}
            <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
          </Link>
        </Button>
      </CardContent>
    </Card>
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
    <div className="grid gap-5">
      <Tabs defaultValue="profil" className="grid gap-5">
        <TabsList className="glass-sm flex h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
          <TabsTrigger value="profil" className="min-h-10 flex-none px-3">
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="presences"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <CalendarCheck aria-hidden="true" /> Présences
          </TabsTrigger>
          <TabsTrigger
            value="credits"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <WalletCards aria-hidden="true" /> Crédits
          </TabsTrigger>
          <TabsTrigger
            value="observations"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <MessageSquareText aria-hidden="true" /> Observations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="grid gap-5">
          <VolunteerHeroCard
            volunteer={volunteer}
            canManage={canManage}
            isPending={statutMutation.isPending}
            onToggleStatut={toggleStatut}
          />

          <div className="grid gap-5 lg:grid-cols-3">
            <VolunteerMetadataCard volunteer={volunteer} />

            <Card id="modifier" className="glass-sm lg:col-span-2">
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

          <Card className="glass-sm border-destructive/30">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-destructive">
                Zone sensible
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-sm text-muted-foreground">
                L&apos;archivage retire ce compte de la liste active des
                bénévoles tout en préservant l&apos;historique des activités et
                présences passées.
              </p>
              <Button
                variant="destructive"
                className="shrink-0 gap-2 shadow-xs"
                disabled={!canManage}
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="size-4" /> Supprimer ce compte
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presences">
          <RelatedModule
            title="Présences"
            description={`Consultez le pointage des bénévoles et retrouvez les mouvements de ${formatFullName(volunteer)} dans le module de présence.`}
            href="/admin/presences"
            action="Ouvrir les présences"
            icon={CalendarCheck}
          />
        </TabsContent>
        <TabsContent value="credits">
          <RelatedModule
            title="Crédits"
            description={`Consultez le registre des crédits et les opérations liées à ${formatFullName(volunteer)}.`}
            href="/admin/credits"
            action="Ouvrir les crédits"
            icon={WalletCards}
          />
        </TabsContent>
        <TabsContent value="observations">
          <RelatedModule
            title="Observations"
            description={`Ouvrez le registre des observations pour suivre les notes concernant ${formatFullName(volunteer)}.`}
            href="/admin/observations"
            action="Ouvrir les observations"
            icon={MessageSquareText}
          />
        </TabsContent>
      </Tabs>

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
