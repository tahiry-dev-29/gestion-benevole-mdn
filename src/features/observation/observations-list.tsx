"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableCard } from "@/features/admin/table-card";
import {
  deleteObservationAction,
  updateObservationAction,
} from "@/features/observation/observation.action";
import {
  listObservationsAction,
  type ObservationItem,
} from "@/features/observation/observation-queries.action";

import { ObservationFilters } from "./_components/observation-filters";
import { ObservationRow } from "./_components/observation-row";

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
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editContenu, setEditContenu] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<number | null>(null);

  const observationsQuery = useQuery({
    queryKey: ["observations", filterUserId, filterMois, filterAnnee],
    queryFn: async () => {
      const res = await listObservationsAction({
        userId: filterUserId,
        mois: filterMois,
        annee: filterAnnee,
      });
      if (!res.success) throw new Error(res.error);
      return res.data ?? [];
    },
  });
  const observations = observationsQuery.data ?? [];

  const updateMutation = useMutation({
    mutationFn: async (input: { observationId: number; contenu: string }) => {
      const result = await updateObservationAction(input);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["observations"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: async (observationId: number) => {
      const result = await deleteObservationAction({ observationId });
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["observations"] }),
  });

  function handleRefresh() {
    void queryClient.invalidateQueries({ queryKey: ["observations"] });
  }

  function canModify(obs: ObservationItem) {
    return isAdmin || obs.auteurId === currentUserId;
  }

  async function handleSaveEdit(obs: ObservationItem) {
    if (!editContenu.trim()) return;
    try {
      await updateMutation.mutateAsync({
        observationId: obs.id,
        contenu: editContenu,
      });
      toast.success("Observation mise à jour");
      setEditingId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget);
      toast.success("Observation supprimée");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  }

  return (
    <div className="space-y-6">
      <ObservationFilters
        benevoles={benevoles}
        filterUserId={filterUserId}
        filterMois={filterMois}
        filterAnnee={filterAnnee}
        onFilterUserChange={setFilterUserId}
        onFilterMoisChange={setFilterMois}
        onFilterAnneeChange={setFilterAnnee}
        onRefresh={handleRefresh}
      />

      <TableCard title="Historique des observations">
        {observationsQuery.isPending ? (
          <p role="status" className="p-4 text-sm text-muted-foreground">
            Chargement des observations…
          </p>
        ) : null}
        {observationsQuery.isError ? (
          <p role="alert" className="p-4 text-sm text-destructive">
            {observationsQuery.error.message}
          </p>
        ) : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bénévole</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Observation</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {observations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  Aucune observation pour les filtres sélectionnés
                </TableCell>
              </TableRow>
            ) : (
              observations.map((obs) => (
                <ObservationRow
                  key={obs.id}
                  obs={obs}
                  canModify={canModify(obs)}
                  isEditing={editingId === obs.id}
                  editContenu={editContenu}
                  isSaving={updateMutation.isPending}
                  onStartEdit={() => {
                    setEditingId(obs.id);
                    setEditContenu(obs.contenu);
                  }}
                  onCancelEdit={() => setEditingId(null)}
                  onEditChange={setEditContenu}
                  onSaveEdit={() => handleSaveEdit(obs)}
                  onDeleteClick={() => setDeleteTarget(obs.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableCard>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
        title="Supprimer cette observation ?"
        description="Cette observation sera définitivement supprimée."
      />
    </div>
  );
}
