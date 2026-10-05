"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardList, ShieldAlert, UserRound } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ObservationItem } from "@/features/observation/observation-queries.action";
import {
  useDeleteObservation,
  useObservations,
} from "@/features/observation/use-observations";

import { EditObservationDialog } from "./_components/edit-observation-dialog";
import { ObservationFilters } from "./_components/observation-filters";
import { ObservationTable } from "./_components/observation-table";

interface User {
  id: number;
  nom: string;
  prenom: string;
}

interface ObservationsListProps {
  benevoles: User[];
  currentUserId: number;
  isAdmin: boolean;
}

const CURRENT_YEAR = new Date().getFullYear();

export function ObservationsList({
  benevoles,
  currentUserId,
  isAdmin,
}: ObservationsListProps) {
  const queryClient = useQueryClient();
  const [filterUserId, setFilterUserId] = React.useState<number | undefined>();
  const [filterMois, setFilterMois] = React.useState<number | undefined>();
  const [filterAnnee, setFilterAnnee] = React.useState<number | undefined>(
    CURRENT_YEAR
  );
  const [editingObs, setEditingObs] = React.useState<ObservationItem | null>(
    null
  );
  const [viewingObs, setViewingObs] = React.useState<ObservationItem | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = React.useState<number | null>(null);

  const observationsQuery = useObservations({
    userId: filterUserId,
    mois: filterMois,
    annee: filterAnnee,
  });
  const deleteObservation = useDeleteObservation();

  function handleRefresh() {
    void queryClient.invalidateQueries({ queryKey: ["observations"] });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteObservation.mutateAsync(deleteTarget);
      toast.success("Observation supprimée");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur de suppression"
      );
    }
  }

  return (
    <div className="space-y-6">
      <ObservationFilters
        benevoles={benevoles}
        filterUserId={filterUserId}
        filterMois={filterMois}
        filterAnnee={filterAnnee}
        isFetching={observationsQuery.isFetching}
        onFilterUserChange={setFilterUserId}
        onFilterMoisChange={setFilterMois}
        onFilterAnneeChange={setFilterAnnee}
        onRefresh={handleRefresh}
      />

      {observationsQuery.isError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
        >
          {observationsQuery.error.message}
        </div>
      ) : null}

      <Tabs
        defaultValue={isAdmin ? "miennes" : "toutes"}
        className="grid gap-4"
      >
        <TabsList className="glass-sm h-auto w-fit gap-1 p-1">
          {isAdmin ? (
            <TabsTrigger value="miennes" className="min-h-10 gap-2 px-3">
              <UserRound aria-hidden="true" />
              Mes observations
            </TabsTrigger>
          ) : null}
          <TabsTrigger value="toutes" className="min-h-10 gap-2 px-3">
            <ClipboardList aria-hidden="true" />
            Toutes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="toutes">
          <ObservationTable
            observations={observationsQuery.data ?? []}
            isLoading={observationsQuery.isPending}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onView={setViewingObs}
            onEdit={setEditingObs}
            onDelete={setDeleteTarget}
          />
        </TabsContent>
        {isAdmin ? (
          <TabsContent value="miennes">
            <ObservationTable
              observations={(observationsQuery.data ?? []).filter(
                (item) => item.auteurId === currentUserId
              )}
              isLoading={observationsQuery.isPending}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onView={setViewingObs}
              onEdit={setEditingObs}
              onDelete={setDeleteTarget}
            />
          </TabsContent>
        ) : null}
      </Tabs>

      <EditObservationDialog
        observation={editingObs}
        open={editingObs !== null}
        onOpenChange={(open) => !open && setEditingObs(null)}
      />

      <Sheet
        open={viewingObs !== null}
        onOpenChange={(open) => !open && setViewingObs(null)}
      >
        <SheetContent className="glass-xl w-full overflow-y-auto sm:max-w-xl">
          {viewingObs ? (
            <>
              <SheetHeader className="pr-8 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <ShieldAlert className="size-5 text-primary" aria-hidden="true" />
                  Observation de {viewingObs.benevole}
                </SheetTitle>
                <SheetDescription>
                  <span className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(
                        new Date(viewingObs.annee, viewingObs.mois - 1, 1)
                      )} {viewingObs.annee}
                    </Badge>
                    <span>Rédigée par {viewingObs.auteur ?? "—"}</span>
                  </span>
                </SheetDescription>
              </SheetHeader>
              <p className="mt-6 whitespace-pre-wrap break-words rounded-xl border bg-card/60 p-4 text-sm leading-7">
                {viewingObs.contenu}
              </p>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteObservation.isPending}
        title="Supprimer cette observation ?"
        description="Cette observation sera définitivement supprimée."
      />
    </div>
  );
}
