// ============================================================
// PlanetCode — Zod Validators: Planet
// File: packages/validators/src/planet.ts
// ============================================================

import { z } from "zod";

// Planet code format: PLN-XXXXXX (6 uppercase alphanumeric chars)
export const PLANET_CODE_REGEX = /^PLN-[A-Z0-9]{6}$/;

export const planetCodeSchema = z
  .string()
  .regex(PLANET_CODE_REGEX, "Invalid planet code format (expected PLN-XXXXXX)");

export const planetNameSchema = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be at most 50 characters");

export const planetPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters");

export const createPlanetSchema = z.object({
  name: planetNameSchema,
  description: z.string().trim().max(200, "Description too long").optional(),
  password: planetPasswordSchema,
});

export const updatePlanetSchema = z.object({
  name: planetNameSchema.optional(),
  description: z.string().trim().max(200).optional(),
  password: planetPasswordSchema.optional(),
});

export const enterPlanetSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const planetIdParamSchema = z.object({
  id: z.string().cuid("Invalid planet ID"),
});

export type CreatePlanetInput = z.infer<typeof createPlanetSchema>;
export type UpdatePlanetInput = z.infer<typeof updatePlanetSchema>;
export type EnterPlanetInput = z.infer<typeof enterPlanetSchema>;

