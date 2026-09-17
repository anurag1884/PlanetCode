// ============================================================
// PlanetCode — Zod Validators: Member
// File: packages/validators/src/member.ts
// ============================================================

import { z } from "zod";

export const memberRoleSchema = z.enum(["OWNER", "MEMBER"]);
export const memberStatusSchema = z.enum(["ACTIVE", "REMOVED"]);

export const removeMemberSchema = z.object({
  memberId: z.string().cuid("Invalid member ID"),
});

export type MemberRoleInput = z.infer<typeof memberRoleSchema>;
export type MemberStatusInput = z.infer<typeof memberStatusSchema>;
export type RemoveMemberInput = z.infer<typeof removeMemberSchema>;

