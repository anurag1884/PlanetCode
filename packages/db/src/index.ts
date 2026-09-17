// ============================================================
// PlanetCode — Prisma Client Singleton
// File: packages/db/src/index.ts
// ============================================================

import { PrismaClient } from "@prisma/client";

// Prevent multiple instances in development (Next.js hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Re-export all Prisma generated types
export * from "@prisma/client";

