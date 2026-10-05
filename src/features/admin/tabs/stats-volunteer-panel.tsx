import { DistributionPanel, StatsCard } from "./stats-domain-panel";

const CATEGORY_LABELS: Record<string, string> = {
  PRIMAIRE: "Primaire",
  COLLEGIEN: "Collégien",
  UNIVERSITAIRE: "Universitaire",
  SALARIE: "Salarié",
};

export function StatsVolunteerPanel({
  statuses,
  categories,
  trend,
}: {
  statuses: { label: string; value: number }[];
  categories: { label: string; value: number }[];
  trend: number;
}) {
  const active = statuses.find((row) => row.label === "Actifs")?.value ?? 0;
  const inactive = statuses.find((row) => row.label === "Inactifs")?.value ?? 0;
  const total = active + inactive;
  const trendLabel = `${trend > 0 ? "+" : ""}${trend} ce mois`;
  return (
    <div className="grid gap-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicateurs bénévoles">
        <StatsCard title="Bénévoles suivis" value={String(total)} caption="Comptes non archivés" />
        <StatsCard title="Actifs" value={String(active)} trend={trend} trendLabel={trendLabel} caption="Évolution des créations vs mois dernier" />
        <StatsCard title="Inactifs" value={String(inactive)} />
        <StatsCard title="Catégories représentées" value={String(categories.length)} />
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <DistributionPanel title="Répartition par statut" rows={statuses} />
        <DistributionPanel
          title="Répartition par catégorie"
          rows={categories.map((row) => ({
            ...row,
            label: CATEGORY_LABELS[row.label] ?? row.label,
          }))}
        />
      </div>
    </div>
  );
}
