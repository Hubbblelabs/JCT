import { z } from "zod";
import { zClampedString, zOptionalString, zUrl } from "./_primitives";

export const CAMPUS_LIFE_LIMITS = {
  titleMax: 120,
  subtitleMax: 300,
  bodyMax: 800,
  eyebrowMax: 60,
  featureMax: 6,
  featureTitleMax: 60,
  featureDescMax: 200,
  highlightMax: 12,
  highlightTitleMax: 60,
  serviceMax: 6,
  serviceTitleMax: 80,
  serviceDescMax: 300,
  servicePointMax: 5,
  servicePointTextMax: 100,
  sportStatMax: 6,
  sportStatLabelMax: 60,
  sportStatValMax: 40,
  sportImageMax: 4,
  tagMax: 8,
  tagLabelMax: 40,
  eventMax: 6,
  eventTitleMax: 80,
  eventDescMax: 300,
  ctaTitleMax: 120,
  ctaDescMax: 300,
  ctaLabelMax: 50,
} as const;

const L = CAMPUS_LIFE_LIMITS;

const FeatureSchema = z.object({
  icon: zOptionalString(40).default(""),
  title: zClampedString(0, L.featureTitleMax, "Feature title").default(""),
  desc: zClampedString(0, L.featureDescMax, "Feature description").default(""),
});

const HighlightSchema = z.object({
  title: zClampedString(0, L.highlightTitleMax, "Highlight title").default(""),
  image: zUrl.default(""),
});

const ServiceSchema = z.object({
  title: zClampedString(0, L.serviceTitleMax, "Service title").default(""),
  desc: zClampedString(0, L.serviceDescMax, "Service description").default(""),
  image: zUrl.default(""),
  icon: zOptionalString(40).default(""),
  points: z
    .array(zClampedString(1, L.servicePointTextMax, "Point"))
    .max(L.servicePointMax)
    .default([]),
});

const SportStatSchema = z.object({
  label: zClampedString(0, L.sportStatLabelMax, "Stat label").default(""),
  val: zClampedString(0, L.sportStatValMax, "Stat value").default(""),
});

const ClubEventSchema = z.object({
  icon: zOptionalString(40).default(""),
  title: zClampedString(0, L.eventTitleMax, "Event title").default(""),
  description: zClampedString(0, L.eventDescMax, "Event description").default(
    "",
  ),
});

export const CampusLifePageSchema = z.object({
  hero: z
    .object({
      backgroundImage: zUrl.default(""),
      title: zClampedString(0, L.titleMax, "Hero title").default(""),
      subtitle: zClampedString(0, L.subtitleMax, "Hero subtitle").default(""),
    })
    .default({ backgroundImage: "", title: "", subtitle: "" }),

  experience: z
    .object({
      eyebrow: zClampedString(0, L.eyebrowMax, "Eyebrow").default(""),
      title: zClampedString(0, L.titleMax, "Title").default(""),
      titleHighlight: zClampedString(0, L.titleMax, "Title highlight").default(
        "",
      ),
      body: zClampedString(0, L.bodyMax, "Body").default(""),
      image: zUrl.default(""),
      features: z.array(FeatureSchema).max(L.featureMax).default([]),
    })
    .default({
      eyebrow: "",
      title: "",
      titleHighlight: "",
      body: "",
      image: "",
      features: [],
    }),

  highlights: z
    .object({
      items: z.array(HighlightSchema).max(L.highlightMax).default([]),
    })
    .default({ items: [] }),

  services: z
    .object({
      eyebrow: zClampedString(0, L.eyebrowMax, "Eyebrow").default(""),
      title: zClampedString(0, L.titleMax, "Title").default(""),
      subtitle: zClampedString(0, L.subtitleMax, "Subtitle").default(""),
      items: z.array(ServiceSchema).max(L.serviceMax).default([]),
    })
    .default({ eyebrow: "", title: "", subtitle: "", items: [] }),

  sports: z
    .object({
      eyebrow: zClampedString(0, L.eyebrowMax, "Eyebrow").default(""),
      title: zClampedString(0, L.titleMax, "Title").default(""),
      titleHighlight: zClampedString(0, L.titleMax, "Title highlight").default(
        "",
      ),
      body: zClampedString(0, L.bodyMax, "Body").default(""),
      stats: z.array(SportStatSchema).max(L.sportStatMax).default([]),
      images: z.array(zUrl).max(L.sportImageMax).default([]),
      highlightTitle: zClampedString(0, L.titleMax, "Highlight title").default(
        "",
      ),
      highlightDesc: zClampedString(
        0,
        L.subtitleMax,
        "Highlight description",
      ).default(""),
    })
    .default({
      eyebrow: "",
      title: "",
      titleHighlight: "",
      body: "",
      stats: [],
      images: [],
      highlightTitle: "",
      highlightDesc: "",
    }),

  clubs: z
    .object({
      eyebrow: zClampedString(0, L.eyebrowMax, "Eyebrow").default(""),
      title: zClampedString(0, L.titleMax, "Title").default(""),
      featuredImage: zUrl.default(""),
      featuredTitle: zClampedString(0, L.titleMax, "Featured title").default(
        "",
      ),
      featuredDesc: zClampedString(
        0,
        L.serviceDescMax,
        "Featured description",
      ).default(""),
      tags: z
        .array(zClampedString(1, L.tagLabelMax, "Tag"))
        .max(L.tagMax)
        .default([]),
      events: z.array(ClubEventSchema).max(L.eventMax).default([]),
    })
    .default({
      eyebrow: "",
      title: "",
      featuredImage: "",
      featuredTitle: "",
      featuredDesc: "",
      tags: [],
      events: [],
    }),

  cta: z
    .object({
      title: zClampedString(0, L.ctaTitleMax, "CTA title").default(""),
      description: zClampedString(0, L.ctaDescMax, "CTA description").default(
        "",
      ),
      ctaLabel: zClampedString(0, L.ctaLabelMax, "CTA button label").default(
        "",
      ),
      ctaHref: zUrl.default(""),
    })
    .default({ title: "", description: "", ctaLabel: "", ctaHref: "" }),
});

export type CampusLifePageValue = z.infer<typeof CampusLifePageSchema>;
