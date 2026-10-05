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
  const thirtyDaysAgo = new Date(start);
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 29);
  const [
    activeVolunteers,
    publishedActivities,
    credits,
    presentToday,
    volunteerStatuses,
    volunteerCategories,
    attendanceDays,
    creditUsers,
    creditUserNames,
    activityStatuses,
  ] = await Promise.all([
      prisma.user.count({
        where: { role: "VOLUNTEER", statut: "ACTIF", deletedAt: null },
      }),
      prisma.activite.count({ where: { statut: "PUBLIE" } }),
      prisma.credit.aggregate({ _sum: { montant: true } }),
      prisma.attendance.count({
        where: { date: { gte: start, lt: end }, statut: "PRESENT" },
      }),
      prisma.user.groupBy({
        by: ["statut"],
        where: { role: "VOLUNTEER", deletedAt: null },
        _count: { _all: true },
      }),
      prisma.user.groupBy({
        by: ["categorie"],
        where: { role: "VOLUNTEER", statut: "ACTIF", deletedAt: null },
        _count: { _all: true },
      }),
      prisma.attendance.groupBy({
        by: ["date"],
        where: { date: { gte: thirtyDaysAgo, lt: end }, statut: "PRESENT" },
        _count: { _all: true },
        orderBy: { date: "asc" },
      }),
      prisma.credit.groupBy({ by: ["user_id"], _sum: { montant: true } }),
      prisma.credit.findMany({
        distinct: ["user_id"],
        select: { user_id: true, user: { select: { nom: true, prenom: true } } },
      }),
      prisma.activite.groupBy({ by: ["statut"], _count: { _all: true } }),
    ]);

  return {
    activeVolunteers,
    publishedActivities,
    totalCredits: credits._sum.montant ?? 0,
    presentToday,
    volunteerStatuses: volunteerStatuses.map((row) => ({
      label: row.statut === "ACTIF" ? "Actifs" : "Inactifs",
      value: row._count._all,
    })),
    volunteerCategories: volunteerCategories.map((row) => ({
      label: row.categorie,
      value: row._count._all,
    })),
    attendanceDays: attendanceDays.map((row) => ({
      date: row.date.toISOString().slice(0, 10),
      value: row._count._all,
    })),
    creditUsers: creditUsers.map((row) => ({
      userId: row.user_id,
      total: row._sum.montant ?? 0,
      name: creditUserNames.find((user) => user.user_id === row.user_id)
        ? `${creditUserNames.find((user) => user.user_id === row.user_id)?.user.prenom ?? ""} ${creditUserNames.find((user) => user.user_id === row.user_id)?.user.nom ?? ""}`.trim()
        : "Bénévole",
    })).sort((a, b) => b.total - a.total),
    activityStatuses: activityStatuses.map((row) => ({
      label: row.statut === "PUBLIE" ? "Publiées" : "Brouillons",
      value: row._count._all,
    })),
  };
}
