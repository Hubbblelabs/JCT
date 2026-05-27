import { z } from "zod";
import { zClampedString, zUrl } from "./_primitives";

export const SIDEBAR_NAV_LIMITS = {
  items: 40,
  labelMax: 80,
  iconMax: 40,
  idMax: 60,
} as const;

/**
 * Sidebar nav item. Three flavors:
 *  - Built-in override: `key` matches a built-in anchor; `label`/`icon`/`visible` override.
 *  - Custom internal/external link: `href` present + `label` required.
 *  - Built-in re-order: just `key` present, no overrides.
 *
 * `id` is a stable client-side identity (random) used by React keys.
 */
export const SidebarNavItemSchema = z.object({
  id: zClampedString(0, SIDEBAR_NAV_LIMITS.idMax, "Item ID").optional(),
  key: zClampedString(0, SIDEBAR_NAV_LIMITS.idMax, "Built-in key").optional(),
  label: zClampedString(0, SIDEBAR_NAV_LIMITS.labelMax, "Label").optional(),
  href: zUrl.optional().or(z.literal("")),
  icon: zClampedString(0, SIDEBAR_NAV_LIMITS.iconMax, "Icon").optional(),
  visible: z.boolean().optional(),
});
export type SidebarNavItem = z.infer<typeof SidebarNavItemSchema>;

export const SidebarNavOverrideSchema = z.object({
  items: z
    .array(SidebarNavItemSchema)
    .max(SIDEBAR_NAV_LIMITS.items)
    .optional(),
});
export type SidebarNavOverride = z.infer<typeof SidebarNavOverrideSchema>;
