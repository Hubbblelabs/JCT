"use client";

import { useEffect, useState } from "react";
import { useSiteConfigContext } from "@/contexts/SiteConfigContext";

export type SiteConfigResult<T> = {
  data: T | null;
  loading: boolean;
  error: boolean;
};

export function useSiteConfig<T = unknown>(key: string): SiteConfigResult<T> {
  const ctx = useSiteConfigContext();
  const hasCtxData = key in ctx;

  const [result, setResult] = useState<SiteConfigResult<T>>(() => ({
    data: hasCtxData ? (ctx[key] as T) : null,
    loading: !hasCtxData,
    error: false,
  }));

  useEffect(() => {
    // Context provided server-side data — skip the client fetch entirely.
    if (hasCtxData) return;

    let cancelled = false;
    setResult({ data: null, loading: true, error: false });
    fetch(`/api/public/site-config?key=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          setResult({ data: res.data as T, loading: false, error: false });
        } else if (res?.source === "empty") {
          setResult({ data: null, loading: false, error: false });
        } else {
          setResult({ data: null, loading: false, error: true });
        }
      })
      .catch(() => {
        if (!cancelled) setResult({ data: null, loading: false, error: true });
      });
    return () => {
      cancelled = true;
    };
    // hasCtxData is stable — derived from server props, never changes after mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return result;
}
