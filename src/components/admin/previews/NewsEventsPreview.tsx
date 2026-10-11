"use client";

import { useEffect, useState } from "react";
import { useSiteConfig } from "@/lib/use-site-config";
import { getImageUrl } from "@/lib/utils";
import type { NewsEventCard } from "@/lib/public-events";
import {
  NEWS_EVENTS_CONFIG_KEY,
  NewsEventsView,
  resolveNewsEventsConfig,
  type NewsEventsInstitution,
} from "@/components/layout/NewsEventsView";

type AdminEvent = {
  _id: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  event_date?: string;
  location?: string;
  image?: string;
  institution?: string;
  is_active?: boolean;
  featured?: boolean;
  videos?: string[];
};

function toCard(e: AdminEvent, isUpcoming: boolean): NewsEventCard {
  return {
    _id: e._id,
    title: e.title ?? "",
    slug: e.slug ?? "",
    excerpt: e.excerpt ?? "",
    category: e.category ?? "",
    date: e.event_date ? new Date(e.event_date).toISOString() : "",
    location: e.location ?? "",
    image: getImageUrl(e.image),
    institution: e.institution ?? "",
    featured: e.featured === true,
    hasVideo: (e.videos ?? []).some((v) => v.trim() !== ""),
    isUpcoming,
  };
}

/**
 * The landing-page "News & Events" strip as the admin preview shows it: the
 * section's wording comes from the draft being edited (via the preview's
 * SiteConfigProvider), the cards from the college's active events — the same
 * upcoming-first, topped-up-with-recent selection the live page makes.
 */
export function NewsEventsPreview({
  institution,
}: {
  institution: NewsEventsInstitution;
}) {
  const { data } = useSiteConfig(NEWS_EVENTS_CONFIG_KEY[institution]);
  const config = resolveNewsEventsConfig(data, institution);
  const [all, setAll] = useState<AdminEvent[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/events?institution=${encodeURIComponent(institution)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((docs: AdminEvent[]) => {
        if (!cancelled) setAll(Array.isArray(docs) ? docs : []);
      })
      .catch(() => !cancelled && setAll([]));
    return () => {
      cancelled = true;
    };
  }, [institution]);

  if (!config.enabled) {
    return (
      <div className="bg-slate-100 px-6 py-10 text-center text-sm text-slate-500">
        News &amp; Events section is switched off — visitors don&apos;t see it.
      </div>
    );
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const active = (all ?? []).filter((e) => e.is_active !== false);
  const time = (e: AdminEvent) =>
    e.event_date ? new Date(e.event_date).getTime() : 0;
  const upcoming = active
    .filter((e) => time(e) >= startOfToday.getTime())
    .sort((a, b) => time(a) - time(b))
    .slice(0, config.maxItems)
    .map((e) => toCard(e, true));
  const recent = config.fallbackToRecent
    ? active
        .filter((e) => time(e) < startOfToday.getTime())
        .sort((a, b) => time(b) - time(a))
        .slice(0, Math.max(0, config.maxItems - upcoming.length))
        .map((e) => toCard(e, false))
    : [];

  return <NewsEventsView config={config} events={[...upcoming, ...recent]} />;
}
