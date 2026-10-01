"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { deleteCreditAction, listCreditsAction } from "@/features/credit/credit.action";
import { getCumulCreditsAction } from "@/features/credit/credit-cumul.action";

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
  const [filterAnnee, setFilterAnnee] = React.useState<number | undefined>(CURRENT_YEAR);
  const [deleteTarget, setDeleteTarget] = React.useState<number | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { data: credits = [] } = useQuery({
    queryKey: ["credits", filterUserId, filterMois, filterAnnee],
    queryFn: async () => {
      const res = await listCreditsAction({
        userId: filterUserId,
        mois: filterMois,
        annee: filterAnnee,
      });
      return res.success ? res.data ?? [] : [];
    },
  });

  const { data: cumulData = { parBenevole: [], totalGlobal: 0 } } = useQuery({
    queryKey: ["credits-cumul", filterMois, filterAnnee],
    queryFn: async () => {
      const res = await getCumulCreditsAction({ mois: filterMois, annee: filterAnnee });
      return res.success && res.data ? res.data : { parBenevole: [], totalGlobal: 0 };
    },
  });

  function handleRefresh() {
    void queryClient.invalidateQueries({ queryKey: ["credits"] });
    void queryClient.invalidateQueries({ queryKey: ["credits-cumul"] });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const result = await deleteCreditAction({ creditId: deleteTarget });
      if (!result.success) {
        toast.error(result.error ?? "Erreur lors de la suppression");
        return;
      }
      toast.success("Crédit supprimé");
      setDeleteTarget(null);
      handleRefresh();
    } finally {
      setIsDeleting(false);
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

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isPending={isDeleting}
        title="Supprimer ce crédit ?"
        description="Ce crédit sera définitivement supprimé. Le cumul sera recalculé."
      />
    </div>
  );
}
