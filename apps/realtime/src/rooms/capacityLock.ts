// ============================================================
// PlanetCode — Capacity Lock
// File: apps/realtime/src/rooms/capacityLock.ts
// ============================================================

/**
 * Per-room active slot counters and per-room serialization queues.
 * Serializing per room (not globally) avoids unnecessary lock contention.
 */
const slots = new Map<string, number>();
const queues = new Map<string, Promise<void>>();

/** Serialize operations per room so slot check+increment is atomic */
function serialize(planetId: string, fn: () => void): Promise<void> {
  const prev = queues.get(planetId) ?? Promise.resolve();
  const next = prev.then(fn).catch(() => undefined);
  queues.set(planetId, next);
  return next;
}

/**
 * Atomically tries to acquire a slot for a planet.
 * Returns true if the slot was acquired, false if the room is already full.
 */
export function tryAcquireSlot(planetId: string, max: number): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    void serialize(planetId, () => {
      const current = slots.get(planetId) ?? 0;
      if (current >= max) {
        resolve(false);
      } else {
        slots.set(planetId, current + 1);
        resolve(true);
      }
    });
  });
}

/**
 * Releases a slot when a user disconnects. Safe to call multiple times.
 */
export function releaseSlot(planetId: string): void {
  const current = slots.get(planetId) ?? 0;
  if (current <= 1) {
    slots.delete(planetId);
    queues.delete(planetId);
  } else {
    slots.set(planetId, current - 1);
  }
}

/** Returns the current active connection count for a planet (0 if none). */
export function getActiveCount(planetId: string): number {
  return slots.get(planetId) ?? 0;
}

