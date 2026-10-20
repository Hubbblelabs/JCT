import { z } from "zod";
import { zEmail, zEnum, zPasswordMin8, zClampedString } from "./_primitives";

export const ROLES = ["admin", "editor"] as const;
export const INSTITUTIONS = [
  "all",
  "engineering",
  "arts-science",
  "polytechnic",
] as const;

export const LIMITS = {
  fullNameMax: 120,
  programsMax: 30,
  programSlugMax: 60,
} as const;

const programsArray = z
  .array(
    z
      .string()
      .min(1)
      .max(LIMITS.programSlugMax)
      .regex(/^[a-z0-9-]+$/i, "Program slug must be letters/numbers/dashes"),
  )
  .max(LIMITS.programsMax);

export const UserCreateSchema = z
  .object({
    email: zEmail,
    password: zPasswordMin8,
    full_name: zClampedString(1, LIMITS.fullNameMax, "Full name"),
    role: zEnum(ROLES).optional().default("editor"),
    institution: zEnum(INSTITUTIONS).optional().default("all"),
    programs: programsArray.optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.role === "editor" && data.institution === "all") {
      ctx.addIssue({
        code: "custom",
        path: ["institution"],
        message: "Editors must be assigned to a specific college",
      });
    }
    if (data.role === "admin") {
      // Silently normalise — API will store "all" regardless
    }
  });

export const UserUpdateSchema = z
  .object({
    full_name: zClampedString(1, LIMITS.fullNameMax, "Full name").optional(),
    role: zEnum(ROLES).optional(),
    institution: zEnum(INSTITUTIONS).optional(),
    programs: programsArray.optional(),
    is_active: z.boolean().optional(),
    password: zPasswordMin8.optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.role === "editor" && data.institution === "all") {
      ctx.addIssue({
        code: "custom",
        path: ["institution"],
        message: "Editors must be assigned to a specific college",
      });
    }
  });

/**
 * A signed-in user changing their own password. The current one is required
 * so a session left open on a shared machine can't be turned into a takeover.
 */
export const PasswordChangeSchema = z
  .object({
    current_password: z
      .string()
      .min(1, "Enter your current password")
      .max(200, "Password is too long"),
    new_password: zPasswordMin8,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.current_password === data.new_password) {
      ctx.addIssue({
        code: "custom",
        path: ["new_password"],
        message: "The new password must be different from the current one",
      });
    }
  });

export type UserCreateValue = z.infer<typeof UserCreateSchema>;
export type UserUpdateValue = z.infer<typeof UserUpdateSchema>;
export type PasswordChangeValue = z.infer<typeof PasswordChangeSchema>;
