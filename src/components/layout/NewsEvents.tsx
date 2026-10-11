import { listNewsEvents, type NewsEventCard } from "@/lib/public-events";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import {
  NEWS_EVENTS_CONFIG_KEY,
  NewsEventsView,
  resolveNewsEventsConfig,
  type NewsEventsInstitution,
} from "./NewsEventsView";

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
  institution: NewsEventsInstitution;
}) {
  const config = resolveNewsEventsConfig(
    await getPublishedConfigValue(NEWS_EVENTS_CONFIG_KEY[institution]),
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

  return <NewsEventsView config={config} events={events} />;
}
