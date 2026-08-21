import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import bcryptjs from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcryptjs.hash("admin123", 10);
  const benevolePassword = await bcryptjs.hash("benevole123", 10);
  await prisma.user.upsert({
    where: { email: "admin@benevol.local" },
    update: {},
    create: {
      nom: "Dupont",
      prenom: "Jean",
      email: "admin@benevol.local",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: "benevole@benevol.local" },
    update: {},
    create: {
      nom: "Martin",
      prenom: "Marie",
      email: "benevole@benevol.local",
      password: benevolePassword,
      role: Role.BENEVOLE,
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
