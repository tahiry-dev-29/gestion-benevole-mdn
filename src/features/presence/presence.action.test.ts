import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, prisma, revalidatePath } = vi.hoisted(() => ({
  auth: vi.fn(),
  prisma: {
    user: { findFirst: vi.fn() },
    seat: { findUnique: vi.fn() },
    attendance: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      upsert: vi.fn(),
      count: vi.fn(),
      delete: vi.fn(),
    },
  },
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth }));
vi.mock("@/lib/prisma", () => ({ prisma }));
vi.mock("next/cache", () => ({ revalidatePath }));

import { deleteSeatAction } from "@/features/places/places.action";
import {
  listAttendanceAction,
  pointAction,
} from "@/features/presence/presence.action";

describe("attendance and seat actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.mockResolvedValue({ user: { role: "ADMIN" } });
    prisma.user.findFirst.mockResolvedValue({ id: 3 });
  });

  it("upserts a user's attendance for the date instead of creating a duplicate", async () => {
    prisma.seat.findUnique.mockResolvedValue({ id: 8 });
    prisma.attendance.findFirst.mockResolvedValue(null);
    prisma.attendance.upsert.mockResolvedValue({
      id: 15,
      user_id: 3,
      seat_id: 8,
    });

    const result = await pointAction({
      userId: 3,
      date: "2026-10-01",
      seatId: 8,
      statut: "PRESENT",
      arrivee: "09:00",
      depart: "17:00",
    });

    expect(result.success).toBe(true);
    expect(prisma.attendance.upsert).toHaveBeenCalledOnce();
    expect(prisma.attendance.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          user_id_date: {
            user_id: 3,
            date: new Date("2026-10-01T00:00:00.000Z"),
          },
        },
      })
    );
  });

  it("refuses a seat occupied by another user on the same date", async () => {
    prisma.seat.findUnique.mockResolvedValue({ id: 8 });
    prisma.attendance.findFirst.mockResolvedValue({ id: 12, user_id: 4 });

    const result = await pointAction({
      userId: 3,
      date: "2026-10-01",
      seatId: 8,
    });

    expect(result).toEqual({
      success: false,
      error: "Ce siège est déjà occupé à cette date.",
    });
    expect(prisma.attendance.upsert).not.toHaveBeenCalled();
  });

  it("refuses to delete a seat already referenced by attendance", async () => {
    prisma.attendance.count.mockResolvedValue(1);

    const result = await deleteSeatAction({ seatId: 8 });

    expect(result).toEqual({
      success: false,
      error: "Ce siège est associé à un pointage et ne peut pas être supprimé.",
    });
    expect(prisma.attendance.delete).not.toHaveBeenCalled();
  });

  it("refuses pointage for an unknown user without writing", async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    const result = await pointAction({
      userId: 9999,
      date: "2026-10-01",
      statut: "PRESENT",
    });

    expect(result).toEqual({
      success: false,
      error: "Ce bénévole n'existe pas.",
    });
    expect(prisma.attendance.upsert).not.toHaveBeenCalled();
  });

  it("refuses pointage without an admin session", async () => {
    auth.mockResolvedValue(null);

    const result = await pointAction({
      userId: 3,
      date: "2026-10-01",
      statut: "PRESENT",
    });

    expect(result).toEqual({ success: false, error: "Accès refusé." });
    expect(prisma.attendance.upsert).not.toHaveBeenCalled();
  });

  it("refuses pointage with an invalid date without writing", async () => {
    const result = await pointAction({
      userId: 3,
      date: "not-a-date",
      statut: "PRESENT",
    });

    expect(result).toEqual({
      success: false,
      error: "Données de pointage invalides.",
    });
    expect(prisma.attendance.upsert).not.toHaveBeenCalled();
  });

  it("applies date, status, seat, and volunteer search filters on the server", async () => {
    prisma.attendance.findMany.mockResolvedValue([]);

    const result = await listAttendanceAction({
      du: "2026-10-01",
      au: "2026-10-07",
      statut: "RETARD",
      seatId: 8,
      query: "Marie",
    });

    expect(result).toEqual({ success: true, data: [] });
    expect(prisma.attendance.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          date: {
            gte: new Date("2026-10-01T00:00:00.000Z"),
            lte: new Date("2026-10-07T00:00:00.000Z"),
          },
          statut: "RETARD",
          seat_id: 8,
          user: {
            OR: [
              { nom: { contains: "Marie", mode: "insensitive" } },
              { prenom: { contains: "Marie", mode: "insensitive" } },
              { email: { contains: "Marie", mode: "insensitive" } },
              { matricule: { contains: "Marie", mode: "insensitive" } },
            ],
          },
        }),
      })
    );
  });
});
