import { z } from "zod";
import { SidebarNavItemSchema } from "./sidebarNav";

// Static, year-independent content for a college's placement page: MoUs, the
// "Why Recruit at JCT" pitch, the placement process, and TPO contacts. The
// year-wise numbers/recruiters/students live on the Placement model instead —
// this key only holds the copy that doesn't change every academic year.

const s = (max: number) => z.string().max(max).default("");

export const PLACEMENT_INFO_LIMITS = {
  mouItemsMax: 80,
  whyPointsMax: 12,
  processStepsMax: 15,
  contactsMax: 12,
  headingMax: 160,
  descriptionMax: 1500,
} as const;

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
      contacts: z
        .array(TpoContactSchema)
        .max(PLACEMENT_INFO_LIMITS.contactsMax)
        .default([]),
    })
    .default({
      heading: "",
      description: "",
      office: { address: "", phone: "", email: "" },
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
export type MouItemValue = z.infer<typeof MouItemSchema>;
export type WhyRecruitPointValue = z.infer<typeof WhyRecruitPointSchema>;
export type ProcessStepValue = z.infer<typeof ProcessStepSchema>;
export type TpoContactValue = z.infer<typeof TpoContactSchema>;
