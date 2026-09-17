// ============================================================
// PlanetCode — Zod Validators: File
// File: packages/validators/src/file.ts
// ============================================================

import { z } from "zod";

// Safe path: no traversal, no absolute, no null bytes, safe chars only
export const filePathSchema = z
  .string()
  .min(1, "Path is required")
  .max(500, "Path too long")
  .refine((p) => !p.includes(".."), "Path traversal not allowed")
  .refine((p) => !p.startsWith("/"), "Absolute paths not allowed")
  .refine((p) => !p.startsWith("\\"), "Absolute paths not allowed")
  .refine((p) => !p.includes("\0"), "Null bytes not allowed")
  .refine(
    (p) => /^[a-zA-Z0-9._\-/]+$/.test(p),
    "Path contains invalid characters",
  );

export const createFileSchema = z.object({
  path: filePathSchema,
  name: z.string().trim().min(1, "File name required").max(255),
  language: z.string().max(50).optional(),
  content: z
    .string()
    .max(1_000_000, "File content exceeds 1MB limit")
    .optional()
    .default(""),
});

export const updateFileSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  path: filePathSchema.optional(),
  content: z.string().max(1_000_000, "File content exceeds 1MB limit").optional(),
  language: z.string().max(50).optional(),
});

export const fileIdParamSchema = z.object({
  id: z.string().cuid("Invalid file ID"),
});

export type CreateFileInput = z.infer<typeof createFileSchema>;
export type UpdateFileInput = z.infer<typeof updateFileSchema>;

