/**
 * How two Event documents are recognised as the same real-world event.
 *
 * Shared by the legacy importer (so it stops creating a second copy of an
 * event somebody already typed into the CMS) and by dedupe-events.mjs (so it
 * finds the copies the importer already made). One definition means the
 * cleanup and the guard against re-creating the mess cannot drift apart.
 *
 * Deliberately dependency-free — no mongoose, no sharp, no AWS SDK — so both
 * callers can import it without inheriting the other's setup.
 */

/**
 * Titles are compared with case, punctuation and accents removed. Two copies
 * of one event rarely agree on the smart quote in "Engineer's" or on whether
 * "EmpowerHer: Strength Within, a session…" keeps its comma, but they do agree
 * on the letters. NFKD splits an accented character into its base letter plus
 * a combining mark, and the non-alphanumeric pass then drops the mark.
 */
export function normalizeTitle(title) {
  return (title ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** UTC calendar day, the granularity at which two records get compared. */
export function dayKey(date) {
  const d = date instanceof Date ? date : new Date(date);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

const DAY_MS = 86_400_000;

export function daysApart(a, b) {
  const x = a instanceof Date ? a : new Date(a);
  const y = b instanceof Date ? b : new Date(b);
  if (Number.isNaN(x.getTime()) || Number.isNaN(y.getTime())) return Infinity;
  return Math.abs(
    Math.round(x.getTime() / DAY_MS) - Math.round(y.getTime() / DAY_MS),
  );
}

export const LEGACY_PREFIX = "images/newsevents-";

/**
 * Every storage key the importer writes is prefixed `images/newsevents-`, so a
 * cover carrying one came from the legacy WordPress site and anything else was
 * authored in the admin.
 *
 * The **cover only**, and the gallery just as a fallback for a record that has
 * no cover. Reading the whole album instead makes this self-defeating: merging
 * a legacy post's photographs into the CMS record it duplicates would then flip
 * that record's origin to legacy, and the next import — finding same-origin on
 * both sides — would stop recognising it and create the duplicate all over
 * again. Merges only ever append to the gallery, so the cover is the stable
 * signal.
 *
 * Six imported posts have no photograph at all and read as CMS here; the only
 * consequence is that such a post is never paired across the date window below,
 * which leaves it for a human rather than deleting it — the safe direction to
 * be wrong in.
 */
export function isLegacyImport(doc) {
  if (typeof doc?.image === "string" && doc.image) {
    return doc.image.startsWith(LEGACY_PREFIX);
  }
  return (doc?.gallery ?? []).some(
    (k) => typeof k === "string" && k.startsWith(LEGACY_PREFIX),
  );
}

/**
 * How far apart two dates may sit and still describe one event. Only applied
 * across origins: an editor retyping an event into the CMS often enters the
 * day they were told rather than the day the legacy post carries, and the
 * drift seen in production runs to four weeks (the BTBCE industrial visit is
 * filed 3 January by WordPress and 31 January by its CMS twin).
 */
export const CROSS_ORIGIN_WINDOW_DAYS = 35;

/**
 * The record among `candidates` that describes the same event as `probe`, or
 * null. Callers pass only candidates already narrowed to one college and one
 * normalized title; what is left to decide is the date.
 *
 * The same day is the only unconditional match. The window above is applied
 * strictly second and only when there is a single candidate to apply it to —
 * with more than one, the drift cannot be told apart from a genuinely
 * different event of the same name. Engineer's Navaratri Golu Fest-2025 is why
 * that matters: three departments each held one, on 22, 24 and 30 September,
 * each typed into the CMS and each posted to WordPress. Pairing on the day
 * gives three pairs; letting a four-week window run transitively across them
 * gives one event and five deletions.
 *
 * Same title, different day, same origin is never a match — that is the shape
 * of an annual fixture and of three departments' separate association
 * inaugurals in one fortnight. Those belong on a review list, not a delete set.
 */
export function findTwin(probe, candidates) {
  const day = dayKey(probe.event_date);
  const sameDay = day && candidates.find((c) => dayKey(c.event_date) === day);
  if (sameDay) return sameDay;

  if (candidates.length !== 1) return null;
  const [only] = candidates;
  if (isLegacyImport(probe) === isLegacyImport(only)) return null;
  return daysApart(probe.event_date, only.event_date) <=
    CROSS_ORIGIN_WINDOW_DAYS
    ? only
    : null;
}

/**
 * The union of one record's album with another's photographs, in order, with
 * the cover excluded — there is one hero, and repeating it as the first tile
 * stacks the detail page's hero on an identical thumbnail.
 *
 * `max` is the caller's GALLERY_MAX; this module holds no validation limits of
 * its own so that it stays importable from anywhere.
 */
export function mergePhotoKeys(cover, gallery, extras, max) {
  const seen = new Set(cover ? [cover] : []);
  const merged = [];
  for (const key of [...(gallery ?? []), ...extras]) {
    if (typeof key !== "string" || !key || seen.has(key)) continue;
    seen.add(key);
    merged.push(key);
  }
  return merged.slice(0, max);
}
