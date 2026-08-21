// ============================================================
// PlanetCode — Realtime Server Entry Point
// File: apps/realtime/src/server.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/ARCHITECTURE.md for server architecture
// See: docs/API_AND_REALTIME.md for WebSocket protocol
// ============================================================

// TODO: Implement the realtime server:
// 1. Create HTTP server (for health checks)
// 2. Create WebSocket server (ws package) on top of HTTP server
// 3. On WS connection:
//    a. Verify Clerk session token (§9)
//    b. Identify user from token
//    c. Extract planetId from connection URL/params
//    d. Verify planet exists
//    e. Verify membership ACTIVE (§8)
//    f. Check room capacity atomically (§11)
//    g. Join Yjs room
//    h. Set up message handlers
// 4. On WS message: route to Yjs sync / awareness handlers
// 5. On WS close: cleanup, update capacity, remove from awareness
// 6. Graceful shutdown: persist all Yjs state, close connections

export {};
