// ============================================================
// PlanetCode — API Client Helpers
// File: apps/web/src/lib/api.ts
// ============================================================

import type { ApiResponse } from "@planetcode/types";

/**
 * Typed fetch wrapper.
 * - Automatically sends the Clerk session token from the Authorization header.
 * - Returns a typed ApiResponse<T>.
 * - Centralizes error parsing — never exposes raw server errors to UI.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<ApiResponse<T>> {
  const { token, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const res = await fetch(`/api${path}`, {
      ...fetchOptions,
      headers,
    });

    const json = (await res.json()) as unknown;

    if (!res.ok) {
      return {
        success: false,
        error: (json as { message?: string }).message ?? "An error occurred",
        statusCode: res.status,
      };
    }

    return { success: true, data: json as T };
  } catch {
    return {
      success: false,
      error: "Network error — please check your connection",
      statusCode: 0,
    };
  }
}

