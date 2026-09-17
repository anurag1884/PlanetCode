// ============================================================
// PlanetCode — Membership Verification (Realtime Server)
// File: apps/realtime/src/membership/verify.ts
// ============================================================

import { prisma } from "../lib/db";

/**
 * Verifies that a user has ACTIVE membership for a planet.
 * Called on every connection/reconnection — never cached per security policy.
 */
export async function verifyActiveMembership(
  userId: string,
  planetId: string,
): Promise<boolean> {
  const membership = await prisma.planetMember.findFirst({
    where: {
      planetId,
      userId,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  return membership !== null;
}

/**
 * Checks whether a planet exists. Used before membership check
 * so we can return PLANET_NOT_FOUND vs UNAUTHORIZED.
 */
export async function planetExists(planetId: string): Promise<boolean> {
  const planet = await prisma.planet.findUnique({
    where: { id: planetId },
    select: { id: true },
  });
  return planet !== null;
}

