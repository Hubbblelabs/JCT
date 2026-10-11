/**
 * Phone numbers for the public header. Kept free of zod so the Navbar — which
 * ships on every public page — doesn't pull the validation library into the
 * client bundle. The schema lives in src/lib/validation/globalCms.ts.
 */

export type HeaderPhoneEntry = { number: string; label: string };

/**
 * The header's numbers in display order, blanks dropped. Falls back to the
 * legacy single `phone` for values saved before `phones` existed.
 */
export function headerPhones(
  value: { phones?: unknown; phone?: unknown } | null | undefined,
): HeaderPhoneEntry[] {
  if (!value) return [];
  if (Array.isArray(value.phones)) {
    const out: HeaderPhoneEntry[] = [];
    for (const raw of value.phones) {
      if (!raw || typeof raw !== "object") continue;
      const r = raw as { number?: unknown; label?: unknown };
      const number = typeof r.number === "string" ? r.number.trim() : "";
      if (!number) continue;
      out.push({
        number,
        label: typeof r.label === "string" ? r.label.trim() : "",
      });
    }
    return out;
  }
  return typeof value.phone === "string" && value.phone.trim()
    ? [{ number: value.phone.trim(), label: "" }]
    : [];
}

/** `tel:` target for a displayed number — keeps digits and a leading +. */
export function telHref(number: string): string {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
