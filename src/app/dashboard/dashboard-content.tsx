import React from "react";
import { Award, Clock, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from "@/features/user/user-list";

import { LocalChart } from "./_components/local-chart";

export function DashboardContent() {
  const sampleUsers = [
    {
      id: 1,
      nom: "Rasoarimanana",
      prenom: "Fitia",
      email: "fitia@example.com",
      role: "ADMIN",
    },
    {
      id: 2,
      nom: "Randria",
      prenom: "Flavien",
      email: "flavien@example.com",
      role: "BENEVOLE",
    },
    {
      id: 3,
      nom: "Rakotoarison",
      prenom: "Hunjan",
      email: "hunjan@example.com",
      role: "BENEVOLE",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Total Bénévoles
            </CardTitle>
            <Users className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-slate-500 mt-1">+3 ce mois-ci</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Présences Aujourd&apos;hui
            </CardTitle>
            <Clock className="w-4 h-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12 / 15</div>
            <p className="text-xs text-slate-500 mt-1">80% de présence</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">
              Crédits Cumulés
            </CardTitle>
            <Award className="w-4 h-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">142 hrs</div>
            <p className="text-xs text-slate-500 mt-1">Valorisation bénévole</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and User List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LocalChart />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">
            Bénévoles Récents
          </h2>
          <UserList users={sampleUsers} />
        </div>
      </div>
    </div>
  );
}
