// ============================================================
// PlanetCode — Persistence Scheduler
// File: apps/realtime/src/persistence/scheduler.ts
// ============================================================

import { SNAPSHOT_INTERVAL_MS } from "../lib/constants";
import { saveSnapshot } from "./snapshot";
import type { RoomManager } from "../rooms/RoomManager";

let intervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Starts periodic snapshot saves for all active dirty rooms.
 * Only saves rooms that have been modified (isDirty flag).
 */
export function startScheduler(roomManager: RoomManager): void {
  if (intervalId) return; // Already running

  intervalId = setInterval(async () => {
    const rooms = roomManager.getAllRooms();
    for (const [planetId, room] of rooms) {
      if (room.isDirty) {
        try {
          await saveSnapshot(planetId, room.ydoc);
          room.isDirty = false;
          console.log(`[Scheduler] Snapshot saved for planet ${planetId}`);
        } catch (err) {
          console.error(`[Scheduler] Snapshot failed for planet ${planetId}:`, err);
        }
      }
    }
  }, SNAPSHOT_INTERVAL_MS);

  console.log(
    `[Scheduler] Started. Saving dirty rooms every ${SNAPSHOT_INTERVAL_MS / 1000}s`,
  );
}

/**
 * Stops the scheduler and triggers a final save of all active rooms.
 * Called during graceful shutdown (SIGTERM/SIGINT).
 */
export async function stopScheduler(roomManager: RoomManager): Promise<void> {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  console.log("[Scheduler] Performing final snapshot save before shutdown...");
  await roomManager.shutdownAll();
}

