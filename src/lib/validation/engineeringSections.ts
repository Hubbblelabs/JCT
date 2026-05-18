import { z } from "zod";
import { zClampedString, zOptionalString } from "./_primitives";

// Engineering metrics, facilities, and research highlights all live as
// standalone SiteConfig keys (arrays). Each gets a hard cap so a runaway
// admin payload can't break the layout.

export const METRICS_LIMITS = {
  itemsMax: 8,
  valueMax: 20,
  labelMax: 60,
  subMax: 60,
} as const;

export const MetricsSchema = z
  .array(
    z.object({
      value: zClampedString(0, METRICS_LIMITS.valueMax, "Value").default(""),
      label: zClampedString(0, METRICS_LIMITS.labelMax, "Label").default(""),
      sub: zOptionalString(METRICS_LIMITS.subMax).default(""),
    }),
  )
  .max(METRICS_LIMITS.itemsMax);

export const FACILITIES_LIMITS = {
  itemsMax: 20,
  titleMax: 80,
  descMax: 320,
} as const;

export const FacilitiesSchema = z
  .array(
    z.object({
      title: zClampedString(0, FACILITIES_LIMITS.titleMax, "Title").default(""),
      desc: zOptionalString(FACILITIES_LIMITS.descMax).default(""),
    }),
  )
  .max(FACILITIES_LIMITS.itemsMax);

export const RESEARCH_HIGHLIGHTS_LIMITS = {
  itemsMax: 20,
  itemMax: 160,
} as const;

export const ResearchHighlightsSchema = z
  .array(zClampedString(0, RESEARCH_HIGHLIGHTS_LIMITS.itemMax, "Highlight"))
  .max(RESEARCH_HIGHLIGHTS_LIMITS.itemsMax);

export type MetricsValue = z.infer<typeof MetricsSchema>;
export type FacilitiesValue = z.infer<typeof FacilitiesSchema>;
export type ResearchHighlightsValue = z.infer<typeof ResearchHighlightsSchema>;
