"use client";

import { createContext, useContext } from "react";

const SiteConfigContext = createContext<Record<string, unknown>>({});

export function SiteConfigProvider({
  configs,
  children,
}: {
  configs: Record<string, unknown>;
  children: React.ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={configs}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfigContext(): Record<string, unknown> {
  return useContext(SiteConfigContext);
}
