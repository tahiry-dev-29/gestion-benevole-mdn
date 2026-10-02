import { describe, expect, it } from "vitest";

import { listObservationsSchema } from "./observation.schema";

describe("observation period filters", () => {
  it("requires a year when a month is selected", () => {
    expect(listObservationsSchema.safeParse({ mois: 10 }).success).toBe(false);
    expect(
      listObservationsSchema.safeParse({ mois: 10, annee: 2026 }).success
    ).toBe(true);
  });

  it("allows a year-only filter and an unfiltered list", () => {
    expect(listObservationsSchema.safeParse({ annee: 2026 }).success).toBe(
      true
    );
    expect(listObservationsSchema.safeParse({}).success).toBe(true);
  });
});
