/**
 * Tests d'intégration Sprint 6 — crédits & observations mensuelles.
 *
 * Exécutés contre la vraie BDD de dev (`DATABASE_URL`) :
 *   pnpm test:integration
 * Données isolées par un email dédié + nettoyage systématique.
 */
import "dotenv/config";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";

const TEST_EMAIL = "test.sprint6@mdn.local";

let userId = 0;

beforeAll(async () => {
  const user = await prisma.user.upsert({
    where: { email: TEST_EMAIL },
    update: {},
    create: {
      nom: "Testeur",
      prenom: "Bénévole",
      email: TEST_EMAIL,
      sexe: "Masculin",
      age: 25,
      categorie: "UNIVERSITAIRE",
      etablissement: "Université",
    },
  });
  userId = user.id;
  await prisma.credit.deleteMany({ where: { user_id: userId } });
  await prisma.observation.deleteMany({ where: { user_id: userId } });
});

afterAll(async () => {
  await prisma.credit.deleteMany({ where: { user_id: userId } });
  await prisma.observation.deleteMany({ where: { user_id: userId } });
  await prisma.user.delete({ where: { id: userId } });
  await prisma.$disconnect();
});

describe("S6.1 — validation et cumul des crédits", () => {
  it("cumule deux crédits à 40.25 €", async () => {
    await prisma.credit.create({
      data: {
        user_id: userId,
        montant: 25.5,
        date: new Date(2026, 9, 5),
        motif: "Transport mission",
      },
    });
    await prisma.credit.create({
      data: {
        user_id: userId,
        montant: 14.75,
        date: new Date(2026, 9, 10),
        motif: "Repas bénévole",
      },
    });

    const credits = await prisma.credit.findMany({
      where: { user_id: userId },
    });
    const total = credits.reduce((sum, c) => sum + c.montant, 0);

    expect(credits).toHaveLength(2);
    expect(Math.round(total * 100) / 100).toBe(40.25);
  });

  it("recalcule le cumul à 25.50 € après suppression d'un crédit", async () => {
    const doomed = await prisma.credit.findFirstOrThrow({
      where: { user_id: userId, montant: 14.75 },
    });
    await prisma.credit.delete({ where: { id: doomed.id } });

    const remaining = await prisma.credit.findMany({
      where: { user_id: userId },
    });
    const total = remaining.reduce((sum, c) => sum + c.montant, 0);

    expect(total).toBe(25.5);
  });
});

describe("S6.3 — unicité et CRUD de l'observation mensuelle", () => {
  it("crée la première observation du mois 10/2026", async () => {
    const obs = await prisma.observation.create({
      data: {
        user_id: userId,
        mois: 10,
        annee: 2026,
        contenu: "Excellente implication dans les activités d'octobre.",
      },
    });

    expect(obs.mois).toBe(10);
    expect(obs.annee).toBe(2026);
  });

  it("rejette le doublon d'observation pour le même mois/année (P2002)", async () => {
    await expect(
      prisma.observation.create({
        data: {
          user_id: userId,
          mois: 10,
          annee: 2026,
          contenu: "Deuxième tentative même mois.",
        },
      })
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("met à jour puis supprime l'observation", async () => {
    const obs = await prisma.observation.findFirstOrThrow({
      where: { user_id: userId, mois: 10, annee: 2026 },
    });

    const updated = await prisma.observation.update({
      where: { id: obs.id },
      data: { contenu: "Contenu mis à jour avec plus de détails." },
    });
    expect(updated.contenu).toBe("Contenu mis à jour avec plus de détails.");

    await prisma.observation.delete({ where: { id: obs.id } });
    await expect(
      prisma.observation.findUnique({ where: { id: obs.id } })
    ).resolves.toBeNull();
  });
});
