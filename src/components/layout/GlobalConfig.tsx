import { getPublishedConfigs } from "@/lib/site-config-server";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";

/** What the root layout's floating buttons and chat widget read. */
export const GLOBAL_ELEMENT_CONFIG_KEYS = [
  "floatingElements",
  "footer",
] as const;

/**
 * Server-rendered config for the elements the ROOT layout mounts on every
 * route — the floating WhatsApp / Apply Now / social buttons and the Meritto
 * chat loader.
 *
 * They sit outside every page's and layout's `SiteConfigProvider`, so each of
 * them used to fetch its keys from `/api/public/site-config` after hydration
 * on every page view, admin screens included (`GlobalElements` returns null
 * under /admin, but only after its hooks had already fired the requests).
 *
 * Wraps only these elements, not the page tree: the admin's live previews
 * render the same components inside their own provider with draft values, and
 * a published value from up here must never reach them.
 */
export async function GlobalConfig({
  children,
}: {
  children: React.ReactNode;
}) {
  const configs = await getPublishedConfigs([...GLOBAL_ELEMENT_CONFIG_KEYS]);
  return <SiteConfigProvider configs={configs}>{children}</SiteConfigProvider>;
}
