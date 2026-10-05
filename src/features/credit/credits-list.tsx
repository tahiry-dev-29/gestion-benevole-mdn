"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BarChart3, ListFilter } from "lucide-react";
import { toast } from "sonner";

import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCredits,
  useCreditTotals,
  useDeleteCredit,
} from "@/features/credit/use-credits";

import { CreditFilters } from "./_components/credit-filters";
import { CreditTable } from "./_components/credit-table";
import { CreditTotals } from "./_components/credit-totals";
import { CreditsAnalyticsTab } from "./tabs/credits-analytics-tab";

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
  const analyticsCumul = filterUserId
    ? cumulData.parBenevole.filter((entry) => entry.userId === filterUserId)
    : cumulData.parBenevole;
  const analyticsTotal = filterUserId
    ? analyticsCumul.reduce((total, entry) => total + entry.total, 0)
    : cumulData.totalGlobal;
  const isFetching = creditsQuery.isFetching || totalsQuery.isFetching;

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
        isFetching={isFetching}
        onFilterUserChange={setFilterUserId}
        onFilterMoisChange={setFilterMois}
        onFilterAnneeChange={setFilterAnnee}
        onRefresh={handleRefresh}
      />

      <Tabs defaultValue="liste" className="grid gap-5">
        <TabsList className="glass-sm h-auto w-full justify-start gap-1 p-1 sm:w-fit">
          <TabsTrigger value="liste" className="min-h-10 gap-2 px-3">
            <ListFilter aria-hidden="true" /> Liste
          </TabsTrigger>
          <TabsTrigger value="analytiques" className="min-h-10 gap-2 px-3">
            <BarChart3 aria-hidden="true" /> Analytiques
          </TabsTrigger>
        </TabsList>
        <TabsContent value="liste" className="grid gap-5">
          <CreditTotals
            totalGlobal={cumulData.totalGlobal}
            cumul={cumulData.parBenevole}
          />
          {creditsQuery.isError || totalsQuery.isError ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            >
              {creditsQuery.error?.message ?? totalsQuery.error?.message}
            </div>
          ) : null}
          <CreditTable
            credits={credits}
            isLoading={creditsQuery.isPending}
            onDeleteClick={setDeleteTarget}
          />
        </TabsContent>
        <TabsContent value="analytiques">
          <CreditsAnalyticsTab
            cumul={analyticsCumul}
            totalGlobal={analyticsTotal}
          />
        </TabsContent>
      </Tabs>

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
