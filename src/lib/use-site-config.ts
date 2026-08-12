"use client";

import { useEffect, useState } from "react";
import { useSiteConfigContext } from "@/contexts/SiteConfigContext";

export type SiteConfigResult<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
};

type FetchState<T> = {
  /** The key this result was fetched for — see the staleness check below. */
  key: string;
  data: T | null;
  loading: boolean;
  error: boolean;
};

/**
 * Read one site-config key, preferring the server-rendered value.
 *
 * The `key` argument is not fixed for the lifetime of a component: `Navbar`
 * derives it from the current institution, so a client-side navigation from
 * one college to another changes it in place. That makes the result a
 * *derivation* of the key rather than something that can live in state and be
 * corrected later — the server-provided branch reads straight from context on
 * every render, and the fetched branch is ignored until its recorded key
 * matches the one being asked for. Holding the value in state alone meant a
 * navigation between two colleges under the same layout kept rendering the
 * college the visitor had just left.
 */
export function useSiteConfig<T = unknown>(key: string): SiteConfigResult<T> {
  const ctx = useSiteConfigContext();
  const hasCtxData = key in ctx;

  const [fetched, setFetched] = useState<FetchState<T>>(() => ({
    key,
    data: null,
    loading: !hasCtxData,
    error: false,
  }));

  useEffect(() => {
    // Context provided server-side data — skip the client fetch entirely.
    if (hasCtxData) return;

    let cancelled = false;
    setFetched({ key, data: null, loading: true, error: false });
    fetch(`/api/public/site-config?key=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          setFetched({
            key,
            data: res.data as T,
            loading: false,
            error: false,
          });
        } else if (res?.source === "empty") {
          setFetched({ key, data: null, loading: false, error: false });
        } else {
          setFetched({ key, data: null, loading: false, error: true });
        }
      })
      .catch(() => {
        if (!cancelled)
          setFetched({ key, data: null, loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
  }, [key, hasCtxData]);

  if (hasCtxData) {
    return { data: ctx[key] as T, loading: false, error: false };
  }
  // The key changed this render and the effect that refetches hasn't run yet.
  // Reporting the previous key's value here is what showed the wrong college's
  // navbar for a frame; report "loading" instead.
  if (fetched.key !== key) {
    return { data: null, loading: true, error: false };
  }
  return { data: fetched.data, loading: fetched.loading, error: fetched.error };
}
