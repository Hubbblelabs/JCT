import { SiteChrome } from "@/components/layout/SiteChrome";

/**
 * Wraps every college route — landing pages, about, courses, events, program
 * and CMS detail pages — so the navbar and footer render from the CMS on the
 * server instead of flashing the hardcoded fallback menu first.
 *
 * No `revalidate` here on purpose: each page keeps its own ISR window, and a
 * navbar/header/footer edit invalidates the whole tree through
 * `revalidateForConfigKey` (see SITE_WIDE_CONFIG_KEYS in src/lib/revalidate.ts).
 */
export default function InstitutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
