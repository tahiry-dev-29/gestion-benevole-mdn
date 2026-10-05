import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  userCount: vi.fn(),
  userFindMany: vi.fn(),
  userGroupBy: vi.fn(),
  activityCount: vi.fn(),
  activityGroupBy: vi.fn(),
  attendanceCount: vi.fn(),
  attendanceGroupBy: vi.fn(),
  testimonialCount: vi.fn(),
  creditAggregate: vi.fn(),
  creditGroupBy: vi.fn(),
  creditFindMany: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      count: mocks.userCount,
      findMany: mocks.userFindMany,
      groupBy: mocks.userGroupBy,
    },
    activite: { count: mocks.activityCount, groupBy: mocks.activityGroupBy },
    attendance: {
      count: mocks.attendanceCount,
      groupBy: mocks.attendanceGroupBy,
    },
    temoignage: { count: mocks.testimonialCount },
    credit: {
      aggregate: mocks.creditAggregate,
      groupBy: mocks.creditGroupBy,
      findMany: mocks.creditFindMany,
    },
  },
}));

import { getAdminDashboardMetrics, getAdminStatistics } from "./metrics";

describe("admin dashboard metrics", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-01T22:30:00.000Z"));
    mocks.userCount.mockResolvedValue(3);
    mocks.userFindMany.mockResolvedValue([]);
    mocks.activityCount.mockResolvedValue(2);
    mocks.attendanceCount.mockResolvedValue(1);
    mocks.testimonialCount.mockResolvedValue(4);
    mocks.creditAggregate.mockResolvedValue({ _sum: { montant: 125.5 } });
    // user.groupBy sert trois regroupements distincts : categorie, statut
    // (statistiques) et createdAt (serie d'inscriptions du tableau de bord).
    mocks.userGroupBy.mockImplementation(({ by }: { by: string[] }) => {
      switch (by[0]) {
        case "categorie":
          return [{ categorie: "PRIMAIRE", _count: { _all: 3 } }];
        case "createdAt":
          return [
            {
              createdAt: new Date("2026-10-02T00:00:00.000Z"),
              _count: { _all: 2 },
            },
          ];
        default:
          return [{ statut: "ACTIF", _count: { _all: 3 } }];
      }
    });
    mocks.attendanceGroupBy.mockResolvedValue([
      { date: new Date("2026-10-02T00:00:00.000Z"), _count: { _all: 1 } },
    ]);
    mocks.creditGroupBy.mockResolvedValue([
      { user_id: "u1", _sum: { montant: 125.5 } },
    ]);
    mocks.creditFindMany.mockResolvedValue([
      { user_id: "u1", user: { nom: "Doe", prenom: "Jane" } },
    ]);
    mocks.activityGroupBy.mockResolvedValue([
      { statut: "PUBLIE", _count: { _all: 2 } },
    ]);
  });

  afterEach(() => vi.useRealTimers());

  it("uses Malagasy local date for today's attendance", async () => {
    const dashboard = await getAdminDashboardMetrics();

    expect(dashboard).toMatchObject({
      activeVolunteers: 3,
      publishedActivities: 2,
      presentToday: 1,
      pendingTestimonials: 4,
    });
    expect(mocks.attendanceCount).toHaveBeenCalledWith({
      where: {
        date: new Date("2026-10-02T00:00:00.000Z"),
        statut: "PRESENT",
      },
    });
  });

  it("sums credits and queries today's presence over a half-open date range", async () => {
    const statistics = await getAdminStatistics();

    // toMatchObject : metrics.ts evolue (volunteersThisMonth ajoute par la
    // tache 24) ; on valide les agregats sans figer la forme exacte.
    expect(statistics).toMatchObject({
      activeVolunteers: 3,
      publishedActivities: 2,
      totalCredits: 125.5,
      presentToday: 1,
      volunteerStatuses: [{ label: "Actifs", value: 3 }],
      volunteerCategories: [{ label: "PRIMAIRE", value: 3 }],
      attendanceDays: expect.arrayContaining([
        { date: "2026-10-02", value: 1 },
      ]),
      creditUsers: [{ userId: "u1", total: 125.5, name: "Jane Doe" }],
      activityStatuses: [{ label: "Publiées", value: 2 }],
      trends: { volunteers: 0, presences: 0 },
    });
    // La serie de presence couvre 30 jours, du jour local J-29 a J.
    expect(statistics.attendanceDays).toHaveLength(30);
    expect(mocks.attendanceCount).toHaveBeenCalledWith({
      where: {
        date: {
          gte: new Date("2026-10-02T00:00:00.000Z"),
          lt: new Date("2026-10-03T00:00:00.000Z"),
        },
        statut: "PRESENT",
      },
    });
  });
});
