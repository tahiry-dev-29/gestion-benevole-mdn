"use client";

import { useSearchParams } from "next/navigation";
import { ShieldCheck, UsersRound } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RolesManagement } from "./roles-management";
import { VolunteersTable } from "./volunteers-table";

export function VolunteerManagementTabs() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "roles" ? "roles" : "liste";

  return (
    <Tabs key={initialTab} defaultValue={initialTab} className="grid gap-5">
      <TabsList className="glass-sm flex h-auto w-full flex-wrap justify-start gap-1 p-1 sm:w-fit">
        <TabsTrigger value="liste" className="min-h-10 flex-none gap-2 px-3">
          <UsersRound aria-hidden="true" />
          Liste
        </TabsTrigger>
        <TabsTrigger value="roles" className="min-h-10 flex-none gap-2 px-3">
          <ShieldCheck aria-hidden="true" />
          Rôles & permissions
        </TabsTrigger>
      </TabsList>
      <TabsContent value="liste">
        <VolunteersTable />
      </TabsContent>
      <TabsContent value="roles">
        <RolesManagement embedded />
      </TabsContent>
    </Tabs>
  );
}
