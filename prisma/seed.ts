import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, UserStatut } from "@prisma/client";
import bcryptjs from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const sharedPassword = await bcryptjs.hash("Password123", 10);

  await prisma.user.upsert({
    where: { email: "superadmin@mdn.com" },
    update: {
      password: sharedPassword,
      role: Role.SUPER_ADMIN,
      statut: UserStatut.ACTIF,
      deletedAt: null,
    },
    create: {
      nom: "Root",
      prenom: "Super",
      email: "superadmin@mdn.com",
      password: sharedPassword,
      role: Role.SUPER_ADMIN,
      sexe: "Non précisé",
      age: 35,
      categorie: "SALARIE",
      etablissement: "Maison du Numérique",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@mdn.com" },
    update: {
      password: sharedPassword,
      role: Role.ADMIN,
      statut: UserStatut.ACTIF,
      deletedAt: null,
    },
    create: {
      nom: "Admin",
      prenom: "MDN",
      email: "admin@mdn.com",
      password: sharedPassword,
      role: Role.ADMIN,
      sexe: "Masculin",
      age: 30,
      categorie: "SALARIE",
      etablissement: "Maison du Numérique",
    },
  });

  await prisma.user.upsert({
    where: { email: "volunteer@test.com" },
    update: {
      password: sharedPassword,
      role: Role.VOLUNTEER,
      statut: UserStatut.ACTIF,
      deletedAt: null,
    },
    create: {
      nom: "Martin",
      prenom: "Marie",
      email: "volunteer@test.com",
      password: sharedPassword,
      role: Role.VOLUNTEER,
      sexe: "Féminin",
      age: 22,
      categorie: "UNIVERSITAIRE",
      etablissement: "Université",
    },
  });

  // `USER` : pré-conversion, PAS de mot de passe → ne peut pas se connecter.
  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {
      password: null,
      role: Role.USER,
      statut: UserStatut.ACTIF,
      deletedAt: null,
    },
    create: {
      nom: "Candidat",
      prenom: "Eric",
      email: "user@test.com",
      password: null,
      role: Role.USER,
      sexe: "Masculin",
      age: 20,
      categorie: "UNIVERSITAIRE",
      etablissement: "Lycée",
    },
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

