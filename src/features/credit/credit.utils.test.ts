import { describe, expect, it } from "vitest";

import { calculateCreditTotals, creditPeriod } from "./credit.utils";

describe("credit reporting", () => {
  it("uses UTC half-open boundaries for a calendar month", () => {
    const range = creditPeriod(2026, 10);

    expect(range.from.toISOString()).toBe("2026-10-01T00:00:00.000Z");
    expect(range.to.toISOString()).toBe("2026-11-01T00:00:00.000Z");
  });

  it("uses UTC half-open boundaries for a full year", () => {
    const range = creditPeriod(2026);

    expect(range.from.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(range.to.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });

  it("handles leap year boundaries correctly", () => {
    const leapFeb = creditPeriod(2024, 2);
    expect(leapFeb.from.toISOString()).toBe("2024-02-01T00:00:00.000Z");
    expect(leapFeb.to.toISOString()).toBe("2024-03-01T00:00:00.000Z");

    const yearEnd = creditPeriod(2025, 12);
    expect(yearEnd.from.toISOString()).toBe("2025-12-01T00:00:00.000Z");
    expect(yearEnd.to.toISOString()).toBe("2026-01-01T00:00:00.000Z");
  });

  it("returns zero and empty array for empty credits", () => {
    const totals = calculateCreditTotals([]);
    expect(totals).toEqual({
      parBenevole: [],
      totalGlobal: 0,
    });
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

  it("sorts by total descending and breaks ties with userId ascending", () => {
    const entries = [
      { user_id: 3, montant: 50.0, user: { nom: "Charlie", prenom: "C" } },
      { user_id: 1, montant: 50.0, user: { nom: "Alice", prenom: "A" } },
      { user_id: 2, montant: 100.0, user: { nom: "Bob", prenom: "B" } },
    ];

    const totals = calculateCreditTotals(entries);
    expect(totals.parBenevole).toEqual([
      { userId: 2, benevole: "B Bob", total: 100 },
      { userId: 1, benevole: "A Alice", total: 50 },
      { userId: 3, benevole: "C Charlie", total: 50 },
    ]);
    expect(totals.totalGlobal).toBe(200);
  });
});
