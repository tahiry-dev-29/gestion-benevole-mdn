import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isPrismaPostgres =
  process.env.DATABASE_URL?.startsWith("prisma+postgres://");

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

const createClient = () => {
  if (isPrismaPostgres) {
    return new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  }

  const pool = createPool();
  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
