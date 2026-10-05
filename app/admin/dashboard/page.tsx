import { AlertCircle, CalendarCheck, CalendarDays, Users } from "lucide-react";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DashboardAreaChart } from "@/features/admin/dashboard-area-chart";
import { getAdminDashboardMetrics } from "@/features/admin/metrics";
import { RecentUsersTable } from "@/features/admin/recent-users-table";
import { StatCard } from "@/features/admin/stat-card";
import { TableCard } from "@/features/admin/table-card";


export default async function AdminPage() {
  const metrics = await getAdminDashboardMetrics();
  const stats = [
    { label: "Bénévoles actifs", value: metrics.activeVolunteers, icon: Users },
    {
      label: "Activités publiées",
      value: metrics.publishedActivities,
      icon: CalendarDays,
    },
    {
      label: "Présents aujourd’hui",
      value: metrics.presentToday,
      icon: CalendarCheck,
    },
    {
      label: "Témoignages à modérer",
      value: metrics.pendingTestimonials,
      icon: AlertCircle,
    },
  ];
  const distribution = [
    {
      label: "Bénévoles actifs",
      value: metrics.activeVolunteers,
      color: "bg-primary",
    },
    {
      label: "Administrateurs",
      value: metrics.adminCount,
      color: "bg-muted-foreground/40",
    },
    {
      label: "Comptes USER",
      value: metrics.pendingUsers,
      color: "bg-destructive",
    },
  ];
  const distributionTotal = distribution.reduce(
    (sum, row) => sum + row.value,
    0
  );

  return (
    <div className="fluid-bg grid gap-6 rounded-2xl">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Tableau de bord" },
        ]}
      />
      <section>
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">
          Aperçu des activités bénévoles du moment.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={String(stat.value)}
            icon={stat.icon}
          />
        ))}
      </section>

      <DashboardAreaChart data={metrics.chartData} />

      <div className="grid gap-6 lg:grid-cols-3">
        <TableCard
          title="Derniers utilisateurs"
          className="glass-sm lg:col-span-2"
        >
          <RecentUsersTable users={metrics.recentUsers} />
        </TableCard>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Répartition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {distribution.map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
                <Progress
                  value={
                    distributionTotal === 0
                      ? 0
                      : (row.value / distributionTotal) * 100
                  }
                  aria-label={`${row.label}: ${row.value}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
