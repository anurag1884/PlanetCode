// ============================================================
// PlanetCode — Room Manager
// File: apps/realtime/src/rooms/RoomManager.ts
// ============================================================

import { Room } from "./Room";
import { loadSnapshot, saveSnapshot } from "../persistence/snapshot";

export class RoomManager {
  private rooms = new Map<string, Room>();

  /**
   * Gets an existing room or creates a new one, loading the latest
   * Yjs snapshot from the database if one exists.
   */
  async getOrCreate(planetId: string): Promise<Room> {
    const existing = this.rooms.get(planetId);
    if (existing) return existing;

    // Load persisted state from DB
    const initialState = await loadSnapshot(planetId);
    const room = new Room(planetId, initialState ?? undefined);
    this.rooms.set(planetId, room);

    console.log(`[RoomManager] Created room for planet ${planetId}`);
    return room;
  }

  get(planetId: string): Room | undefined {
    return this.rooms.get(planetId);
  }

  /**
   * Persists the room state to DB, then destroys it.
   * Called when the last user leaves a room.
   */
  async destroy(planetId: string): Promise<void> {
    const room = this.rooms.get(planetId);
    if (!room) return;

    try {
      await saveSnapshot(planetId, room.ydoc);
      console.log(`[RoomManager] Snapshot saved for planet ${planetId}`);
    } catch (err) {
      console.error(`[RoomManager] Failed to save snapshot for planet ${planetId}:`, err);
    }

    room.destroy();
    this.rooms.delete(planetId);
    console.log(`[RoomManager] Destroyed room for planet ${planetId}`);
  }

  /** Returns all active rooms (for scheduled snapshot saves) */
  getAllRooms(): Map<string, Room> {
    return this.rooms;
  }

  /** Graceful shutdown: persist all rooms then clean up */
  async shutdownAll(): Promise<void> {
    console.log(`[RoomManager] Shutting down ${this.rooms.size} active rooms...`);
    const promises = [...this.rooms.keys()].map((id) => this.destroy(id));
    await Promise.allSettled(promises);
    console.log("[RoomManager] All rooms shut down.");
  }
}

