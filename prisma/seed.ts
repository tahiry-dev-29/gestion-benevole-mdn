import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role, UserStatut } from "@prisma/client";
import bcryptjs from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const superAdminPassword = await bcryptjs.hash("superadmin123", 10);
  const adminPassword = await bcryptjs.hash("admin123", 10);
  const volunteerPassword = await bcryptjs.hash("volunteer123", 10);

  await prisma.user.upsert({
    where: { email: "superadmin@mdn.com" },
    update: {
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
      statut: UserStatut.ACTIF,
    },
    create: {
      nom: "SuperAdmin",
      prenom: "MDN",
      email: "superadmin@mdn.com",
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
      statut: UserStatut.ACTIF,
      sexe: "Non précisé",
      age: 30,
      categorie: "SALARIE",
      etablissement: "Maison du Numérique",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@mdn.com" },
    update: {
      password: adminPassword,
      role: Role.ADMIN,
      statut: UserStatut.ACTIF,
    },
    create: {
      nom: "Admin",
      prenom: "MDN",
      email: "admin@mdn.com",
      password: adminPassword,
      role: Role.ADMIN,
      statut: UserStatut.ACTIF,
      sexe: "Non précisé",
      age: 30,
      categorie: "SALARIE",
      etablissement: "Maison du Numérique",
    },
  });

  await prisma.user.upsert({
    where: { email: "volunteer@test.com" },
    update: {
      password: volunteerPassword,
      role: Role.VOLUNTEER,
      statut: UserStatut.ACTIF,
    },
    create: {
      nom: "Bénévole",
      prenom: "Test",
      email: "volunteer@test.com",
      password: volunteerPassword,
      role: Role.VOLUNTEER,
      statut: UserStatut.ACTIF,
      sexe: "Non précisé",
      age: 22,
      categorie: "UNIVERSITAIRE",
      etablissement: "Université",
    },
  });

  // Compte pré-conversion : aucun mot de passe, ne peut pas se connecter.
  await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: { password: null, role: Role.USER, statut: UserStatut.ACTIF },
    create: {
      nom: "Compte",
      prenom: "Test",
      email: "user@test.com",
      password: null,
      role: Role.USER,
      statut: UserStatut.ACTIF,
      sexe: "Non précisé",
      age: 20,
      categorie: "UNIVERSITAIRE",
      etablissement: "Non renseigné",
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
