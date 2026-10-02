import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  headers: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({ auth: mocks.auth }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    temoignage: {
      create: mocks.create,
      update: mocks.update,
      delete: mocks.delete,
    },
  },
}));
vi.mock("next/headers", () => ({ headers: mocks.headers }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

import { moderateTemoignage, submitTemoignage } from "./temoignage.action";

describe("témoignages — soumission et modération", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.headers.mockResolvedValue(
      new Headers({
        "x-forwarded-for": `192.0.2.${Math.ceil(Math.random() * 200)}`,
      })
    );
  });

  it("accepte une soumission publique en attente de modération", async () => {
    const result = await submitTemoignage({
      nom_auteur: "Sam",
      contenu:
        "Une belle expérience vécue avec les bénévoles de l'association.",
    });

    expect(result.success).toBe(true);
    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        nom_auteur: "Sam",
        contenu:
          "Une belle expérience vécue avec les bénévoles de l'association.",
        statut: "EN_ATTENTE",
      },
    });
  });

  it("ignore le honeypot et rejette un contenu trop court sans écrire", async () => {
    const bot = await submitTemoignage({
      contenu: "Un texte assez long pour le formulaire public.",
      website: "https://spam.example",
    });
    const invalid = await submitTemoignage({ contenu: "trop court" });

    expect(bot.success).toBe(true);
    expect(invalid.success).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it.each(["ADMIN", "SUPER_ADMIN"] as const)(
    "%s peut publier un témoignage",
    async (role) => {
      mocks.auth.mockResolvedValue({ user: { role } });
      mocks.update.mockResolvedValue({ id: 12, statut: "PUBLIE" });

      const result = await moderateTemoignage({ id: 12, action: "publier" });

      expect(result.success).toBe(true);
      expect(mocks.update).toHaveBeenCalledWith({
        where: { id: 12 },
        data: { statut: "PUBLIE" },
      });
    }
  );

  it("refuse la modération VOLUNTEER avant toute écriture", async () => {
    mocks.auth.mockResolvedValue({ user: { role: "VOLUNTEER" } });

    const result = await moderateTemoignage({ id: 12, action: "publier" });

    expect(result).toEqual({ success: false, error: "Accès refusé." });
    expect(mocks.update).not.toHaveBeenCalled();
  });
});
