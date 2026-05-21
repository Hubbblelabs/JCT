"use client";

import { useEffect, useState } from "react";

export type SiteConfigResult<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
};

/**
 * Fetches a single SiteConfig key from the public API. Returns the raw stored
 * value (or null when the key is unset / on error). Public pages use this as
 * the single source of truth — there is no static fallback content.
 */
export function useSiteConfig<T = unknown>(key: string): SiteConfigResult<T> {
  const [result, setResult] = useState<SiteConfigResult<T>>({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;
    setResult({ data: null, loading: true, error: false });
    fetch(`/api/public/site-config?key=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          setResult({
            data: (res.data as T) ?? null,
            loading: false,
            error: false,
          });
        } else if (res?.source === "empty") {
          setResult({ data: null, loading: false, error: false });
        } else {
          setResult({ data: null, loading: false, error: true });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResult({ data: null, loading: false, error: true });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return result;
}
