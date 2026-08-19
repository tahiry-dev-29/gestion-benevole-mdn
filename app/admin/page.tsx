import {
  AlertCircle,
  Calendar,
  ClipboardCheck,
  Users,
} from "lucide-react";

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
import { dashboardStats, users } from "@/features/admin/admin.data";
import { StatCard } from "@/features/admin/stat-card";
import { TableCard } from "@/features/admin/table-card";

const statIcons = [Users, Calendar, ClipboardCheck, AlertCircle];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
        <p className="text-sm text-muted-foreground">
          Aperçu des activités bénévoles du moment.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend === "up" ? "up" : "down"}
            icon={statIcons[i]}
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
              {users.slice(0, 5).map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">
                    {u.prenom} {u.nom}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === "ADMIN" ? "default" : "secondary"}
                    >
                      {u.role === "ADMIN" ? "Admin" : "Bénévole"}
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
            {[
              { label: "Bénévoles", value: 38, color: "bg-primary" },
              { label: "Administrateurs", value: 4, color: "bg-muted-foreground/40" },
              { label: "En attente", value: 5, color: "bg-destructive" },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium">{row.value}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${row.color}`}
                    style={{
                      width: `${(row.value / 47) * 100}%`,
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
