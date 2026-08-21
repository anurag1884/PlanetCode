// ============================================================
// PlanetCode — API: Files for a Planet
// File: apps/web/src/app/api/planets/[id]/files/route.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/API_AND_REALTIME.md for endpoint specification
// ============================================================

// GET  /api/planets/:id/files — List files in a Planet
// POST /api/planets/:id/files — Create a new file in a Planet
//
// Auth chain (§8): Full chain including ACTIVE membership
// Path validation (§14): Reject traversal, canonicalize paths
// Limits (§24): Enforce max files per planet, max file size

export async function GET() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}

export async function POST() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
