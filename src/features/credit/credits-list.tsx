"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import {
  useCredits,
  useCreditTotals,
  useDeleteCredit,
} from "@/features/credit/use-credits";

import { CreditFilters } from "./_components/credit-filters";
import { CreditTable } from "./_components/credit-table";
import { CreditTotals } from "./_components/credit-totals";

interface User {
  id: number;
  nom: string;
  prenom: string;
}

interface CreditsListProps {
  benevoles: User[];
}

const CURRENT_YEAR = new Date().getFullYear();

export function CreditsList({ benevoles }: CreditsListProps) {
  const queryClient = useQueryClient();
  const [filterUserId, setFilterUserId] = React.useState<number | undefined>();
  const [filterMois, setFilterMois] = React.useState<number | undefined>();
  const [filterAnnee, setFilterAnnee] = React.useState<number | undefined>(
    CURRENT_YEAR
  );
  const [deleteTarget, setDeleteTarget] = React.useState<number | null>(null);
  const creditsQuery = useCredits({
    userId: filterUserId,
    mois: filterMois,
    annee: filterAnnee,
  });
  const totalsQuery = useCreditTotals({ mois: filterMois, annee: filterAnnee });
  const deleteCredit = useDeleteCredit();
  const credits = creditsQuery.data ?? [];
  const cumulData = totalsQuery.data ?? { parBenevole: [], totalGlobal: 0 };

  function handleRefresh() {
    void queryClient.invalidateQueries({ queryKey: ["credits"] });
    void queryClient.invalidateQueries({ queryKey: ["credits-cumul"] });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteCredit.mutateAsync(deleteTarget);
      toast.success("Crédit supprimé");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      );
    }
  }

  return (
    <div className="space-y-6">
      <CreditFilters
        benevoles={benevoles}
        filterUserId={filterUserId}
        filterMois={filterMois}
        filterAnnee={filterAnnee}
        onFilterUserChange={setFilterUserId}
        onFilterMoisChange={setFilterMois}
        onFilterAnneeChange={setFilterAnnee}
        onRefresh={handleRefresh}
      />

      <CreditTotals
        totalGlobal={cumulData.totalGlobal}
        cumul={cumulData.parBenevole}
      />

      <CreditTable credits={credits} onDeleteClick={setDeleteTarget} />

      {creditsQuery.isPending || totalsQuery.isPending ? (
        <p role="status" className="text-sm text-muted-foreground">
          Chargement des crédits…
        </p>
      ) : null}
      {creditsQuery.isError || totalsQuery.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {creditsQuery.error?.message ?? totalsQuery.error?.message}
        </p>
      ) : null}

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={deleteCredit.isPending}
        title="Supprimer ce crédit ?"
        description="Ce crédit sera définitivement supprimé. Le cumul sera recalculé."
      />
    </div>
  );
}
