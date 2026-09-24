import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config"; // Ensure DATABASE_URL is loaded

const globalForPrisma = globalThis;

let prismaInstance;

if (globalForPrisma.prisma) {
  prismaInstance = globalForPrisma.prisma;
} else {
  // 1. Create a pg Pool connecting to your database
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  // 2. Instantiate the PrismaPg adapter
  const adapter = new PrismaPg(pool);

  // 3. Initialize PrismaClient using the adapter
  prismaInstance = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"],
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaInstance;
  }
}

export const prisma = prismaInstance;
export default prisma;
