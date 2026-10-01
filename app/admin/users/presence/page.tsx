import { PageHeader } from "@/features/admin/page-header";
import { listSeatsAction } from "@/features/places/places.action";
import { AttendanceManager } from "@/features/presence/presentation/attendance-manager";
import { prisma } from "@/lib/prisma";

// Données live issues de PostgreSQL (bénévoles du jour, sièges occupés) :
// la page ne doit jamais être prérendue à la construction, sinon le build
// échoue si la base n'est pas migrée ou n'est pas joignable.
export const dynamic = "force-dynamic";

export default async function UserPresencePage() {
  const [volunteers, attendance, seats] = await Promise.all([
    prisma.user.findMany({
      where: { role: "VOLUNTEER", statut: "ACTIF", deletedAt: null },
      select: { id: true, nom: true, prenom: true },
      orderBy: [{ nom: "asc" }, { prenom: "asc" }],
    }),
    prisma.attendance.findMany({
      where: { date: new Date(new Date().toISOString().slice(0, 10)) },
      select: { seat_id: true },
    }),
    listSeatsAction(),
  ]);
  const occupiedSeatIds = new Set(
    attendance.flatMap((item) => (item.seat_id === null ? [] : [item.seat_id]))
  );
  const availableTables = seats.success
    ? seats.data.map((table) => ({
        ...table,
        seats: table.seats.map((seat) => ({
          ...seat,
          occupiedToday: occupiedSeatIds.has(seat.id),
        })),
      }))
    : [];
  return (
    <div className="space-y-6">
      <PageHeader
        title="Présences"
        description="Pointage quotidien avec choix de table et de siège."
      />
      {seats.success ? (
        <AttendanceManager volunteers={volunteers} tables={availableTables} />
      ) : (
        <p className="text-sm text-destructive">{seats.error}</p>
      )}
    </div>
  );
}
