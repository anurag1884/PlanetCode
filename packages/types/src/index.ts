// ============================================================
// PlanetCode — Shared TypeScript Types
// File: packages/types/src/index.ts
// ============================================================

// ─── Enums ─────────────────────────────────────────────────

export type MemberRole = "OWNER" | "MEMBER";
export type MemberStatus = "ACTIVE" | "REMOVED";
export type AccessRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

// ─── Core Domain Models ─────────────────────────────────────
// NOTE: passwordHash intentionally EXCLUDED from Planet — never send to client

export interface User {
  id: string;
  clerkId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Planet {
  id: string;
  planetCode: string;
  name: string;
  description: string | null;
  ownerId: string;
  maxEditors: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlanetMember {
  id: string;
  planetId: string;
  userId: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: Date;
}

export interface AccessRequest {
  id: string;
  planetId: string;
  userId: string;
  status: AccessRequestStatus;
  createdAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
}

export interface PlanetFile {
  id: string;
  planetId: string;
  path: string;
  name: string;
  language: string | null;
  mimeType: string | null;
  content: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── WebSocket Close Codes ──────────────────────────────────

export const WS_CLOSE_CODES = {
  UNAUTHORIZED: 4001,
  ROOM_FULL: 4003,
  PLANET_NOT_FOUND: 4004,
  POLICY_VIOLATION: 4008,
} as const;

export type WsCloseCode = (typeof WS_CLOSE_CODES)[keyof typeof WS_CLOSE_CODES];

// ─── API Response Types ─────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Presence / Awareness Types ─────────────────────────────

export interface UserPresence {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  /** Hex color assigned to this user for cursor rendering */
  color: string;
  cursor?: {
    lineNumber: number;
    column: number;
  };
  selection?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
}

