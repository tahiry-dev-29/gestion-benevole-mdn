import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Calendar, ClipboardCheck, AlertCircle } from "lucide-react";
import Link from "next/link";

const recentVolunteers = [
  {
    id: 1,
    name: "Marie Dupont",
    role: "Organisation",
    status: "active",
    joined: "2026-06-15",
  },
  {
    id: 2,
    name: "Jean Martin",
    role: "Logistique",
    status: "active",
    joined: "2026-06-10",
  },
  {
    id: 3,
    name: "Sophie Bernard",
    role: "Communication",
    status: "inactive",
    joined: "2026-05-28",
  },
  {
    id: 4,
    name: "Pierre Lefevre",
    role: "Soutien",
    status: "active",
    joined: "2026-05-20",
  },
  {
    id: 5,
    name: "Claire Morel",
    role: "Bénévole",
    status: "pending",
    joined: "2026-05-18",
  },
];

const stats = [
  {
    label: "Bénévoles actifs",
    value: "42",
    icon: Users,
    change: "+12%",
    variant: "default" as const,
  },
  {
    label: "Événements ce mois",
    value: "8",
    icon: Calendar,
    change: "+3",
    variant: "default" as const,
  },
  {
    label: "Tâches complétées",
    value: "156",
    icon: ClipboardCheck,
    change: "+24%",
    variant: "default" as const,
  },
  {
    label: "En attente",
    value: "5",
    icon: AlertCircle,
    change: "-2",
    variant: "destructive" as const,
  },
];

export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1 className="text-xl font-bold tracking-tight">Gestion Benevole</h1>
          <nav className="flex items-center gap-4">
            <Button variant="outline" size="sm" render={<Link href="/admin" />}>
              Tableau de bord
            </Button>
            <Button size="sm" render={<Link href="/admin/volunteers" />}>
              Gestion
            </Button>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-6">
        <section>
          <h2 className="text-2xl font-bold tracking-tight">Tableau de bord</h2>
          <p className="text-muted-foreground text-sm">
            Aperçu des activités bénévoles du moment.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.change} vs mois dernier
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Derniers bénévoles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Inscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentVolunteers.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">
                      {volunteer.name}
                    </TableCell>
                    <TableCell>{volunteer.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          volunteer.status === "active"
                            ? "default"
                            : volunteer.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {volunteer.status === "active" && "Actif"}
                        {volunteer.status === "pending" && "En attente"}
                        {volunteer.status === "inactive" && "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {volunteer.joined}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
