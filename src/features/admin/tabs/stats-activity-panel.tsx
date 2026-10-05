import { DistributionPanel, StatsCard } from "./stats-domain-panel";

export function StatsActivityPanel({
  statuses,
  published,
}: {
  statuses: { label: string; value: number }[];
  published: number;
}) {
  const total = statuses.reduce((sum, row) => sum + row.value, 0);
  const draft = statuses.find((row) => row.label === "Brouillons")?.value ?? 0;
  return (
    <div className="grid gap-4">
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Indicateurs activités">
        <StatsCard title="Total" value={String(total)} caption="Activités enregistrées" />
        <StatsCard title="Publiées" value={String(published)} />
        <StatsCard title="Brouillons" value={String(draft)} />
      </section>
      <DistributionPanel
        title="État de publication"
        rows={statuses.length > 0 ? statuses : [{ label: "Publiées", value: 0 }, { label: "Brouillons", value: 0 }]}
      />
    </div>
  );
}
