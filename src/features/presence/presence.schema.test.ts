import { describe, expect, it } from "vitest";

import { pointSchema, presenceFilterSchema } from "./presence.schema";

describe("presence validation", () => {
  it("rejects a date range whose end precedes its start", () => {
    expect(
      presenceFilterSchema.safeParse({ du: "2026-10-03", au: "2026-10-02" })
        .success
    ).toBe(false);
  });

  it("accepts searchable status and place filters", () => {
    expect(
      presenceFilterSchema.safeParse({
        du: "2026-10-01",
        au: "2026-10-07",
        statut: "RETARD",
        seatId: "8",
        query: " Marie ",
      })
    ).toMatchObject({
      success: true,
      data: {
        statut: "RETARD",
        seatId: 8,
        query: "Marie",
      },
    });
  });

  it("rejects an overlong search filter", () => {
    expect(
      presenceFilterSchema.safeParse({ query: "x".repeat(121) }).success
    ).toBe(false);
  });

  it("rejects an arrival time after departure", () => {
    expect(
      pointSchema.safeParse({
        userId: 4,
        date: "2026-10-02",
        statut: "PRESENT",
        arrivee: "18:00",
        depart: "09:00",
      }).success
    ).toBe(false);
  });

  it("accepts a same-day pointage with chronological times", () => {
    expect(
      pointSchema.safeParse({
        userId: 4,
        date: "2026-10-02",
        statut: "PRESENT",
        arrivee: "09:00",
        depart: "18:00",
      }).success
    ).toBe(true);
  });
});
