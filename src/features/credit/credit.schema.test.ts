import { describe, expect, it } from "vitest";

import { creditPeriodFilterSchema, listCreditsSchema } from "./credit.schema";

describe("credit period filters", () => {
  it("rejects month-only filters because the year is ambiguous", () => {
    expect(creditPeriodFilterSchema.safeParse({ mois: 10 }).success).toBe(
      false
    );
    expect(listCreditsSchema.safeParse({ mois: 10 }).success).toBe(false);
  });

  it("accepts a month with its year and full-year filters", () => {
    expect(
      creditPeriodFilterSchema.safeParse({ mois: 10, annee: 2026 }).success
    ).toBe(true);
    expect(creditPeriodFilterSchema.safeParse({ annee: 2026 }).success).toBe(
      true
    );
  });
});
