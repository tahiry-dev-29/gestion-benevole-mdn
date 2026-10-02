import "server-only";

import { prisma } from "@/lib/prisma";

function localDayRange(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Indian/Antananarivo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "00";
  const start = new Date(
    `${part("year")}-${part("month")}-${part("day")}T00:00:00.000Z`
  );
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
}

export async function getAdminDashboardMetrics() {
  const { start } = localDayRange();
  const [
    activeVolunteers,
    publishedActivities,
    presentToday,
    pendingTestimonials,
    adminCount,
    pendingUsers,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count({
      where: { role: "VOLUNTEER", statut: "ACTIF", deletedAt: null },
    }),
    prisma.activite.count({ where: { statut: "PUBLIE" } }),
    prisma.attendance.count({
      where: { date: start, statut: "PRESENT" },
    }),
    prisma.temoignage.count({ where: { statut: "EN_ATTENTE" } }),
    prisma.user.count({
      where: {
        role: { in: ["ADMIN", "SUPER_ADMIN"] },
        statut: "ACTIF",
        deletedAt: null,
      },
    }),
    prisma.user.count({ where: { role: "USER", deletedAt: null } }),
    prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, nom: true, prenom: true, email: true, role: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    activeVolunteers,
    publishedActivities,
    presentToday,
    pendingTestimonials,
    adminCount,
    pendingUsers,
    recentUsers,
  };
}

export async function getAdminStatistics() {
  const { start, end } = localDayRange();
  const [activeVolunteers, publishedActivities, credits, presentToday] =
    await Promise.all([
      prisma.user.count({
        where: { role: "VOLUNTEER", statut: "ACTIF", deletedAt: null },
      }),
      prisma.activite.count({ where: { statut: "PUBLIE" } }),
      prisma.credit.aggregate({ _sum: { montant: true } }),
      prisma.attendance.count({
        where: { date: { gte: start, lt: end }, statut: "PRESENT" },
      }),
    ]);

  return {
    activeVolunteers,
    publishedActivities,
    totalCredits: credits._sum.montant ?? 0,
    presentToday,
  };
}
