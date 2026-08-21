# API & Realtime Reference

## 1. REST API Endpoints (Base: `/api`)

### Planets
- `POST /planets` - Create a Planet (requires `name`, `password`).
- `GET /planets` - List Planets the user owns or is a member of.
- `GET /planets/:id` - Get Planet details.
- `PATCH /planets/:id` - Update Planet settings (Owner only).
- `DELETE /planets/:id` - Delete Planet (Owner only).

### Access
- `POST /planets/:id/requests` - Submit a request to join a Planet.
- `GET /planets/:id/requests` - List pending requests (Owner only).
- `POST /requests/:id/approve` - Approve access (Owner only, sets member ACTIVE).
- `POST /requests/:id/reject` - Reject access (Owner only).
- `POST /planets/:id/enter` - Verify Planet password.

### Files
- `GET /planets/:id/files` - List files.
- `POST /planets/:id/files` - Create a file (validates path).
- `PATCH /files/:id` - Update file metadata or content.
- `DELETE /files/:id` - Delete file.

## 2. WebSocket Protocol

**Endpoint:** `wss://<realtime-server>/?planetId=<id>`

### Connection Handshake
1. Client connects, providing Clerk session token (e.g., via query param, header, or initial auth message depending on exact ws implementation).
2. Server verifies token with Clerk.
3. Server checks DB for `ACTIVE` membership.
4. Server acquires capacity lock.
5. If successful, server responds with initial Yjs sync.

### Yjs Synchronization (y-protocols)
- Uses standard `y-protocols/sync` (Step 1, Step 2, Update).
- Incremental updates are broadcasted to all connected clients in the room.

### Awareness (y-protocols)
- Uses `y-protocols/awareness` to broadcast cursor positions, selections, and user metadata (name, color).

### Error Codes (WS Close Codes)
- `4001`: Unauthorized (Invalid Clerk token or inactive membership).
- `4003`: Room Full (Capacity limit reached).
- `4004`: Planet Not Found.
- `4008`: Policy Violation (Message too large or invalid).
