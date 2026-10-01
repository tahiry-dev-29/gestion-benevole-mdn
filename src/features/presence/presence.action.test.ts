import { beforeEach, describe, expect, it, vi } from "vitest";

const { auth, prisma, revalidatePath } = vi.hoisted(() => ({
  auth: vi.fn(),
  prisma: {
    seat: { findUnique: vi.fn() },
    attendance: {
      findFirst: vi.fn(),
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
import { pointAction } from "@/features/presence/presence.action";

describe("attendance and seat actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.mockResolvedValue({ user: { role: "ADMIN" } });
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
});
