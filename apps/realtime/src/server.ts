// ============================================================
// PlanetCode — Realtime Server Entry Point
// File: apps/realtime/src/server.ts
// ============================================================

import http from "http";
import { WebSocketServer } from "ws";
import { DEFAULT_PORT } from "./lib/constants";
import { handleConnection } from "./handlers/connection";
import { RoomManager } from "./rooms/RoomManager";
import { startScheduler, stopScheduler } from "./persistence/scheduler";

const roomManager = new RoomManager();

// ── HTTP Server (health check) ────────────────────────────────
const httpServer = http.createServer((req, res) => {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }
  res.writeHead(404);
  res.end();
});

// ── WebSocket Server ──────────────────────────────────────────
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws, req) => {
  // Connection handler is async — void to suppress unhandled promise warning
  void handleConnection(ws, req, roomManager);
});

// ── Persistence Scheduler ─────────────────────────────────────
startScheduler(roomManager);

// ── Start Listening ───────────────────────────────────────────
httpServer.listen(DEFAULT_PORT, () => {
  console.log(`\n🚀 PlanetCode Realtime Server`);
  console.log(`   HTTP health: http://localhost:${DEFAULT_PORT}/health`);
  console.log(`   WebSocket:   ws://localhost:${DEFAULT_PORT}`);
  console.log(`   Max editors: 5 per planet\n`);
});

// ── Graceful Shutdown ─────────────────────────────────────────
async function shutdown(signal: string): Promise<void> {
  console.log(`\n[Server] ${signal} received — shutting down gracefully...`);

  await stopScheduler(roomManager);

  wss.close(() => {
    httpServer.close(() => {
      console.log("[Server] Closed. Bye 👋");
      process.exit(0);
    });
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    console.error("[Server] Forced exit after timeout");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

