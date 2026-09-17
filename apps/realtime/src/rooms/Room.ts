// ============================================================
// PlanetCode — Room
// File: apps/realtime/src/rooms/Room.ts
// ============================================================

import * as Y from "yjs";
import * as awarenessProtocol from "y-protocols/awareness";
import * as syncProtocol from "y-protocols/sync";
import * as encoding from "lib0/encoding";
import * as decoding from "lib0/decoding";
import type WebSocket from "ws";
import type { AuthenticatedClient } from "../types/index";

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;
const WS_OPEN = 1; // WebSocket.OPEN

export class Room {
  readonly planetId: string;
  readonly ydoc: Y.Doc;
  readonly awareness: awarenessProtocol.Awareness;
  private clients = new Map<string, AuthenticatedClient>();
  isDirty = false;

  constructor(planetId: string, initialState?: Uint8Array) {
    this.planetId = planetId;
    this.ydoc = new Y.Doc({ gc: true });

    if (initialState && initialState.byteLength > 0) {
      Y.applyUpdate(this.ydoc, initialState);
    }

    this.awareness = new awarenessProtocol.Awareness(this.ydoc);

    // Broadcast doc updates to all peers, mark room dirty for snapshot
    this.ydoc.on("update", (update: Uint8Array, origin: unknown) => {
      this.isDirty = true;
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MESSAGE_SYNC);
      syncProtocol.writeUpdate(encoder, update);
      const message = encoding.toUint8Array(encoder);

      for (const [, client] of this.clients) {
        if (client.ws !== (origin as WebSocket) && client.ws.readyState === WS_OPEN) {
          client.ws.send(message);
        }
      }
    });

    // Broadcast awareness changes to all clients
    this.awareness.on(
      "update",
      (changes: { added: number[]; updated: number[]; removed: number[] }) => {
        const changed = [...changes.added, ...changes.updated, ...changes.removed];
        const update = awarenessProtocol.encodeAwarenessUpdate(this.awareness, changed);
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
        encoding.writeVarUint8Array(encoder, update);
        const message = encoding.toUint8Array(encoder);

        for (const [, client] of this.clients) {
          if (client.ws.readyState === WS_OPEN) {
            client.ws.send(message);
          }
        }
      },
    );
  }

  /**
   * Send initial Yjs sync step1 + existing awareness to a newly joined client.
   * The client will respond with step2, completing the sync handshake.
   */
  sendInitialSync(client: AuthenticatedClient): void {
    const ws = client.ws;

    // Step 1: send our state vector so client can compute what we're missing
    const syncEncoder = encoding.createEncoder();
    encoding.writeVarUint(syncEncoder, MESSAGE_SYNC);
    syncProtocol.writeSyncStep1(syncEncoder, this.ydoc);
    ws.send(encoding.toUint8Array(syncEncoder));

    // Send our full doc state as step2 so client gets current content
    const step2Encoder = encoding.createEncoder();
    encoding.writeVarUint(step2Encoder, MESSAGE_SYNC);
    syncProtocol.writeSyncStep2(step2Encoder, this.ydoc, Y.encodeStateVector(this.ydoc));
    ws.send(encoding.toUint8Array(step2Encoder));

    // Send all current awareness states
    const awarenessStates = [...this.awareness.getStates().keys()];
    if (awarenessStates.length > 0) {
      const awarenessUpdate = awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        awarenessStates,
      );
      const awarenessEncoder = encoding.createEncoder();
      encoding.writeVarUint(awarenessEncoder, MESSAGE_AWARENESS);
      encoding.writeVarUint8Array(awarenessEncoder, awarenessUpdate);
      ws.send(encoding.toUint8Array(awarenessEncoder));
    }
  }

  /** Route an incoming binary WS message to the correct Yjs handler */
  handleMessage(client: AuthenticatedClient, data: Buffer): void {
    try {
      const decoder = decoding.createDecoder(new Uint8Array(data));
      const messageType = decoding.readVarUint(decoder);

      if (messageType === MESSAGE_SYNC) {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_SYNC);
        // origin = client.ws so the ydoc "update" listener skips echoing back
        syncProtocol.readSyncMessage(decoder, encoder, this.ydoc, client.ws);
        const response = encoding.toUint8Array(encoder);
        if (response.byteLength > 1) {
          client.ws.send(response);
        }
      } else if (messageType === MESSAGE_AWARENESS) {
        const update = decoding.readVarUint8Array(decoder);
        awarenessProtocol.applyAwarenessUpdate(this.awareness, update, client.ws);
      }
    } catch {
      // Silently drop malformed messages to prevent server crashes
    }
  }

  addClient(client: AuthenticatedClient): void {
    this.clients.set(client.userId, client);
  }

  removeClient(userId: string): void {
    if (this.clients.has(userId)) {
      // Clean up awareness for this client
      awarenessProtocol.removeAwarenessStates(
        this.awareness,
        [this.ydoc.clientID],
        "user-disconnected",
      );
      this.clients.delete(userId);
    }
  }

  forceDisconnect(userId: string, closeCode: number): void {
    const client = this.clients.get(userId);
    if (client && client.ws.readyState === WS_OPEN) {
      client.ws.close(closeCode, "Forcefully disconnected by server");
    }
  }

  get clientCount(): number {
    return this.clients.size;
  }

  encodeState(): Uint8Array {
    return Y.encodeStateAsUpdate(this.ydoc);
  }

  destroy(): void {
    this.awareness.destroy();
    this.ydoc.destroy();
    this.clients.clear();
  }
}

