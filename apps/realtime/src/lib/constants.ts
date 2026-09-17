// ============================================================
// PlanetCode — Realtime Server Constants
// File: apps/realtime/src/lib/constants.ts
// ============================================================

export const DEFAULT_PORT = Number(process.env["PORT"] ?? 3001);
export const MAX_EDITORS_PER_PLANET = 5;
export const MAX_WS_MESSAGE_SIZE_BYTES = 1_048_576; // 1 MB
export const SNAPSHOT_INTERVAL_MS = 30_000; // 30 seconds
export const CONNECTION_TIMEOUT_MS = 10_000; // 10 seconds
export const HEARTBEAT_INTERVAL_MS = 15_000; // 15 seconds

/** Standard WS close codes — 4xxx = application-level */
export const WS_CLOSE_CODES = {
  UNAUTHORIZED: 4001,      // Invalid Clerk token or inactive membership
  ROOM_FULL: 4003,         // Capacity limit reached
  PLANET_NOT_FOUND: 4004,  // Planet does not exist
  POLICY_VIOLATION: 4008,  // Message too large or invalid format
} as const;

export type WsCloseCodeValue = (typeof WS_CLOSE_CODES)[keyof typeof WS_CLOSE_CODES];

