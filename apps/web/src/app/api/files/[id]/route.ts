// ============================================================
// PlanetCode — API: File (Single)
// File: apps/web/src/app/api/files/[id]/route.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/API_AND_REALTIME.md for endpoint specification
// ============================================================

// PATCH  /api/files/:id — Update file (rename, move, update content)
// DELETE /api/files/:id — Delete file
//
// Auth chain (§8): Clerk auth → user lookup → file exists → planet membership ACTIVE
// Path validation (§14): Reject traversal on rename/move
// Conflict rules (§14): Handle delete+edit race, rename+edit race

export async function PATCH() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}

export async function DELETE() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
