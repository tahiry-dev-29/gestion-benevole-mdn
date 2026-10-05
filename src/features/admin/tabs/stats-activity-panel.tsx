import { DistributionPanel, StatsCard } from "./stats-domain-panel";

export function StatsActivityPanel({ statuses, published }: { statuses: { label: string; value: number }[]; published: number }) {
  const total = statuses.reduce((sum, row) => sum + row.value, 0);
  return (
    <div className="grid gap-4">
      <StatsCard title="Activités publiées" value={String(published)} caption={`${total} activité${total === 1 ? "" : "s"} enregistrée${total === 1 ? "" : "s"}`} />
      <DistributionPanel title="État de publication" rows={statuses} />
    </div>
  );
}
