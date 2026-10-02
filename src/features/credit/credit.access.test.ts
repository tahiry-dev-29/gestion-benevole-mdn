import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getServerSession: vi.fn(),
  creditFindMany: vi.fn(),
  creditCount: vi.fn(),
  creditCreate: vi.fn(),
}));

vi.mock("next-auth", () => ({ getServerSession: mocks.getServerSession }));
vi.mock("@/lib/auth-options", () => ({ authOptions: {} }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    credit: {
      findMany: mocks.creditFindMany,
      count: mocks.creditCount,
      create: mocks.creditCreate,
    },
  },
}));

import { createCreditAction, listCreditsAction } from "./credit.action";
import { getCumulCreditsAction } from "./credit-cumul.action";

describe("credit actions require administrator access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getServerSession.mockResolvedValue({
      user: { id: "3", role: "VOLUNTEER" },
    });
  });

  it("blocks a volunteer from listing or aggregating credits", async () => {
    await expect(listCreditsAction()).resolves.toMatchObject({
      success: false,
      error: "Accès interdit (403).",
    });
    await expect(getCumulCreditsAction()).resolves.toMatchObject({
      success: false,
      error: "Accès interdit (403).",
    });
    expect(mocks.creditFindMany).not.toHaveBeenCalled();
  });

  it("blocks a volunteer from creating credits before writing", async () => {
    const result = await createCreditAction({
      userId: 5,
      montant: 12.5,
      date: new Date("2026-10-01T00:00:00.000Z"),
      motif: "Transport",
    });

    expect(result).toMatchObject({ success: false });
    expect(mocks.creditCreate).not.toHaveBeenCalled();
  });
});
