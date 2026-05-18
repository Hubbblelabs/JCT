import { z } from "zod";
import { zUrl, zOptionalString } from "./_primitives";

// AnnouncementBar renders with line-clamp-1 — keep text short to fit one line.
export const LIMITS = {
  textMax: 120,
  ctaLabelMax: 24,
} as const;

export const AnnouncementSchema = z.object({
  enabled: z.boolean().optional().default(false),
  text: zOptionalString(LIMITS.textMax).default(""),
  ctaLabel: zOptionalString(LIMITS.ctaLabelMax).default(""),
  ctaHref: zUrl.optional().or(z.literal("")),
});

export type AnnouncementValue = z.infer<typeof AnnouncementSchema>;
