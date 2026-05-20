import { z } from "zod";

// Strings ───────────────────────────────────────────────────────────────────
export function zClampedString(min: number, max: number, label?: string) {
  const fieldName = label ?? "Field";
  return z
    .string()
    .min(
      min,
      `${fieldName} must be at least ${min} character${min === 1 ? "" : "s"}`,
    )
    .max(max, `${fieldName} must be at most ${max} characters`);
}

export const zRequiredString = (label?: string, max = 200) =>
  zClampedString(1, max, label);

export const zOptionalString = (max: number) =>
  z
    .string()
    .max(max, `Must be at most ${max} characters`)
    .optional()
    .or(z.literal(""));

// Identifiers ───────────────────────────────────────────────────────────────
export const zSlug = z
  .string()
  .min(1, "Slug is required")
  .max(80, "Slug must be at most 80 characters")
  .regex(
    /^[a-z0-9-]+$/,
    "Slug may contain lowercase letters, numbers, and dashes only",
  );

export const zEmail = z
  .string()
  .min(1, "Email is required")
  .email("Must be a valid email address")
  .max(200);

// URLs accept absolute http(s) URLs, root-relative paths, fragment-only
// anchors (#section), or stored R2 storage keys. Empty strings are allowed
// because the admin UI uses "" as the unset sentinel.
export const zUrl = z
  .string()
  .max(500, "URL must be at most 500 characters")
  .refine(
    (v) =>
      v === "" ||
      /^https?:\/\//i.test(v) ||
      v.startsWith("/") ||
      v.startsWith("#") ||
      /^[a-z0-9][a-z0-9/_.-]*$/i.test(v),
    "Must be an http(s) URL, a root-relative path, or a storage key",
  );

export const zRequiredUrl = zUrl.refine((v) => v.length > 0, "Required");

export const zHexColor = z
  .string()
  .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Must be a hex color like #0F4C81")
  .or(z.literal(""));

// Numbers ───────────────────────────────────────────────────────────────────
export const zNonNegativeInt = z
  .number()
  .int("Must be a whole number")
  .nonnegative("Must be zero or positive");

export const zPositiveInt = z
  .number()
  .int("Must be a whole number")
  .positive("Must be a positive number");

// Auth ──────────────────────────────────────────────────────────────────────
export const zPasswordMin8 = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(200, "Password is too long");

// Image reference ──────────────────────────────────────────────────────────
// The admin UI stores images as bare storage keys / URLs (string), but we
// also accept structured refs going forward. Use this for new code; keep
// callers passing plain strings working via zUrl above.
export const zImageRef = z.object({
  url: zUrl,
  alt: z.string().max(200).optional(),
  id: z.string().max(100).optional(),
});

// Generic Enum helper that preserves literal types and yields a friendly
// error message on failure.
export function zEnum<const T extends readonly [string, ...string[]]>(
  values: T,
) {
  return z.enum(values, {
    error: () => `Must be one of: ${values.join(", ")}`,
  });
}

// Shared CTA shape (used by every hero/announcement form)
export const zCta = z.object({
  label: zClampedString(1, 40, "CTA label"),
  href: zRequiredUrl,
  primary: z.boolean().optional().default(false),
});

export type Cta = z.infer<typeof zCta>;
