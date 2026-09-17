// ============================================================
// PlanetCode — Clerk Auth for WebSocket
// File: apps/realtime/src/auth/clerk.ts
// ============================================================

import { verifyToken } from "@clerk/backend";
import { WS_CLOSE_CODES } from "../lib/constants";

/**
 * Verifies a Clerk session token and returns the clerkId (userId).
 * Throws on any failure — callers must close the socket on throw.
 *
 * SECURITY: Never accept client-declared userId — always derive from token.
 */
export async function verifyClerkToken(token: string): Promise<string> {
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env["CLERK_SECRET_KEY"] ?? "",
    });

    if (!payload.sub) {
      throw new Error("Token is missing sub claim");
    }

    return payload.sub; // Clerk's userId (clerkId)
  } catch {
    const err = new Error("Unauthorized: invalid or expired token");
    (err as NodeJS.ErrnoException).code = String(WS_CLOSE_CODES.UNAUTHORIZED);
    throw err;
  }
}

