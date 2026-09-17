// ============================================================
// PlanetCode — WebSocket Disconnect Handler
// File: apps/realtime/src/handlers/disconnect.ts
// ============================================================

import { releaseSlot } from "../rooms/capacityLock";
import type { RoomManager } from "../rooms/RoomManager";
import type { AuthenticatedClient } from "../types/index";

/**
 * Handles cleanup when a WebSocket connection closes:
 *   1. Release the capacity slot (atomic decrement)
 *   2. Remove client from the Room
 *   3. If the room is now empty, persist Yjs state and destroy it
 */
export async function handleDisconnect(
  client: AuthenticatedClient,
  roomManager: RoomManager,
): Promise<void> {
  const { userId, planetId } = client;

  // Always release the capacity slot, even if room no longer exists
  releaseSlot(planetId);

  const room = roomManager.get(planetId);
  if (!room) return;

  room.removeClient(userId);

  console.log(
    `[Disconnect] User ${userId} left planet ${planetId} (${room.clientCount} remaining)`,
  );

  // Last user left — persist state and destroy room
  if (room.clientCount === 0) {
    await roomManager.destroy(planetId);
  }
}

