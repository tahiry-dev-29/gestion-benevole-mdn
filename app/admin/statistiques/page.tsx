import { CalendarCheck, Coins, UserCheck, Users } from "lucide-react";

import { activities, credits, presences } from "@/features/admin/admin.data";
import { PageHeader } from "@/features/admin/page-header";
import { StatCard } from "@/features/admin/stat-card";
import { users } from "@/features/users/user.data";

export default function StatistiquesPage() {
  const benevoles = users.filter((u) => u.role === "BENEVOLE").length;
  const totalCredits = credits.reduce((sum, c) => sum + c.montant, 0);
  const presencesJour = presences.filter((p) => p.statut === "PRESENT").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statistiques"
        description="Indicateurs clés de l'activité associative."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Bénévoles"
          value={String(benevoles)}
          change="+12%"
          trend="up"
          icon={Users}
        />
        <StatCard
          label="Activités"
          value={String(activities.length)}
          change="+3"
          trend="up"
          icon={CalendarCheck}
        />
        <StatCard
          label="Crédits cumulés"
          value={`${totalCredits} €`}
          change="+8%"
          trend="up"
          icon={Coins}
        />
        <StatCard
          label="Présents aujourd'hui"
          value={String(presencesJour)}
          change="-2"
          trend="down"
          icon={UserCheck}
        />
      </section>
    </div>
  );
}