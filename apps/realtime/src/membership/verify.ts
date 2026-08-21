// ============================================================
// PlanetCode — Membership Verification (Realtime Server)
// File: apps/realtime/src/membership/verify.ts
// Status: PLACEHOLDER — not yet implemented
// See: Master Prompt §6, §8 for membership verification
// ============================================================

// TODO: Implement membership verification:
// - verifyMembership(userId, planetId): Check DB for ACTIVE membership
// - Called on every connection/reconnection (never cached)
// - handleMemberRemoval(userId, planetId): Force disconnect removed member
//   1. Find their WebSocket connection
//   2. Close it immediately
//   3. Remove from Yjs Awareness
//   4. Release capacity slot
// - Listen for removal notifications (Postgres LISTEN/NOTIFY or internal API)

export {};
