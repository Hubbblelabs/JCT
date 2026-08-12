import {
  getPublishedConfigs,
  SITE_CHROME_CONFIG_KEYS,
} from "@/lib/site-config-server";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";

/**
 * Server-render the navbar/header/footer config for every page beneath a
 * layout.
 *
 * Without this only the four landing pages passed their config down, so every
 * other public route ("/institutions/arts-science/about", "/events", a program
 * detail page, …) served HTML built from the hardcoded navigation in
 * `src/data/all-navigations.ts` and then swapped in the CMS menu once the
 * client fetch in `useSiteConfig` resolved. The visible result was a navbar
 * that "sometimes" showed items nobody had configured — the fallback list,
 * caught mid-swap or left in place whenever that fetch was slow or failed.
 *
 * `getPublishedConfigs` already degrades to `{}` when the DB is unreachable,
 * in which case `useSiteConfig` still fetches client-side, so a bad DB moment
 * during ISR regeneration costs the old flash and not a broken page.
 */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const configs = await getPublishedConfigs([...SITE_CHROME_CONFIG_KEYS]);
  return <SiteConfigProvider configs={configs}>{children}</SiteConfigProvider>;
}
