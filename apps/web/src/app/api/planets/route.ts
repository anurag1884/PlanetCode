// ============================================================
// PlanetCode — API: Planets (Collection)
// File: apps/web/src/app/api/planets/route.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/API_AND_REALTIME.md for endpoint specification
// ============================================================

// POST /api/planets — Create a new Planet
// GET  /api/planets — List user's Planets (owned + member of)
//
// Auth chain (§8): Clerk auth → user lookup → Zod validate → execute
// Security: bcrypt hash planet password before storing (§5)

export async function GET() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}

export async function POST() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
