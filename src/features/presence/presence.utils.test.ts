import { describe, expect, it } from "vitest";

import { computeRange, shiftDate, toIsoDate } from "./presence.utils";

describe("filtre calendrier des présences", () => {
  it("limite la période à la date choisie en mode jour", () => {
    expect(computeRange("day", "2026-10-01")).toEqual({
      du: "2026-10-01",
      au: "2026-10-01",
    });
  });

  it("couvre le mois entier en mode mois", () => {
    expect(computeRange("month", "2026-10-15")).toEqual({
      du: "2026-10-01",
      au: "2026-10-31",
    });
  });

  it("couvre du lundi au dimanche en mode semaine", () => {
    // 2026-10-01 est un jeudi : la semaine court du 2026-09-28 au 2026-10-04.
    expect(computeRange("week", "2026-10-01")).toEqual({
      du: "2026-09-28",
      au: "2026-10-04",
    });
  });

  it("décalle la date du pas correspondant au mode", () => {
    expect(shiftDate("day", "2026-10-01", 1)).toBe("2026-10-02");
    expect(shiftDate("week", "2026-10-01", -1)).toBe("2026-09-24");
    expect(shiftDate("month", "2026-10-01", 1)).toBe("2026-10-31");
  });

  it("formate une date en ISO local sans dérive de fuseau", () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});
