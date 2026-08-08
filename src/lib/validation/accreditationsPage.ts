import { z } from "zod";

// ──────────────────────────────────────────────────────────────────────────
// Standalone Accreditation pages — one per institution plus an overall "main"
// page. Each is backed by its own SiteConfig key (see SITE_CONFIG_SCHEMAS):
// mainAccreditations / engineeringAccreditations / artsScienceAccreditations /
// polytechnicAccreditations. All four share this single schema shape, the same
// way the About pages reuse one shape.
//
// This is distinct from the simple `accreditations` logo carousel
// (siteInfo.ts / AccreditationsSchema) shown on the home + hero — that stays
// as-is; this schema powers the full dedicated pages.
// ──────────────────────────────────────────────────────────────────────────

export const ACCREDITATIONS_PAGE_LIMITS = {
  heroTitleMax: 200,
  heroSubtitleMax: 500,
  introParagraphMax: 2000,
  introItemsMax: 8,
  nameMax: 120,
  fullNameMax: 200,
  logoMax: 500,
  gradeMax: 60,
  descriptionMax: 1000,
  accreditedByMax: 200,
  validMax: 20,
  certificateMax: 500,
  certificateLabelMax: 120,
  detailHrefMax: 300,
  itemsMax: 40,
} as const;

const s = (max: number) => z.string().max(max).default("");

const AccreditationItemSchema = z.object({
  name: s(ACCREDITATIONS_PAGE_LIMITS.nameMax), // "NAAC", "NBA"
  fullName: s(ACCREDITATIONS_PAGE_LIMITS.fullNameMax), // optional expansion
  logo: s(ACCREDITATIONS_PAGE_LIMITS.logoMax), // storage key / URL
  grade: s(ACCREDITATIONS_PAGE_LIMITS.gradeMax), // "A+", "CGPA 3.51"
  description: s(ACCREDITATIONS_PAGE_LIMITS.descriptionMax),
  accreditedBy: s(ACCREDITATIONS_PAGE_LIMITS.accreditedByMax), // issuing body
  validFrom: s(ACCREDITATIONS_PAGE_LIMITS.validMax), // "2022"
  validTo: s(ACCREDITATIONS_PAGE_LIMITS.validMax), // "2027"
  certificate: s(ACCREDITATIONS_PAGE_LIMITS.certificateMax), // storage doc key / URL
  certificateLabel: s(ACCREDITATIONS_PAGE_LIMITS.certificateLabelMax),
  // Optional dedicated page for this accreditation, e.g.
  // "/institutions/engineering/naac". Blank renders the card without a
  // "View …" link — there is no implicit route mapping.
  detailHref: s(ACCREDITATIONS_PAGE_LIMITS.detailHrefMax),
});

export type AccreditationItemValue = z.infer<typeof AccreditationItemSchema>;

export const AccreditationsPageSchema = z.object({
  hero: z
    .object({
      title: s(ACCREDITATIONS_PAGE_LIMITS.heroTitleMax),
      subtitle: s(ACCREDITATIONS_PAGE_LIMITS.heroSubtitleMax),
    })
    .default({ title: "", subtitle: "" }),
  intro: z
    .array(s(ACCREDITATIONS_PAGE_LIMITS.introParagraphMax))
    .max(ACCREDITATIONS_PAGE_LIMITS.introItemsMax)
    .default([]),
  items: z
    .array(AccreditationItemSchema)
    .max(ACCREDITATIONS_PAGE_LIMITS.itemsMax)
    .default([]),
});

export type AccreditationsPageValue = z.infer<typeof AccreditationsPageSchema>;
