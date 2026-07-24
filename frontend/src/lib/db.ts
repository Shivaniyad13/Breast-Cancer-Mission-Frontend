import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === "production";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  if (isProduction) {
    console.error("CRITICAL ERROR: DATABASE_URL environment variable is not defined in production. Prisma queries will fail.");
  } else {
    console.warn("WARNING: DATABASE_URL environment variable is not set. Falling back to default configuration.");
  }
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);

export const db = globalThis.prisma || new PrismaClient({
  adapter,
  log: isProduction ? ["error", "warn"] : ["query", "info", "warn", "error"],
});

if (!isProduction) {
  globalThis.prisma = db;
}
