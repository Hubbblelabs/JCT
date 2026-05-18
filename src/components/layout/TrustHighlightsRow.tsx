"use client";

import { useEffect, useState } from "react";
import { Award, Users, GraduationCap, BadgeDollarSign } from "lucide-react";
import { homeHeroContent } from "@/data/home";

type Highlight = { icon: string; label: string };

function getTrustIcon(iconName: string) {
  switch (iconName) {
    case "laurel":
      return <Award className="h-4 w-4" />;
    case "users":
      return <Users className="h-4 w-4" />;
    case "cap":
      return <GraduationCap className="h-4 w-4" />;
    case "growth":
    case "badge":
      return <BadgeDollarSign className="h-4 w-4" />;
    default:
      return <Award className="h-4 w-4" />;
  }
}

function normalizeHighlights(raw: unknown): Highlight[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((entry) => {
      const r = (entry ?? {}) as Record<string, unknown>;
      const label = typeof r.label === "string" ? r.label : null;
      if (!label) return null;
      return {
        icon: typeof r.icon === "string" ? r.icon : "laurel",
        label,
      } satisfies Highlight;
    })
    .filter((x): x is Highlight => x !== null);
}

export function TrustHighlightsRow() {
  const [highlights, setHighlights] = useState<Highlight[]>(
    homeHeroContent.trustHighlights as unknown as Highlight[],
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/site-config?key=home")
      .then((r) => r.json())
      .then((res) => {
        if (cancelled) return;
        if (res?.source === "db" && res.data && typeof res.data === "object") {
          const next = normalizeHighlights(
            (res.data as Record<string, unknown>).trustHighlights,
          );
          if (next.length > 0) setHighlights(next);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative -mt-1 w-full border-y border-slate-200/60 bg-[#f5f3ef]/92 py-2 md:py-2.5">
      <div className="mx-auto w-full max-w-352 px-4 md:px-8 lg:px-10">
        <div className="w-full px-0.5 py-0.5 sm:px-1">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] font-semibold text-[#1b2f4d] sm:gap-x-4 md:hidden">
            {highlights.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-1.5 whitespace-nowrap"
              >
                <span className="text-[#48678f]">
                  {getTrustIcon(stat.icon)}
                </span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="hidden items-center justify-center gap-x-5 text-[13px] font-semibold text-[#1b2f4d] md:flex lg:gap-x-7 lg:text-[15px]">
            {highlights.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-400">|</span>}
                <span className="text-[#48678f]">
                  {getTrustIcon(stat.icon)}
                </span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
