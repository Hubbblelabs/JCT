import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, ArrowRight, CalendarDays } from "lucide-react";
import { listNewsEvents, type NewsEventCard } from "@/lib/public-events";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { formatEventDate } from "@/lib/utils";
import type { UpcomingEventsValue } from "@/lib/validation";

type Institution = "engineering" | "arts-science" | "polytechnic";

// The config keys keep their original names — renaming them would orphan
// whatever an admin has already saved.
const CONFIG_KEY: Record<Institution, string> = {
  engineering: "engineeringUpcomingEvents",
  "arts-science": "artsScienceUpcomingEvents",
  polytechnic: "polytechnicUpcomingEvents",
};

type Resolved = {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  maxItems: number;
  ctaLabel: string;
  ctaHref: string;
  emptyText: string;
  fallbackToRecent: boolean;
  upcomingBadge: string;
};

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/**
 * The section renders with sensible copy before anyone has touched the CMS —
 * an unsaved config must not leave a college without its events strip.
 */
function resolveConfig(raw: unknown, institution: Institution): Resolved {
  const r = (raw ?? {}) as Partial<UpcomingEventsValue> &
    Record<string, unknown>;
  const maxItems = typeof r.maxItems === "number" ? r.maxItems : 3;
  return {
    enabled: r.enabled !== false,
    eyebrow: str(r.eyebrow) || "Happenings",
    heading: str(r.heading) || "News & Events",
    description: str(r.description),
    maxItems: Math.min(6, Math.max(1, Math.trunc(maxItems))),
    ctaLabel: str(r.ctaLabel) || "News & Events",
    ctaHref: str(r.ctaHref) || `/institutions/${institution}/events`,
    emptyText: str(r.emptyText),
    fallbackToRecent: r.fallbackToRecent !== false,
    upcomingBadge: str(r.upcomingBadge) || "Upcoming",
  };
}

function EventCard({
  event,
  upcomingBadge,
}: {
  event: NewsEventCard;
  upcomingBadge: string;
}) {
  return (
    <article className="group border-border bg-background shadow-card hover:shadow-elevated flex flex-col overflow-hidden rounded-2xl border transition-shadow">
      <Link href={`/events/${event.slug}`} className="flex h-full flex-col">
        <div className="bg-muted relative h-44 w-full overflow-hidden">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="from-primary/90 to-primary/60 absolute inset-0 bg-linear-to-br" />
          )}
          {event.category && (
            <span className="bg-accent text-accent-foreground absolute top-4 left-4 rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
              {event.category}
            </span>
          )}
          {/* The list mixes scheduled and past events, so the ones still to
              come have to be identifiable at a glance. */}
          {event.isUpcoming && upcomingBadge && (
            <span className="bg-navy absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase shadow-md">
              <span className="bg-gold h-1.5 w-1.5 shrink-0 animate-pulse rounded-full" />
              {upcomingBadge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="text-muted-foreground mb-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs">
            {event.date && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="text-accent" />
                {formatEventDate(event.date)}
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} className="text-accent" />
                {event.location}
              </span>
            )}
          </div>

          <h3 className="text-foreground mb-2 font-serif text-lg leading-snug italic">
            {event.title}
          </h3>
          {event.excerpt && (
            <p className="text-muted-foreground line-clamp-2 font-sans text-sm leading-relaxed">
              {event.excerpt}
            </p>
          )}

          <span className="text-accent mt-auto inline-flex items-center gap-1.5 pt-4 font-sans text-sm font-bold tracking-wide">
            Read more
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}

/**
 * Landing-page "News & Events" strip for one college: the next few scheduled
 * events, topped up with the most recent past ones so the row is never part
 * empty, and a button through to the full listing. Copy is CMS-backed under
 * the `<college>UpcomingEvents` site-config key; the events themselves are the
 * `Event` records managed at /admin/events.
 */
export async function NewsEvents({
  institution,
}: {
  institution: Institution;
}) {
  const config = resolveConfig(
    await getPublishedConfigValue(CONFIG_KEY[institution]),
    institution,
  );
  if (!config.enabled) return null;

  // The DB being briefly unreachable must not take the landing page down with
  // it — the section just doesn't render, and ISR retries later.
  let events: NewsEventCard[];
  try {
    ({ events } = await listNewsEvents({
      institution,
      limit: config.maxItems,
      fallbackToRecent: config.fallbackToRecent,
    }));
  } catch (err) {
    console.warn(`[NewsEvents:${institution}] load failed:`, err);
    return null;
  }

  // Nothing at all to show and no stand-in copy — an empty calendar is worse
  // than no section.
  if (events.length === 0 && !config.emptyText) return null;

  const externalCta = /^https?:\/\//i.test(config.ctaHref);

  return (
    <section id="news-events" className="bg-surface section-padding">
      <div className="container mx-auto max-w-350 px-4 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-accent font-sans text-sm font-bold tracking-[0.2em] uppercase">
              {config.eyebrow}
            </span>
            <h2 className="text-foreground mt-2 font-serif text-3xl font-bold md:text-4xl">
              {config.heading}
            </h2>
            {config.description && (
              <p className="text-muted-foreground mt-3 font-sans text-base leading-relaxed">
                {config.description}
              </p>
            )}
          </div>

          <Link
            href={config.ctaHref}
            target={externalCta ? "_blank" : undefined}
            rel={externalCta ? "noopener noreferrer" : undefined}
            className="group bg-navy hover:bg-navy-light shadow-navy/25 inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-sans text-base font-bold tracking-wide text-white shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            {config.ctaLabel}
            <span className="bg-accent text-accent-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1">
              <ArrowRight size={16} strokeWidth={2.5} />
            </span>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="border-border bg-background rounded-2xl border border-dashed py-16 text-center">
            <CalendarDays size={30} className="text-accent mx-auto mb-3" />
            <p className="text-muted-foreground font-sans text-base">
              {config.emptyText}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                upcomingBadge={config.upcomingBadge}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
