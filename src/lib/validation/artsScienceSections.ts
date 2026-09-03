import { z } from "zod";
import { zClampedString, zOptionalString, zUrl } from "./_primitives";

// Arts & Science landing-page sections that exist for that college alone:
// the Add-on Programs strip and the Career Development Centre grid. Both are
// plain SiteConfig keys (one object each) with hard caps so a runaway admin
// payload can't break the layout.

export const ADD_ON_PROGRAMS_LIMITS = {
  eyebrowMax: 60,
  titleMax: 120,
  titleHighlightMax: 120,
  descriptionMax: 400,
  groupsMax: 8,
  groupTitleMax: 120,
  groupIconMax: 40,
  groupDescMax: 300,
  itemsPerGroupMax: 20,
  itemMax: 120,
  ctaLabelMax: 40,
} as const;

export const AddOnProgramsSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: zOptionalString(ADD_ON_PROGRAMS_LIMITS.eyebrowMax).default(""),
  title: zOptionalString(ADD_ON_PROGRAMS_LIMITS.titleMax).default(""),
  titleHighlight: zOptionalString(
    ADD_ON_PROGRAMS_LIMITS.titleHighlightMax,
  ).default(""),
  description: zOptionalString(ADD_ON_PROGRAMS_LIMITS.descriptionMax).default(
    "",
  ),
  groups: z
    .array(
      z.object({
        icon: zOptionalString(ADD_ON_PROGRAMS_LIMITS.groupIconMax).default(""),
        title: zClampedString(
          0,
          ADD_ON_PROGRAMS_LIMITS.groupTitleMax,
          "Track title",
        ).default(""),
        description: zOptionalString(
          ADD_ON_PROGRAMS_LIMITS.groupDescMax,
        ).default(""),
        items: z
          .array(
            zClampedString(0, ADD_ON_PROGRAMS_LIMITS.itemMax, "Course").default(
              "",
            ),
          )
          .max(ADD_ON_PROGRAMS_LIMITS.itemsPerGroupMax)
          .default([]),
      }),
    )
    .max(ADD_ON_PROGRAMS_LIMITS.groupsMax)
    .default([]),
  ctaLabel: zOptionalString(ADD_ON_PROGRAMS_LIMITS.ctaLabelMax).default(""),
  ctaHref: zUrl.default(""),
});

export const CAREER_CENTRE_LIMITS = {
  eyebrowMax: 60,
  titleMax: 120,
  titleHighlightMax: 120,
  descriptionMax: 400,
  servicesMax: 12,
  serviceTitleMax: 120,
  serviceIconMax: 40,
  serviceDescMax: 300,
  ctaLabelMax: 40,
} as const;

export const CareerCentreSchema = z.object({
  enabled: z.boolean().default(true),
  eyebrow: zOptionalString(CAREER_CENTRE_LIMITS.eyebrowMax).default(""),
  title: zOptionalString(CAREER_CENTRE_LIMITS.titleMax).default(""),
  titleHighlight: zOptionalString(
    CAREER_CENTRE_LIMITS.titleHighlightMax,
  ).default(""),
  description: zOptionalString(CAREER_CENTRE_LIMITS.descriptionMax).default(""),
  services: z
    .array(
      z.object({
        icon: zOptionalString(CAREER_CENTRE_LIMITS.serviceIconMax).default(""),
        title: zClampedString(
          0,
          CAREER_CENTRE_LIMITS.serviceTitleMax,
          "Service title",
        ).default(""),
        description: zOptionalString(
          CAREER_CENTRE_LIMITS.serviceDescMax,
        ).default(""),
      }),
    )
    .max(CAREER_CENTRE_LIMITS.servicesMax)
    .default([]),
  ctaLabel: zOptionalString(CAREER_CENTRE_LIMITS.ctaLabelMax).default(""),
  ctaHref: zUrl.default(""),
});

export type AddOnProgramsValue = z.infer<typeof AddOnProgramsSchema>;
export type CareerCentreValue = z.infer<typeof CareerCentreSchema>;
