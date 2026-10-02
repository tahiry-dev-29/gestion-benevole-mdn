import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  userCount: vi.fn(),
  userFindMany: vi.fn(),
  activityCount: vi.fn(),
  attendanceCount: vi.fn(),
  testimonialCount: vi.fn(),
  creditAggregate: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { count: mocks.userCount, findMany: mocks.userFindMany },
    activite: { count: mocks.activityCount },
    attendance: { count: mocks.attendanceCount },
    temoignage: { count: mocks.testimonialCount },
    credit: { aggregate: mocks.creditAggregate },
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

    expect(statistics).toEqual({
      activeVolunteers: 3,
      publishedActivities: 2,
      totalCredits: 125.5,
      presentToday: 1,
    });
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
