// ============================================================
// PlanetCode — WebSocket Message Validators
// File: apps/realtime/src/lib/validators.ts
// ============================================================

import { z } from "zod";
import { MAX_WS_MESSAGE_SIZE_BYTES } from "./constants";

/** Validates URL query params on WebSocket connection */
export const wsConnectionParamsSchema = z.object({
  planetId: z.string().cuid("planetId must be a valid CUID"),
});

/**
 * Returns true if the message is within the allowed size.
 * Called before any message processing.
 */
export function isWithinSizeLimit(data: Buffer | ArrayBuffer | string): boolean {
  const size = Buffer.isBuffer(data)
    ? data.byteLength
    : typeof data === "string"
      ? Buffer.byteLength(data, "utf8")
      : data.byteLength;
  return size <= MAX_WS_MESSAGE_SIZE_BYTES;
}

export type WsConnectionParams = z.infer<typeof wsConnectionParamsSchema>;

