// ============================================================
// PlanetCode — API: Reject Access Request
// File: apps/web/src/app/api/requests/[id]/reject/route.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/API_AND_REALTIME.md for endpoint specification
// ============================================================

// POST /api/requests/:id/reject — Owner rejects an access request
//
// Auth chain (§8): Clerk auth → user lookup → request exists → planet owner check
// Security: Do not leak whether a pending request exists (§7)

export async function POST() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
