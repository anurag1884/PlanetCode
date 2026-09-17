// ============================================================
// PlanetCode — Realtime Server Types
// File: apps/realtime/src/types/index.ts
// ============================================================

import type WebSocket from "ws";
import type { WsCloseCodeValue } from "../lib/constants";

/** A WebSocket connection enriched with verified auth context */
export interface AuthenticatedClient {
  ws: WebSocket;
  userId: string;
  planetId: string;
  connectedAt: Date;
}

export interface ConnectionResult {
  success: boolean;
  userId?: string;
  reason?: string;
  closeCode?: WsCloseCodeValue;
}

export type { WsCloseCodeValue };

