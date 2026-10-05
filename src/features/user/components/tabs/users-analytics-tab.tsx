import {
  BadgeCheck,
  CircleUserRound,
  UserRoundX,
  UsersRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import type { UserItem } from "../types";

export function UsersAnalyticsTab({ users }: { users: UserItem[] }) {
  const total = users.length;
  const active = users.filter((user) => user.statut === "ACTIF").length;
  const inactive = users.filter((user) => user.statut === "INACTIF").length;
  const approved = users.filter(
    (user) => user.certificatStatut === "APPROUVE"
  ).length;
  const pending = users.filter(
    (user) => user.certificatStatut === "EN_ATTENTE"
  ).length;
  const percentage = (count: number) => (total ? (count / total) * 100 : 0);

  const metrics = [
    { label: "Comptes USER", value: total, icon: UsersRound },
    { label: "Actifs", value: active, icon: CircleUserRound },
    { label: "Certificats approuvés", value: approved, icon: BadgeCheck },
    { label: "Inactifs", value: inactive, icon: UserRoundX },
  ];

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="glass-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
              <Icon aria-hidden="true" className="size-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>État des dossiers</CardTitle>
          <CardDescription>
            Répartition des comptes USER selon leur statut et leur certificat.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <div className="flex justify-between gap-3 text-sm">
              <span>Comptes actifs</span>
              <span className="text-muted-foreground">
                {active} / {total}
              </span>
            </div>
            <Progress value={percentage(active)} aria-label="Comptes actifs" />
            <div className="flex justify-between gap-3 text-sm">
              <span>Certificats approuvés</span>
              <span className="text-muted-foreground">
                {approved} / {total}
              </span>
            </div>
            <Progress
              value={percentage(approved)}
              aria-label="Certificats approuvés"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex justify-between gap-3 text-sm">
              <span>À vérifier</span>
              <span className="text-muted-foreground">
                {pending} / {total}
              </span>
            </div>
            <Progress
              value={percentage(pending)}
              aria-label="Certificats à vérifier"
            />
            <div className="flex justify-between gap-3 text-sm">
              <span>Comptes inactifs</span>
              <span className="text-muted-foreground">
                {inactive} / {total}
              </span>
            </div>
            <Progress
              value={percentage(inactive)}
              aria-label="Comptes inactifs"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
