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
    <div className="space-y-6">
      <PageHeader
        title="Présences"
        description="Pointage quotidien avec arrivée, départ, table et siège."
      />
      <AttendanceManager volunteers={volunteers} tables={tables} />
    </div>
  );
}
