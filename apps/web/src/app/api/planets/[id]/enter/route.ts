// ============================================================
// PlanetCode — API: Enter Planet
// File: apps/web/src/app/api/planets/[id]/enter/route.ts
// Status: PLACEHOLDER — not yet implemented
// See: docs/API_AND_REALTIME.md for endpoint specification
// ============================================================

// POST /api/planets/:id/enter — Verify planet password to enter
//
// Auth chain (§8): Clerk auth → user lookup → planet exists → membership ACTIVE
// Password: bcrypt.compare(submitted, stored hash) — rate-limited (§5, §21)
// Response: Never distinguish "wrong password" vs "planet not found" (§5)

export async function POST() {
  return Response.json({ message: "Not implemented" }, { status: 501 });
}
