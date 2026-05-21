import { z } from "zod";
import { zUrl, zClampedString, zOptionalString } from "./_primitives";

// ── Header ───────────────────────────────────────────────────────────────────
// Admin-managed header content is limited to the phone number and the
// Student Login button; everything else in the header is fixed chrome.
export const HEADER_LIMITS = {
  ctaLabelMax: 40,
  phoneMax: 40,
} as const;

export const HeaderSchema = z.object({
  phone: zOptionalString(HEADER_LIMITS.phoneMax).default(""),
  studentLoginLabel: zOptionalString(HEADER_LIMITS.ctaLabelMax).default(""),
  studentLoginUrl: zUrl.optional().or(z.literal("")),
  showStudentLogin: z.boolean().optional().default(true),
});
export type HeaderValue = z.infer<typeof HeaderSchema>;

// ── Footer ───────────────────────────────────────────────────────────────────
// Admin-managed footer content is limited to the admissions helpline box,
// the Contact Us column, and the social links.
export const FOOTER_LIMITS = {
  labelMax: 80,
  phoneMax: 40,
  emailMax: 200,
  addressLineMax: 200,
  addressLinesMax: 5,
} as const;

export const FooterSchema = z.object({
  // Admissions helpline box
  helplineLabel: zOptionalString(FOOTER_LIMITS.labelMax).default(""),
  phone: zOptionalString(FOOTER_LIMITS.phoneMax).default(""),
  admissionsEmail: zOptionalString(FOOTER_LIMITS.emailMax).default(""),
  // Contact Us column
  email: zOptionalString(FOOTER_LIMITS.emailMax).default(""),
  addressLines: z
    .array(zClampedString(0, FOOTER_LIMITS.addressLineMax, "Address line"))
    .max(FOOTER_LIMITS.addressLinesMax)
    .optional()
    .default([]),
  // Social links
  facebook: zUrl.optional().or(z.literal("")).default(""),
  instagram: zUrl.optional().or(z.literal("")).default(""),
  twitter: zUrl.optional().or(z.literal("")).default(""),
  linkedin: zUrl.optional().or(z.literal("")).default(""),
  youtube: zUrl.optional().or(z.literal("")).default(""),
});
export type FooterValue = z.infer<typeof FooterSchema>;
