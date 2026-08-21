# Product Requirements Document (PRD)

## 1. Vision & Purpose
PlanetCode is a secure, browser-based, real-time collaborative code editor. It enables small teams (up to 5 concurrent users) to edit the same codebase simultaneously in a private "Planet" with real-time presence, cursors, and state synchronization.

## 2. Target Audience
- Small developer teams needing quick collaborative sessions.
- Educators doing pair programming or code reviews.
- Interviewers conducting technical assessments.

## 3. Key User Flows
1. **Authentication:** User logs in via Clerk.
2. **Planet Creation:** User creates a Planet, sets a name, and assigns a password (bcrypt hashed).
3. **Joining a Planet:**
   - A user requests access.
   - The owner approves the request, creating an `ACTIVE` membership.
   - The user enters the Planet using the password.
4. **Collaboration:**
   - Up to 5 users edit files simultaneously.
   - Users see live cursors, online status, and connection states.
   - Changes are synchronized incrementally via Yjs.
5. **Reconnection:** If a user drops, the client automatically reconnects and synchronizes missed changes.

## 4. Key Features & Prioritization (MVP)
1. **Real-time Collaboration (P0):** Monaco Editor + Yjs + WebSockets.
2. **Authentication & Authorization (P0):** Clerk auth + DB membership checks.
3. **Room Capacity (P0):** Strictly 5 concurrent users, race-condition safe.
4. **Persistence (P1):** Yjs state snapshots to PostgreSQL.
5. **Reconnection (P1):** Robust WebSocket reconnection.
6. **File Management (P1):** Basic CRUD for files with path traversal protection.

## 5. Non-Goals (MVP)
- No code execution/runner functionality.
- No complex dashboards or detailed analytics.
- No distributed realtime servers (single Node.js process is sufficient).
- No viewer/spectator mode (only editors are supported).

## 6. Success Criteria
A successful session involves:
- User creates a Planet.
- Another user requests and receives access.
- Both users join the room.
- Real-time edits sync reliably with cursors visible.
- Reconnection recovers state correctly.
- A 6th active user attempting to connect is reliably rejected.
