// ============================================================
// PlanetCode — Web App Constants
// File: apps/web/src/lib/constants.ts
// ============================================================

export const MAX_EDITORS_PER_PLANET = 5;
export const MAX_FILE_SIZE_BYTES = 1_000_000;       // 1 MB per file
export const MAX_FILES_PER_PLANET = 100;
export const MAX_PROJECT_SIZE_BYTES = 50_000_000;   // 50 MB total

export const RECONNECT_MAX_RETRIES = 10;
export const RECONNECT_BASE_DELAY_MS = 1_000;       // 1s initial, exponential backoff
export const RECONNECT_MAX_DELAY_MS = 30_000;       // cap at 30s

/** PLN-XXXXXX format — 6 uppercase alphanumeric characters */
export const PLANET_CODE_REGEX = /^PLN-[A-Z0-9]{6}$/;

export const REALTIME_URL =
  process.env["NEXT_PUBLIC_REALTIME_URL"] ?? "ws://localhost:3001";

