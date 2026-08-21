// ============================================================
// PlanetCode — API: Planet (Single)
// File: apps/web/src/app/api/planets/[id]/route.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/API_AND_REALTIME.md for endpoint specification
// ============================================================

// GET    /api/planets/:id — Get Planet details
// PATCH  /api/planets/:id — Update Planet (name, description, password)
// DELETE /api/planets/:id — Delete Planet (owner only)
//
// Auth chain (§8): Clerk auth → user lookup → planet exists → membership check → role check

export async function GET() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}

export async function PATCH() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}

export async function DELETE() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
