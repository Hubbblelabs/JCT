import { z } from "zod";
import { SidebarNavItemSchema } from "./sidebarNav";

// Static, year-independent content for a college's placement page: MoUs, the
// "Why Recruit at JCT" pitch, the placement process, and TPO contacts. The
// year-wise numbers/recruiters/students live on the Placement model instead —
// this key only holds the copy that doesn't change every academic year.

const s = (max: number) => z.string().max(max).default("");

export const PLACEMENT_INFO_LIMITS = {
  // Posters are published per drive/department, so a college accumulates a
  // wall of them rather than a single banner — the Polytechnic's placed-student
  // sheets alone run to twenty.
  bannerImagesMax: 24,
  mouItemsMax: 80,
  whyPointsMax: 12,
  processStepsMax: 15,
  // A college's placement cell is one director plus a per-department
  // coordinator, so the list runs well past a handful of officers.
  contactsMax: 40,
  headingMax: 160,
  descriptionMax: 1500,
} as const;

// A poster-style image published at the top of the page (e.g. the annual
// "Distinguished Alumni" sheet). Shape is deliberately free — these are
// designed artwork, so the ratio is whatever the college's design team used.
const BannerImageSchema = z.object({
  image: s(500),
  alt: s(200),
  caption: s(300),
  href: s(500),
});

const MouItemSchema = z.object({
  organization: s(160),
  logo: s(500),
  purpose: s(800),
  signedOn: s(40),
  validity: s(40),
  href: s(500),
});

const WhyRecruitPointSchema = z.object({
  title: s(140),
  desc: s(800),
});

const ProcessStepSchema = z.object({
  title: s(140),
  desc: s(800),
});

const TpoContactSchema = z.object({
  name: s(140),
  designation: s(140),
  phone: s(60),
  email: s(150),
  image: s(500),
});

export const PlacementInfoSchema = z.object({
  banner: z
    .object({
      heading: s(PLACEMENT_INFO_LIMITS.headingMax),
      description: s(PLACEMENT_INFO_LIMITS.descriptionMax),
      images: z
        .array(BannerImageSchema)
        .max(PLACEMENT_INFO_LIMITS.bannerImagesMax)
        .default([]),
    })
    .default({ heading: "", description: "", images: [] }),
  mou: z
    .object({
      heading: s(PLACEMENT_INFO_LIMITS.headingMax),
      description: s(PLACEMENT_INFO_LIMITS.descriptionMax),
      items: z
        .array(MouItemSchema)
        .max(PLACEMENT_INFO_LIMITS.mouItemsMax)
        .default([]),
    })
    .default({ heading: "", description: "", items: [] }),
  whyRecruit: z
    .object({
      heading: s(PLACEMENT_INFO_LIMITS.headingMax),
      description: s(PLACEMENT_INFO_LIMITS.descriptionMax),
      points: z
        .array(WhyRecruitPointSchema)
        .max(PLACEMENT_INFO_LIMITS.whyPointsMax)
        .default([]),
    })
    .default({ heading: "", description: "", points: [] }),
  tpo: z
    .object({
      heading: s(PLACEMENT_INFO_LIMITS.headingMax),
      description: s(PLACEMENT_INFO_LIMITS.descriptionMax),
      office: z
        .object({
          address: s(400),
          phone: s(60),
          email: s(150),
        })
        .default({ address: "", phone: "", email: "" }),
      // Officer photos are optional in practice — when the college has none
      // (or doesn't want them public), turning this off drops the avatar
      // column instead of filling the cards with monograms.
      showPhotos: z.boolean().default(true),
      contacts: z
        .array(TpoContactSchema)
        .max(PLACEMENT_INFO_LIMITS.contactsMax)
        .default([]),
    })
    .default({
      heading: "",
      description: "",
      office: { address: "", phone: "", email: "" },
      showPhotos: true,
      contacts: [],
    }),
  process: z
    .object({
      heading: s(PLACEMENT_INFO_LIMITS.headingMax),
      description: s(PLACEMENT_INFO_LIMITS.descriptionMax),
      steps: z
        .array(ProcessStepSchema)
        .max(PLACEMENT_INFO_LIMITS.processStepsMax)
        .default([]),
    })
    .default({ heading: "", description: "", steps: [] }),
  sidebar: z
    .object({
      navItems: z.array(SidebarNavItemSchema).optional(),
    })
    .default({ navItems: [] }),
});

export type PlacementInfoValue = z.infer<typeof PlacementInfoSchema>;
export type BannerImageValue = z.infer<typeof BannerImageSchema>;
export type MouItemValue = z.infer<typeof MouItemSchema>;
export type WhyRecruitPointValue = z.infer<typeof WhyRecruitPointSchema>;
export type ProcessStepValue = z.infer<typeof ProcessStepSchema>;
export type TpoContactValue = z.infer<typeof TpoContactSchema>;
