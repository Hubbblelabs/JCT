import { z } from "zod";
import { zUrl, zClampedString } from "./_primitives";

// Mirrors SOCIAL_KEYS in src/components/layout/social-links.tsx.
export const SOCIAL_NETWORKS = [
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtube",
] as const;

export const FLOATING_ELEMENTS_LIMITS = {
  labelMax: 40,
  phoneMax: 30,
  hrefMax: 500,
} as const;

export const FloatingElementsSchema = z.object({
  whatsapp: z
    .object({
      enabled: z.boolean().optional().default(true),
      phone: zClampedString(
        0,
        FLOATING_ELEMENTS_LIMITS.phoneMax,
        "Phone number",
      ).default(""),
    })
    .optional()
    .default({ enabled: true, phone: "" }),
  applyNow: z
    .object({
      enabled: z.boolean().optional().default(true),
      label: zClampedString(
        0,
        FLOATING_ELEMENTS_LIMITS.labelMax,
        "Button label",
      ).default("Apply Now"),
      href: zUrl.optional().or(z.literal("")),
    })
    .optional()
    .default({ enabled: true, label: "Apply Now", href: "" }),
  meritto: z
    .object({
      enabled: z.boolean().optional().default(true),
    })
    .optional()
    .default({ enabled: true }),
  /**
   * The floating social strip on the left edge. The URLs are not stored here —
   * they are the Footer's social links, entered once. `networks` narrows which
   * of those appear; absent means every network that has a link.
   */
  social: z
    .object({
      enabled: z.boolean().optional(),
      networks: z
        .array(z.enum(SOCIAL_NETWORKS))
        .max(SOCIAL_NETWORKS.length)
        .optional(),
    })
    .optional(),
});

export type FloatingElementsValue = z.infer<typeof FloatingElementsSchema>;
