# 🪐 PlanetCode

**A secure, browser-based, real-time collaborative code editor.**

Build private coding rooms ("Planets") where up to 5 users can simultaneously edit code with live cursors, presence awareness, and seamless reconnection — all powered by Monaco Editor, Yjs CRDTs, and WebSockets.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS, shadcn/ui |
| Editor | Monaco Editor |
| Auth | Clerk |
| Backend | Next.js Route Handlers, Node.js |
| Database | PostgreSQL + Prisma ORM |
| Validation | Zod |
| Realtime CRDT | Yjs |
| Realtime Transport | WebSocket (ws package) |
| Presence | Yjs Awareness |
| Package Manager | pnpm |
| Monorepo | Turborepo |
| Testing | Vitest (unit) + Playwright (e2e) |
| Monitoring | Sentry |

---

## Monorepo Structure

```
PlanetCode/
├── apps/
│   ├── web/          # Next.js frontend + REST API
│   └── realtime/     # Node.js WebSocket + Yjs server
├── packages/
│   ├── db/           # Prisma schema + client (shared)
│   ├── validators/   # Zod schemas (shared)
│   ├── types/        # TypeScript types (shared)
│   └── config/       # Shared TS/ESLint configs
└── docs/             # Project documentation
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- PostgreSQL (local or hosted — Neon/Supabase)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url> && cd PlanetCode

# 2. Install dependencies
pnpm install

# 3. Copy environment variables
cp .env.example .env

# 4. Fill in your .env values (Clerk keys, DATABASE_URL, etc.)

# 5. Generate Prisma client
pnpm db:generate

# 6. Push database schema
pnpm db:push

# 7. Start development servers
pnpm dev
```

---

## Documentation

| Document | Description |
|---|---|
| [PRD](docs/PRD.md) | Product Requirements Document |
| [SRS](docs/SRS.md) | Software Requirements Specification |
| [Architecture](docs/ARCHITECTURE.md) | System architecture & data flow |
| [Security](docs/SECURITY.md) | Security policies & hardening |
| [Database](docs/DATABASE.md) | Schema design & data model |
| [API & Realtime](docs/API_AND_REALTIME.md) | REST API + WebSocket protocol |

---

## License

[MIT](LICENSE)
