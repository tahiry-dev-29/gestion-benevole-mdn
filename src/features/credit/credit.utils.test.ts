import { describe, expect, it } from "vitest";

import { calculateCreditTotals, creditPeriod } from "./credit.utils";

describe("credit reporting", () => {
  it("uses UTC half-open boundaries for a calendar month", () => {
    const range = creditPeriod(2026, 10);

    expect(range.from.toISOString()).toBe("2026-10-01T00:00:00.000Z");
    expect(range.to.toISOString()).toBe("2026-11-01T00:00:00.000Z");
  });

  it("calculates stable cents and ordering regardless of input order", () => {
    const entries = [
      { user_id: 2, montant: 10.25, user: { nom: "B", prenom: "Bea" } },
      { user_id: 1, montant: 0.1, user: { nom: "A", prenom: "Ali" } },
      { user_id: 1, montant: 0.2, user: { nom: "A", prenom: "Ali" } },
    ];

    const totals = calculateCreditTotals(entries);
    const reversedTotals = calculateCreditTotals([...entries].reverse());

    expect(totals).toEqual(reversedTotals);
    expect(totals.parBenevole).toEqual([
      { userId: 2, benevole: "Bea B", total: 10.25 },
      { userId: 1, benevole: "Ali A", total: 0.3 },
    ]);
    expect(totals.totalGlobal).toBe(10.55);
  });
});
