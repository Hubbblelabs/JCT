import { z } from "zod";
import { zEmail, zEnum, zPasswordMin8, zClampedString } from "./_primitives";

export const ROLES = ["viewer", "editor", "admin", "super_admin"] as const;
export const INSTITUTIONS = ["all", "engineering", "arts-science", "polytechnic"] as const;

export const LIMITS = {
  fullNameMax: 120,
  departmentsMax: 30,
  departmentSlugMax: 60,
} as const;

const departmentsArray = z
  .array(
    z
      .string()
      .min(1)
      .max(LIMITS.departmentSlugMax)
      .regex(/^[a-z0-9-]+$/i, "Department slug must be letters/numbers/dashes"),
  )
  .max(LIMITS.departmentsMax);

export const UserCreateSchema = z.object({
  email: zEmail,
  password: zPasswordMin8,
  full_name: zClampedString(1, LIMITS.fullNameMax, "Full name"),
  role: zEnum(ROLES).optional().default("editor"),
  institution: zEnum(INSTITUTIONS).optional().default("all"),
  departments: departmentsArray.optional().default([]),
});

export const UserUpdateSchema = z
  .object({
    full_name: zClampedString(1, LIMITS.fullNameMax, "Full name").optional(),
    role: zEnum(ROLES).optional(),
    institution: zEnum(INSTITUTIONS).optional(),
    departments: departmentsArray.optional(),
    is_active: z.boolean().optional(),
    password: zPasswordMin8.optional(),
  })
  .strict();

export type UserCreateValue = z.infer<typeof UserCreateSchema>;
export type UserUpdateValue = z.infer<typeof UserUpdateSchema>;
