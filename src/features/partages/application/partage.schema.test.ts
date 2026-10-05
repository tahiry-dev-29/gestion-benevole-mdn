import { describe, expect, it } from "vitest";

import { createPartageSchema, updatePartageSchema } from "./partage.schema";

const base = {
  titre: "Retour d'expérience maraîchage",
  contenu: "Ce que l'équipe a appris pendant la saison.",
};

describe("partage schemas (front/back partagés)", () => {
  it("applies BROUILLON by default", () => {
    expect(createPartageSchema.parse(base).statut).toBe("BROUILLON");
  });

  it("rejects empty titles", () => {
    expect(
      createPartageSchema.safeParse({ ...base, titre: "   " }).success
    ).toBe(false);
  });

  it("rejects empty content", () => {
    expect(
      createPartageSchema.safeParse({ ...base, contenu: "  " }).success
    ).toBe(false);
  });

  it("allows statut-only updates for publish toggles", () => {
    expect(updatePartageSchema.safeParse({ statut: "PUBLIE" }).success).toBe(
      true
    );
  });
});
