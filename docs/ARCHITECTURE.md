# Architecture Document

## 1. System Overview
PlanetCode consists of two primary applications and a shared database, organized in a Turborepo monorepo:
1. **Next.js Web App (`apps/web`):** Handles UI, Clerk authentication, REST API, and DB interactions for standard HTTP requests.
2. **Node.js Realtime Server (`apps/realtime`):** Handles WebSocket connections, Yjs document synchronization, and awareness.
3. **PostgreSQL Database:** The single source of truth for users, memberships, planets, files, and Yjs document snapshots.

## 2. High-Level Architecture Diagram
```mermaid
graph TD
    Client[Browser (Monaco + Yjs)]
    Next[Next.js App (Web UI & API)]
    RT[Node.js Realtime Server (WS)]
    DB[(PostgreSQL)]
    Clerk[Clerk Auth]

    Client -- "HTTP/REST" --> Next
    Client -- "WebSocket" --> RT
    Client -- "Auth Tokens" --> Clerk
    Next -- "Verify Token" --> Clerk
    Next -- "Prisma" --> DB
    RT -- "Verify Token" --> Clerk
    RT -- "Prisma (Authz, Snapshots)" --> DB
```

## 3. Component Details

### 3.1 Frontend (`apps/web`)
- **Next.js App Router:** Renders the dashboard and editor workspace.
- **Monaco Editor + Yjs:** Local edits are captured by Monaco, mapped to Yjs data structures via `y-monaco`, and synced to the realtime server via `y-websocket`.

### 3.2 Backend API (`apps/web/src/app/api`)
- Handles Planet creation, file CRUD, and membership requests.
- All routes validate inputs via Zod and perform strict authorization checks against PostgreSQL.

### 3.3 Realtime Server (`apps/realtime`)
- Built on `ws`.
- **Connection Flow:** Extracts Clerk token from handshake, verifies it, checks DB for `ACTIVE` membership, and atomically enforces the 5-user capacity limit.
- **Rooms:** Each Planet is a `Room` containing a `Y.Doc`.
- **Persistence:** Periodically (and on shutdown/leave), the server encodes the `Y.Doc` state and saves it to PostgreSQL (`DocumentSnapshot`).

## 4. Design Decisions
- **Single Realtime Process (MVP):** Avoids Redis dependency. Capacity locks and room states are in-memory, backed by DB snapshots.
- **Database Content Storage:** File contents are stored in a `TEXT` column in Postgres for simplicity, avoiding external object storage like S3 for the MVP.
- **Shared Packages:** Database schema, types, and Zod validators are abstracted into Turborepo packages (`packages/db`, `packages/types`, `packages/validators`) to guarantee consistency across the Web and Realtime apps.
