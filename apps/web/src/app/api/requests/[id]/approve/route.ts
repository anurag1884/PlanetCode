// ============================================================
// PlanetCode — API: Approve Access Request
// File: apps/web/src/app/api/requests/[id]/approve/route.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/API_AND_REALTIME.md for endpoint specification
// ============================================================

// POST /api/requests/:id/approve — Owner approves an access request
//
// Auth chain (§8): Clerk auth → user lookup → request exists → planet owner check
// Side effects: Create PlanetMember (ACTIVE) for the requester (§7)

export async function POST() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
