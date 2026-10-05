"use client";

import { Shield, UserCheck, Users, UserX } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { useRoleCounts, useVolunteers } from "../use-volunteers";

export function VolunteerStatsCards() {
  const { data: counts } = useRoleCounts();
  const { data: activeList } = useVolunteers({ statut: "ACTIF", pageSize: 1 });
  const { data: inactiveList } = useVolunteers({
    statut: "INACTIF",
    pageSize: 1,
  });

  const total = counts
    ? (counts.SUPER_ADMIN ?? 0) + (counts.ADMIN ?? 0) + (counts.VOLUNTEER ?? 0)
    : 0;
  const activeCount = activeList?.total ?? 0;
  const inactiveCount = inactiveList?.total ?? 0;
  const adminCount = counts
    ? (counts.SUPER_ADMIN ?? 0) + (counts.ADMIN ?? 0)
    : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="glass-sm relative overflow-hidden transition-shadow hover:shadow-md">
        <div className="absolute top-0 left-0 h-1 w-full bg-primary" />
        <CardContent className="flex items-center justify-between p-4">
          <div className="grid gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Total comptes
            </p>
            <p className="text-2xl font-bold tracking-tight">{total}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-sm relative overflow-hidden transition-shadow hover:shadow-md">
        <div className="absolute top-0 left-0 h-1 w-full bg-primary" />
        <CardContent className="flex items-center justify-between p-4">
          <div className="grid gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Comptes actifs
            </p>
            <p className="text-2xl font-bold tracking-tight text-primary">
              {activeCount}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCheck className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-sm relative overflow-hidden transition-shadow hover:shadow-md">
        <div className="absolute top-0 left-0 h-1 w-full bg-muted-foreground" />
        <CardContent className="flex items-center justify-between p-4">
          <div className="grid gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Comptes inactifs
            </p>
            <p className="text-2xl font-bold tracking-tight text-muted-foreground">
              {inactiveCount}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <UserX className="size-5" />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-sm relative overflow-hidden transition-shadow hover:shadow-md">
        <div className="absolute top-0 left-0 h-1 w-full bg-accent" />
        <CardContent className="flex items-center justify-between p-4">
          <div className="grid gap-1">
            <p className="text-xs font-medium text-muted-foreground">
              Administrateurs
            </p>
            <p className="text-2xl font-bold tracking-tight text-accent-foreground">
              {adminCount}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Shield className="size-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
