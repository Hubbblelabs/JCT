import { z } from "zod";
import { zUrl, zClampedString } from "./_primitives";

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
});

export type FloatingElementsValue = z.infer<typeof FloatingElementsSchema>;
