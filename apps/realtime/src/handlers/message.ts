// ============================================================
// PlanetCode — WebSocket Message Handler
// File: apps/realtime/src/handlers/message.ts
// ============================================================

import type { AuthenticatedClient } from "../types/index";
import type { Room } from "../rooms/Room";

/**
 * Routes an incoming binary WS message to the Room for processing.
 * The Room handles Yjs sync (step1/step2/update) and awareness.
 * Size validation is done by the connection handler before this is called.
 */
export function handleMessage(
  client: AuthenticatedClient,
  room: Room,
  data: Buffer,
): void {
  room.handleMessage(client, data);
}

