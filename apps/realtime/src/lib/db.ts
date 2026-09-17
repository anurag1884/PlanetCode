// ============================================================
// PlanetCode — Prisma Client for Realtime Server
// File: apps/realtime/src/lib/db.ts
// ============================================================

// Re-export the shared Prisma client singleton from @planetcode/db
// The realtime server uses it for: membership checks, planet lookups, snapshots
export { prisma } from "@planetcode/db";

