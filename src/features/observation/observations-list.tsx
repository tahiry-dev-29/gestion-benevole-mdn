"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ClipboardList, UserRound } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
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
