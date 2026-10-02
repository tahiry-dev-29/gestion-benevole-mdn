import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import {
  CertificatStatut,
  PrismaClient,
  Role,
  UserStatut,
} from "@prisma/client";
import bcryptjs from "bcryptjs";
import { Pool } from "pg";

function createPool() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return new Pool();
  try {
    const parsed = new URL(dbUrl);
    const hostParam = parsed.searchParams.get("host");
    return new Pool({
      host: hostParam || parsed.hostname,
      port: parsed.port ? Number(parsed.port) : undefined,
      database: parsed.pathname.slice(1),
      user: parsed.username,
      password: parsed.password,
    });
  } catch {
    return new Pool({ connectionString: dbUrl });
  }
}

const pool = createPool();
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const mdnAdminPassword = await bcryptjs.hash("Password123", 10);
  const volunteerPassword = await bcryptjs.hash("volunteer123", 10);

  // SUPER_ADMIN
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@mdn.com" },
    update: {
      password: mdnAdminPassword,
      role: Role.SUPER_ADMIN,
      statut: UserStatut.ACTIF,
    },
    create: {
      nom: "Super",
      prenom: "Admin",
      email: "superadmin@mdn.com",
      password: mdnAdminPassword,
      role: Role.SUPER_ADMIN,
      sexe: "Masculin",
      age: 35,
      categorie: "SALARIE",
      etablissement: "MDN Head",
      matricule: "ADM-001",
      telephone: "0340000001",
    },
  });

  // ADMIN
  await prisma.user.upsert({
    where: { email: "admin@mdn.com" },
    update: {
      password: mdnAdminPassword,
      role: Role.ADMIN,
      statut: UserStatut.ACTIF,
    },
    create: {
      nom: "Admin",
      prenom: "MDN",
      email: "admin@mdn.com",
      password: mdnAdminPassword,
      role: Role.ADMIN,
      sexe: "Masculin",
      age: 30,
      categorie: "SALARIE",
      etablissement: "Maison du Numérique",
      matricule: "ADM-002",
      telephone: "0340000002",
    },
  });

  // VOLUNTEER (ex-bénévole)
  await prisma.user.upsert({
    where: { email: "volunteer@test.com" },
    update: {
      password: volunteerPassword,
      role: Role.VOLUNTEER,
      statut: UserStatut.ACTIF,
    },
    create: {
      nom: "Martin",
      prenom: "Marie",
      email: "volunteer@test.com",
      password: volunteerPassword,
      role: Role.VOLUNTEER,
      sexe: "Féminin",
      age: 22,
      categorie: "UNIVERSITAIRE",
      etablissement: "Université",
      matricule: "VOL-001",
      telephone: "0340000003",
    },
  });

  // USER 1 — En attente de validation certificat
  await prisma.user.upsert({
    where: { email: "user1@test.com" },
    update: {
      role: Role.USER,
      statut: UserStatut.ACTIF,
      certificatStatut: CertificatStatut.EN_ATTENTE,
      certificatUrl: "/uploads/certificat-user1.pdf",
      matricule: "ETU-2026-001",
      telephone: "0341100001",
      spinneret: "Informatique",
      materielPC: true,
      accepteRegles: true,
    },
    create: {
      nom: "Rabe",
      prenom: "Soa",
      email: "user1@test.com",
      password: null,
      role: Role.USER,
      statut: UserStatut.ACTIF,
      sexe: "Féminin",
      age: 20,
      categorie: "UNIVERSITAIRE",
      etablissement: "ESPA",
      matricule: "ETU-2026-001",
      telephone: "0341100001",
      spinneret: "Informatique",
      materielPC: true,
      accepteRegles: true,
      reglesAccepteesAt: new Date(),
      certificatStatut: CertificatStatut.EN_ATTENTE,
      certificatUrl: "/uploads/certificat-user1.pdf",
      cvUrl: "/uploads/cv-user1.pdf",
      createdById: superAdmin.id,
    },
  });

  // USER 2 — Certificat non demandé
  await prisma.user.upsert({
    where: { email: "user2@test.com" },
    update: {
      role: Role.USER,
      statut: UserStatut.ACTIF,
      certificatStatut: CertificatStatut.NON_DEMANDE,
      matricule: "ETU-2026-002",
      telephone: "0341100002",
      spinneret: "Gestion",
      materielPC: false,
      accepteRegles: true,
    },
    create: {
      nom: "Rakoto",
      prenom: "Faly",
      email: "user2@test.com",
      password: null,
      role: Role.USER,
      statut: UserStatut.ACTIF,
      sexe: "Masculin",
      age: 21,
      categorie: "UNIVERSITAIRE",
      etablissement: "ISCAM",
      matricule: "ETU-2026-002",
      telephone: "0341100002",
      spinneret: "Gestion",
      materielPC: false,
      accepteRegles: true,
      reglesAccepteesAt: new Date(),
      certificatStatut: CertificatStatut.NON_DEMANDE,
      createdById: superAdmin.id,
    },
  });

  // USER 3 — Certificat rejeté
  await prisma.user.upsert({
    where: { email: "user3@test.com" },
    update: {
      role: Role.USER,
      statut: UserStatut.ACTIF,
      certificatStatut: CertificatStatut.REJETE,
      matricule: "ETU-2026-003",
      telephone: "0341100003",
      spinneret: "Design",
      materielPC: true,
      accepteRegles: false,
    },
    create: {
      nom: "Andria",
      prenom: "Mamy",
      email: "user3@test.com",
      password: null,
      role: Role.USER,
      statut: UserStatut.ACTIF,
      sexe: "Masculin",
      age: 23,
      categorie: "UNIVERSITAIRE",
      etablissement: "CNTPE",
      matricule: "ETU-2026-003",
      telephone: "0341100003",
      spinneret: "Design",
      materielPC: true,
      accepteRegles: false,
      certificatStatut: CertificatStatut.REJETE,
      createdById: superAdmin.id,
    },
  });

  console.log(
    "Seeding completed successfully with test USERs and certificate states!"
  );
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
