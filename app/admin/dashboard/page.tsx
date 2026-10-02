import { AlertCircle, CalendarCheck, CalendarDays, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminDashboardMetrics } from "@/features/admin/metrics";
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
    <div className="space-y-6">
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

      <div className="grid gap-6 lg:grid-cols-3">
        <TableCard title="Derniers utilisateurs" className="lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.recentUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    Aucun compte n’est encore enregistré.
                  </TableCell>
                </TableRow>
              ) : null}
              {metrics.recentUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.prenom} {u.nom}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.role === "ADMIN" || u.role === "SUPER_ADMIN"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {u.role === "SUPER_ADMIN"
                        ? "Super Admin"
                        : u.role === "ADMIN"
                          ? "Admin"
                          : u.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableCard>

        <Card>
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
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${row.color}`}
                    style={{
                      width: `${distributionTotal === 0 ? 0 : (row.value / distributionTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
