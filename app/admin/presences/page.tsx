import {
  CalendarCheck,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
} from "lucide-react";

import { AdminBreadcrumb } from "@/components/shared/admin-breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/features/admin/page-header";
import { AttendanceManager } from "@/features/presence/presentation/attendance-manager";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PresencesPage() {
  const today = new Date(new Date().toISOString().slice(0, 10));
  const [volunteers, seats] = await Promise.all([
    prisma.user.findMany({
      where: { role: "VOLUNTEER", statut: "ACTIF", deletedAt: null },
      select: { id: true, nom: true, prenom: true },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    }),
    prisma.seat.findMany({
      include: {
        presences: { where: { date: today }, select: { id: true } },
      },
      orderBy: [{ tableNumber: "asc" }, { seatNumber: "asc" }],
    }),
  ]);

  const groupedSeats = new Map<number, typeof seats>();
  for (const seat of seats) {
    const tableSeats = groupedSeats.get(seat.tableNumber) ?? [];
    tableSeats.push(seat);
    groupedSeats.set(seat.tableNumber, tableSeats);
  }

  const tables = Array.from(groupedSeats, ([tableNumber, tableSeats]) => ({
    tableNumber,
    seats: tableSeats.map(({ id, seatNumber, label, presences }) => ({
      id,
      seatNumber,
      label,
      occupiedToday: presences.length > 0,
    })),
  }));

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-5">
      <AdminBreadcrumb
        items={[
          { label: "Administration", href: "/admin/dashboard" },
          { label: "Présences" },
        ]}
      />
      <PageHeader
        title="Présences"
        description="Pointage quotidien avec arrivée, départ, table et siège."
      />
      <Tabs defaultValue="pointage" className="grid gap-5">
        <TabsList className="glass-sm grid h-auto w-full grid-cols-2 justify-start gap-1 p-1 sm:flex sm:w-fit">
          <TabsTrigger
            value="pointage"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <CalendarCheck aria-hidden="true" /> Pointage
          </TabsTrigger>
          <TabsTrigger
            value="historique"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <ClipboardList aria-hidden="true" /> Historique
          </TabsTrigger>
          <TabsTrigger
            value="statistiques"
            className="min-h-10 flex-none gap-2 px-3"
          >
            <ChartNoAxesColumnIncreasing aria-hidden="true" /> Statistiques
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pointage">
          <AttendanceManager
            volunteers={volunteers}
            tables={tables}
            view="pointage"
          />
        </TabsContent>
        <TabsContent value="historique">
          <AttendanceManager
            volunteers={volunteers}
            tables={tables}
            view="historique"
          />
        </TabsContent>
        <TabsContent value="statistiques">
          <AttendanceManager
            volunteers={volunteers}
            tables={tables}
            view="statistiques"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
