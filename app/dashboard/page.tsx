"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Activity, Calendar, Users, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </main>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const user = session.user;

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 p-4 md:p-6 bg-muted/30">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Mon Espace Bénévole</h1>
        <p className="text-muted-foreground">
          Bonjour {user.nom} {user.prenom} !
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures cumulées</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">120h</div>
            <p className="text-xs text-muted-foreground">+20h ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Présences</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
            <p className="text-xs text-muted-foreground">Cette année</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crédits</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Points accumulés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rôle</CardTitle>
            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
              {user.role === "ADMIN" ? "Admin" : "Bénévole"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {user.nom} {user.prenom}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Sauvegarde de données</CardTitle>
            <CardDescription>Exportez vos données de présence</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Exporter mes données
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Réglages</CardTitle>
            <CardDescription>Gérez votre profil et vos préférences</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => router.push("/admin/profil")}>
              Accéder aux paramètres
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}