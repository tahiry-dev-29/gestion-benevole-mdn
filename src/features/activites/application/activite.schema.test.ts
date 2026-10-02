import { describe, expect, it } from "vitest";

import { createActiviteSchema, updateActiviteSchema } from "./activite.schema";

const base = {
  titre: "Atelier communautaire",
  description: "Description de l'activité.",
  date: "2026-10-02",
};

describe("activite schemas (front/back partagés)", () => {
  it("accepts local upload paths and date-only strings", () => {
    expect(
      createActiviteSchema.safeParse({
        ...base,
        image: "/uploads/123e4567-e89b-12d3-a456-426614174000.webp",
      }).success
    ).toBe(true);
  });

  it("rejects arbitrary http image urls", () => {
    expect(
      createActiviteSchema.safeParse({
        ...base,
        image: "http://example.com/photo.jpg",
      }).success
    ).toBe(false);
  });

  it("rejects empty titles", () => {
    expect(
      createActiviteSchema.safeParse({ ...base, titre: "   " }).success
    ).toBe(false);
  });

  it("allows statut-only updates for publish toggles", () => {
    expect(updateActiviteSchema.safeParse({ statut: "PUBLIE" }).success).toBe(
      true
    );
  });
});
