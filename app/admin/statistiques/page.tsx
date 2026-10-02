import { CalendarCheck, Coins, UserCheck, Users } from "lucide-react";

import { getAdminStatistics } from "@/features/admin/metrics";
import { PageHeader } from "@/features/admin/page-header";
import { StatCard } from "@/features/admin/stat-card";

export default async function StatistiquesPage() {
  const metrics = await getAdminStatistics();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistiques"
        description="Indicateurs clés de l'activité associative."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Bénévoles"
          value={String(metrics.activeVolunteers)}
          icon={Users}
        />
        <StatCard
          label="Activités"
          value={String(metrics.publishedActivities)}
          icon={CalendarCheck}
        />
        <StatCard
          label="Crédits cumulés"
          value={`${metrics.totalCredits.toFixed(2)} €`}
          icon={Coins}
        />
        <StatCard
          label="Présents aujourd'hui"
          value={String(metrics.presentToday)}
          icon={UserCheck}
        />
      </section>
    </div>
  );
}
