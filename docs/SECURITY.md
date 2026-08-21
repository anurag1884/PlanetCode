# Security Policies & Hardening

## 1. Threat Model & Mitigations
- **Unauthorized Access:** Mitigated by Clerk session verification on both REST API and WebSocket connections.
- **Brute Force Planet Entry:** Mitigated by rate-limiting password attempts and using bcrypt hashing. Generic error messages prevent enumeration.
- **Path Traversal:** File paths are canonicalized and validated server-side. No absolute paths or `../` are permitted.
- **Malicious Payloads:** All inputs (REST and WS) are validated using strict Zod schemas. Maximum file and message sizes are enforced.
- **Data Leakage:** Strict policies against logging secrets, returning raw server errors, or exposing passwords.

## 2. Authorization Chain
Every protected operation must verify:
1. Clerk authentication is valid.
2. Clerk ID maps to a known application user.
3. The target Planet exists.
4. The user has a `PlanetMember` record for the Planet.
5. The membership `status` is `ACTIVE`.
6. The user has the appropriate `role` (e.g., OWNER required for deletion).

## 3. Secret Management
- **Never Commit Secrets:** `.env` is gitignored. CI enforces Gitleaks scanning.
- **Client Exposure:** Only `NEXT_PUBLIC_*` variables are exposed to the browser. `DATABASE_URL` and `CLERK_SECRET_KEY` are strictly server-side.
- **Planet Passwords:** Stored ONLY as bcrypt hashes. Never logged.

## 4. WebSocket Security
- The WebSocket handshake MUST include a valid Clerk session token.
- The server NEVER trusts client-supplied `userId` or `role` fields.
- Removed members are forcibly disconnected: the server closes the socket immediately upon status change to `REMOVED`.

## 5. Web Security Headers
Next.js is configured to emit:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- (Future) Content Security Policy (CSP) and HSTS.
