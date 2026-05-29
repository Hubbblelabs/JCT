import { z } from "zod";
import { zClampedString, zUrl } from "./_primitives";

export const NAVBAR_LIMITS = {
  items: 24,
  children: 16,
  labelMax: 60,
  descMax: 160,
} as const;

export const NavbarChildSchema = z.object({
  id: zClampedString(0, 40, "Item ID").optional(),
  label: zClampedString(1, NAVBAR_LIMITS.labelMax, "Label"),
  href: zUrl,
  desc: zClampedString(0, NAVBAR_LIMITS.descMax).optional(),
  visible: z.boolean().optional(),
});
export type NavbarChild = z.infer<typeof NavbarChildSchema>;

export const NavbarItemSchema = z.object({
  id: zClampedString(0, 40, "Item ID").optional(),
  label: zClampedString(1, NAVBAR_LIMITS.labelMax, "Label"),
  href: zUrl,
  desc: zClampedString(0, NAVBAR_LIMITS.descMax).optional(),
  visible: z.boolean().optional(),
  children: z.array(NavbarChildSchema).max(NAVBAR_LIMITS.children).optional(),
});
export type NavbarItem = z.infer<typeof NavbarItemSchema>;

export const NavbarSchema = z.object({
  items: z
    .array(NavbarItemSchema)
    .max(NAVBAR_LIMITS.items)
    .optional()
    .default([]),
});
export type NavbarValue = z.infer<typeof NavbarSchema>;
