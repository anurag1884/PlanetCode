// ============================================================
// PlanetCode — API: Access Requests for a Planet
// File: apps/web/src/app/api/planets/[id]/requests/route.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/API_AND_REALTIME.md for endpoint specification
// ============================================================

// POST /api/planets/:id/requests — Submit access request
// GET  /api/planets/:id/requests — List access requests (owner only)
//
// Auth chain (§8): Clerk auth → user lookup → planet exists
// POST: Any authenticated user can request (rate-limited §21)
// GET: Owner only — returns PENDING requests

export async function GET() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}

export async function POST() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
