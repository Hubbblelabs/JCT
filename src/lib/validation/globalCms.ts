import { z } from "zod";
import { zUrl, zClampedString, zOptionalString } from "./_primitives";

// ── Header ───────────────────────────────────────────────────────────────────
export const HEADER_LIMITS = {
  logoTextMax: 80,
  ctaLabelMax: 40,
  phoneMax: 40,
} as const;

export const HeaderSchema = z.object({
  logo: zUrl.optional().or(z.literal("")).default(""),
  logoText: zOptionalString(HEADER_LIMITS.logoTextMax).default(""),
  phone: zOptionalString(HEADER_LIMITS.phoneMax).default(""),
  applyLabel: zOptionalString(HEADER_LIMITS.ctaLabelMax).default(""),
  applyUrl: zUrl.optional().or(z.literal("")),
  studentLoginLabel: zOptionalString(HEADER_LIMITS.ctaLabelMax).default(""),
  studentLoginUrl: zUrl.optional().or(z.literal("")),
  showStudentLogin: z.boolean().optional().default(true),
});
export type HeaderValue = z.infer<typeof HeaderSchema>;

// ── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_LIMITS = {
  orgNameMax: 120,
  descriptionMax: 400,
  labelMax: 80,
  phoneMax: 40,
  emailMax: 200,
  addressLineMax: 200,
  addressLinesMax: 5,
  mapEmbedMax: 1000,
  legalLinksMax: 8,
  legalNameMax: 60,
  copyrightMax: 200,
} as const;

const LegalLinkSchema = z.object({
  name: zClampedString(0, FOOTER_LIMITS.legalNameMax, "Link name").default(""),
  href: zUrl.optional().or(z.literal("")),
});

export const FooterSchema = z.object({
  orgName: zOptionalString(FOOTER_LIMITS.orgNameMax).default(""),
  description: zOptionalString(FOOTER_LIMITS.descriptionMax).default(""),
  helplineLabel: zOptionalString(FOOTER_LIMITS.labelMax).default(""),
  phone: zOptionalString(FOOTER_LIMITS.phoneMax).default(""),
  email: zOptionalString(FOOTER_LIMITS.emailMax).default(""),
  admissionsEmail: zOptionalString(FOOTER_LIMITS.emailMax).default(""),
  addressLines: z
    .array(zClampedString(0, FOOTER_LIMITS.addressLineMax, "Address line"))
    .max(FOOTER_LIMITS.addressLinesMax)
    .optional()
    .default([]),
  mapEmbedUrl: z
    .string()
    .max(FOOTER_LIMITS.mapEmbedMax)
    .optional()
    .or(z.literal(""))
    .default(""),
  facebook: zUrl.optional().or(z.literal("")).default(""),
  instagram: zUrl.optional().or(z.literal("")).default(""),
  twitter: zUrl.optional().or(z.literal("")).default(""),
  linkedin: zUrl.optional().or(z.literal("")).default(""),
  youtube: zUrl.optional().or(z.literal("")).default(""),
  legalLinks: z
    .array(LegalLinkSchema)
    .max(FOOTER_LIMITS.legalLinksMax)
    .optional()
    .default([]),
  copyright: zOptionalString(FOOTER_LIMITS.copyrightMax).default(""),
});
export type FooterValue = z.infer<typeof FooterSchema>;
