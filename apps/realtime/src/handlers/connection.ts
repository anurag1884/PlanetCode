// ============================================================
// PlanetCode — WebSocket Connection Handler
// File: apps/realtime/src/handlers/connection.ts
// ============================================================

import type WebSocket from "ws";
import type { IncomingMessage } from "http";
import { URL } from "url";
import { verifyClerkToken } from "../auth/clerk";
import { planetExists, verifyActiveMembership } from "../membership/verify";
import { tryAcquireSlot } from "../rooms/capacityLock";
import { WS_CLOSE_CODES, MAX_EDITORS_PER_PLANET } from "../lib/constants";
import { wsConnectionParamsSchema, isWithinSizeLimit } from "../lib/validators";
import { handleDisconnect } from "./disconnect";
import { handleMessage } from "./message";
import type { RoomManager } from "../rooms/RoomManager";
import type { AuthenticatedClient } from "../types/index";

/**
 * Full connection auth + join sequence per §9:
 *   1. Parse planetId from URL
 *   2. Extract + verify Clerk token (from Authorization header or ?token= query)
 *   3. Check planet exists
 *   4. Verify ACTIVE membership
 *   5. Atomically acquire capacity slot (max 5)
 *   6. Join Yjs room, send initial sync
 *   7. Wire message + disconnect handlers
 */
export async function handleConnection(
  ws: WebSocket,
  req: IncomingMessage,
  roomManager: RoomManager,
): Promise<void> {
  // ── Step 1: Parse connection URL params ──────────────────────
  const baseUrl = `ws://localhost`;
  const url = new URL(req.url ?? "/", baseUrl);

  const paramsResult = wsConnectionParamsSchema.safeParse({
    planetId: url.searchParams.get("planetId"),
  });

  if (!paramsResult.success) {
    ws.close(WS_CLOSE_CODES.PLANET_NOT_FOUND, "Missing or invalid planetId");
    return;
  }

  const { planetId } = paramsResult.data;

  // ── Step 2: Extract and verify Clerk token ───────────────────
  const token =
    url.searchParams.get("token") ??
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    ws.close(WS_CLOSE_CODES.UNAUTHORIZED, "Missing auth token");
    return;
  }

  let clerkUserId: string;
  try {
    clerkUserId = await verifyClerkToken(token);
  } catch {
    ws.close(WS_CLOSE_CODES.UNAUTHORIZED, "Unauthorized");
    return;
  }

  // ── Step 3: Check planet exists ──────────────────────────────
  const exists = await planetExists(planetId);
  if (!exists) {
    ws.close(WS_CLOSE_CODES.PLANET_NOT_FOUND, "Planet not found");
    return;
  }

  // ── Step 4: Verify ACTIVE membership ────────────────────────
  const isMember = await verifyActiveMembership(clerkUserId, planetId);
  if (!isMember) {
    ws.close(WS_CLOSE_CODES.UNAUTHORIZED, "Unauthorized: not an active member");
    return;
  }

  // ── Step 5: Acquire capacity slot (atomic) ───────────────────
  const slotAcquired = await tryAcquireSlot(planetId, MAX_EDITORS_PER_PLANET);
  if (!slotAcquired) {
    ws.close(WS_CLOSE_CODES.ROOM_FULL, "Room is full");
    return;
  }

  // ── Step 6: Join room, send initial Yjs sync ─────────────────
  let room;
  try {
    room = await roomManager.getOrCreate(planetId);
  } catch (err) {
    console.error(`[Connection] Failed to get/create room for ${planetId}:`, err);
    ws.close(WS_CLOSE_CODES.UNAUTHORIZED, "Server error");
    return;
  }

  const client: AuthenticatedClient = {
    ws,
    userId: clerkUserId,
    planetId,
    connectedAt: new Date(),
  };

  room.addClient(client);
  room.sendInitialSync(client);

  console.log(
    `[Connection] User ${clerkUserId} joined planet ${planetId} (${room.clientCount}/${MAX_EDITORS_PER_PLANET})`,
  );

  // ── Step 7: Wire message and disconnect handlers ─────────────
  ws.on("message", (data: Buffer, isBinary: boolean) => {
    if (!isBinary) return; // Only binary Yjs messages are valid
    if (!isWithinSizeLimit(data)) {
      ws.close(WS_CLOSE_CODES.POLICY_VIOLATION, "Message too large");
      return;
    }
    handleMessage(client, room, data);
  });

  ws.on("close", () => {
    void handleDisconnect(client, roomManager);
  });

  ws.on("error", (err) => {
    console.error(`[Connection] WS error for user ${clerkUserId}:`, err.message);
  });
}

