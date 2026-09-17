// ============================================================
// PlanetCode — Yjs Snapshot Persistence
// File: apps/realtime/src/persistence/snapshot.ts
// ============================================================

import * as Y from "yjs";
import { prisma } from "../lib/db";

/**
 * Encodes the Y.Doc state and upserts it to the DocumentSnapshot table.
 * The version field is monotonically incremented.
 */
export async function saveSnapshot(planetId: string, ydoc: Y.Doc): Promise<void> {
  const state = Buffer.from(Y.encodeStateAsUpdate(ydoc));

  // Get current max version
  const latest = await prisma.documentSnapshot.findFirst({
    where: { planetId },
    orderBy: { version: "desc" },
    select: { version: true },
  });

  const version = (latest?.version ?? 0) + 1;

  await prisma.documentSnapshot.create({
    data: {
      planetId,
      state,
      version,
    },
  });
}

/**
 * Loads the latest Yjs snapshot state for a planet.
 * Returns null if no snapshot exists (fresh room).
 */
export async function loadSnapshot(planetId: string): Promise<Uint8Array | null> {
  const snapshot = await prisma.documentSnapshot.findFirst({
    where: { planetId },
    orderBy: { version: "desc" },
    select: { state: true },
  });

  if (!snapshot) return null;

  return new Uint8Array(snapshot.state);
}

