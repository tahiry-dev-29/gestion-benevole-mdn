import { DistributionPanel, StatsCard } from "./stats-domain-panel";

export function StatsVolunteerPanel({ statuses, categories }: { statuses: { label: string; value: number }[]; categories: { label: string; value: number }[] }) {
  const active = statuses.find((row) => row.label === "Actifs")?.value ?? 0;
  return (
    <div className="grid gap-4">
      <StatsCard title="Bénévoles actifs" value={String(active)} caption="Comptes actifs non archivés" />
      <div className="grid gap-4 lg:grid-cols-2">
        <DistributionPanel title="Répartition par statut" rows={statuses} />
        <DistributionPanel title="Répartition par catégorie" rows={categories} />
      </div>
    </div>
  );
}
