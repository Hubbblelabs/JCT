"use client";

import { createContext, useContext, useMemo } from "react";

const SiteConfigContext = createContext<Record<string, unknown>>({});

/**
 * Server-fetched site config handed to the client components that render it.
 *
 * Providers nest: a layout supplies the site chrome (navbar/header/footer) for
 * every page under it, and a page adds its own section keys on top. So the
 * value MERGES with whatever an outer provider already published — replacing
 * it would drop the chrome keys the moment a page provided any config of its
 * own, and `useSiteConfig` would fall back to the hardcoded navigation until a
 * client fetch landed.
 */
export function SiteConfigProvider({
  configs,
  children,
}: {
  configs: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const parent = useContext(SiteConfigContext);
  const merged = useMemo(() => ({ ...parent, ...configs }), [parent, configs]);
  return (
    <SiteConfigContext.Provider value={merged}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfigContext(): Record<string, unknown> {
  return useContext(SiteConfigContext);
}
