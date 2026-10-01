/* eslint-disable no-console */
import { prisma } from "../src/lib/prisma";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.info(`  ✓ ${message}`);
}

async function runTests() {
  console.info("=== Lancement des tests fonctionnels Sprint 6 ===");

  const testUser = await prisma.user.upsert({
    where: { email: "test.sprint6@mdn.local" },
    update: {},
    create: {
      nom: "Testeur",
      prenom: "Bénévole",
      email: "test.sprint6@mdn.local",
      sexe: "Masculin",
      age: 25,
      categorie: "UNIVERSITAIRE",
      etablissement: "Université",
    },
  });

  console.info("\n[Test 1] S6.1 - Validation et cumul des crédits");
  await prisma.credit.deleteMany({ where: { user_id: testUser.id } });
  await prisma.observation.deleteMany({ where: { user_id: testUser.id } });

  const c1 = await prisma.credit.create({
    data: {
      user_id: testUser.id,
      montant: 25.5,
      date: new Date(2026, 9, 5),
      motif: "Transport mission",
    },
  });

  const c2 = await prisma.credit.create({
    data: {
      user_id: testUser.id,
      montant: 14.75,
      date: new Date(2026, 9, 10),
      motif: "Repas bénévole",
    },
  });

  assert(c1.montant === 25.5, "Crédit 1 créé avec 25.50 €");
  assert(c2.montant === 14.75, "Crédit 2 créé avec 14.75 €");

  const creditsList = await prisma.credit.findMany({
    where: { user_id: testUser.id },
  });
  const total = creditsList.reduce((sum, c) => sum + c.montant, 0);
  const roundedTotal = Math.round(total * 100) / 100;
  assert(
    roundedTotal === 40.25,
    `Cumul attendu 40.25 €, obtenu: ${roundedTotal} €`
  );

  await prisma.credit.delete({ where: { id: c2.id } });
  const creditsAfterDelete = await prisma.credit.findMany({
    where: { user_id: testUser.id },
  });
  const totalAfterDelete = creditsAfterDelete.reduce(
    (sum, c) => sum + c.montant,
    0
  );
  assert(
    totalAfterDelete === 25.5,
    `Cumul après suppression attendu 25.50 €, obtenu: ${totalAfterDelete} €`
  );

  console.info("\n[Test 2] S6.3 - Unicité et CRUD Observation mensuelle");
  const obs1 = await prisma.observation.create({
    data: {
      user_id: testUser.id,
      mois: 10,
      annee: 2026,
      contenu: "Excellente implication dans les activités d'octobre.",
    },
  });
  assert(
    obs1.mois === 10 && obs1.annee === 2026,
    "Première observation créée pour 10/2026"
  );

  let duplicateRejected = false;
  try {
    await prisma.observation.create({
      data: {
        user_id: testUser.id,
        mois: 10,
        annee: 2026,
        contenu: "Deuxième tentative même mois.",
      },
    });
  } catch {
    duplicateRejected = true;
  }
  assert(
    duplicateRejected,
    "Rejet strict du doublon d'observation pour le même mois/année (P2002)"
  );

  const updatedObs = await prisma.observation.update({
    where: { id: obs1.id },
    data: { contenu: "Contenu mis à jour avec plus de détails." },
  });
  assert(
    updatedObs.contenu === "Contenu mis à jour avec plus de détails.",
    "Observation mise à jour avec succès"
  );

  await prisma.observation.delete({ where: { id: obs1.id } });
  const remainingObs = await prisma.observation.findUnique({
    where: { id: obs1.id },
  });
  assert(remainingObs === null, "Observation supprimée avec succès");

  await prisma.credit.deleteMany({ where: { user_id: testUser.id } });
  await prisma.user.delete({ where: { id: testUser.id } });

  console.info(
    "\n=== Tous les tests fonctionnels du Sprint 6 sont validés ! ===\n"
  );
}

runTests()
  .catch((e) => {
    console.error("Test failure:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
