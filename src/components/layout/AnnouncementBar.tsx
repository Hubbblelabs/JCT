"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type AnnouncementConfig = {
  enabled: boolean;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
};

function normalize(raw: unknown): AnnouncementConfig | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const text = typeof r.text === "string" ? r.text : "";
  return {
    enabled: r.enabled !== false,
    text,
    ctaLabel: typeof r.ctaLabel === "string" ? r.ctaLabel : undefined,
    ctaHref: typeof r.ctaHref === "string" ? r.ctaHref : undefined,
  };
}

type Props = {
  configKey: string;
};

export function AnnouncementBar({ configKey }: Props) {
  const [config, setConfig] = useState<AnnouncementConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/public/site-config?key=${configKey}`)
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db") {
          const next = normalize(res.data);
          if (next) setConfig(next);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [configKey]);

  if (!config || !config.enabled || !config.text) return null;

  const hasCta = config.ctaLabel && config.ctaHref;
  const isExternal = config.ctaHref?.startsWith("http");

  return (
    <div className="relative z-30 flex w-full items-center justify-center gap-3 bg-[#0a1628] px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
      <span className="line-clamp-1">{config.text}</span>
      {hasCta && (
        <Link
          href={config.ctaHref!}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#d4a024] px-3 py-0.5 text-[11px] font-bold text-[#081323] transition-transform hover:scale-105 sm:text-xs"
        >
          {config.ctaLabel}
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
}
