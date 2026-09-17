// ============================================================
// PlanetCode — Zod Validators: Access Request
// File: packages/validators/src/access-request.ts
// ============================================================

import { z } from "zod";

export const accessRequestStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const createAccessRequestSchema = z.object({
  planetId: z.string().cuid("Invalid planet ID"),
});

export const reviewAccessRequestSchema = z.object({
  requestId: z.string().cuid("Invalid request ID"),
});

export type AccessRequestStatusInput = z.infer<typeof accessRequestStatusSchema>;
export type CreateAccessRequestInput = z.infer<typeof createAccessRequestSchema>;
export type ReviewAccessRequestInput = z.infer<typeof reviewAccessRequestSchema>;

