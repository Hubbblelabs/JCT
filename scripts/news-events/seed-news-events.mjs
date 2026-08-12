/**
 * Import every published news-event post from the three legacy WordPress
 * installs into the `Event` collection, with its photo album.
 *
 * Reads `manifest.json.gz` (produced by extract.php on the old server — see
 * README.md) and, for each post, pulls the referenced images over HTTP from the
 * old site, re-encodes them to WebP exactly the way /api/admin/images/upload
 * does, stores them in object storage, records an ImageAsset row, and upserts
 * the Event.
 *
 * Why this bypasses the admin API: there are 10,313 unique images. The upload
 * route is rate limited to 60/minute per account (deliberately — see
 * rate-limit.ts), which would make this a six-hour run against production, and
 * proxy.ts truncates any /api/admin/* body at 10 MB. So the script talks to
 * Mongo and object storage directly, and reproduces the route's conventions
 * rather than inheriting them. Anything that changes in the upload route's
 * processing (the WebP settings, the ImageAsset fields) has to change here too.
 *
 * Idempotent and resumable: storage keys are derived from the legacy
 * attachment id, so a re-run skips every image already in storage, and an
 * event whose slug already exists is left alone unless --force is passed. A
 * run that dies halfway can simply be started again.
 *
 * The slug is not the only test for "already there". An event somebody typed
 * into the admin has a slug of its own, and matching on slug alone imported 23
 * of them a second time on the first production run. So a post that matches an
 * existing record on college + normalized title + date (see event-identity.mjs)
 * has its photo album merged into that record and no new row is created —
 * which also collapses the duplicates the legacy sites carry themselves.
 *
 * Usage (inside the app image, which already has mongoose, sharp and the AWS
 * SDK — see README.md for the exact docker command):
 *
 *   node scripts/news-events/seed-news-events.mjs [options]
 *
 *   --dry-run              Report what would happen; write nothing.
 *   --force                Overwrite events that already exist.
 *   --source=<origin>      Where to fetch the images from, overriding the
 *                          manifest. Use the old server's LAN address —
 *                          http://192.168.20.70 — not its public one: both
 *                          machines sit on 192.168.20.0/22, but this host
 *                          routes the old server's *public* IP out through the
 *                          gateway, where it is dropped. Over the LAN the same
 *                          images come back at ~60 MB/s instead of not at all.
 *   --institution=<slug>   Limit to one college.
 *   --limit=<n>            Stop after n events (for a smoke test).
 *   --concurrency=<n>      Parallel image fetches (default 6).
 */

import { gunzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import mongoose from "mongoose";
import sharp from "sharp";
import {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

import {
  findTwin,
  LEGACY_PREFIX,
  mergePhotoKeys,
  normalizeTitle,
} from "./event-identity.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

// ── options ──────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    force: false,
    institution: null,
    limit: 0,
    concurrency: 6,
    source: process.env.SEED_SOURCE_ORIGIN || null,
  };
  for (const arg of argv) {
    if (arg === "--dry-run") opts.dryRun = true;
    else if (arg === "--force") opts.force = true;
    else if (arg.startsWith("--source=")) {
      opts.source = arg.slice("--source=".length).replace(/\/+$/, "");
    } else if (arg.startsWith("--institution=")) {
      opts.institution = arg.slice("--institution=".length);
    } else if (arg.startsWith("--limit=")) {
      opts.limit = Number(arg.slice("--limit=".length)) || 0;
    } else if (arg.startsWith("--concurrency=")) {
      opts.concurrency = Math.max(
        1,
        Number(arg.slice("--concurrency=".length)) || 6,
      );
    } else {
      console.error(`[seed] unknown option ${arg}`);
      process.exit(2);
    }
  }
  return opts;
}

const opts = parseArgs(process.argv.slice(2));

// ── limits, mirrored from src/lib/validation ─────────────────────────────────
// This script runs against the standalone build, which has no TypeScript and
// no path alias, so the few constants it needs are duplicated rather than
// imported. Keep them in step with src/lib/validation/events.ts and
// src/lib/validation/imageAsset.ts.

const TITLE_MAX = 280;
const EXCERPT_MAX = 300;
const DESCRIPTION_MAX = 20000;
const GALLERY_MAX = 200;
const SLUG_MAX = 80;
// The "auto" ratio from IMAGE_RATIOS: keep the source shape, cap the width.
const AUTO_WIDTH = 1920;
const WEBP_QUALITY = 85;

const UPLOADED_BY = process.env.SEED_UPLOADED_BY || "admin@jct.ac.in";

// ── environment ──────────────────────────────────────────────────────────────

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`[seed] ${name} is not set. Run this with the app's .env.`);
    process.exit(1);
  }
  return value;
}

// Resolved in main() rather than at module scope, so importing this file to
// exercise the transforms doesn't require a configured environment.
let MONGODB_URI;
let STORAGE_BUCKET;
let s3;

function configure() {
  MONGODB_URI = requireEnv("MONGODB_URI");
  STORAGE_BUCKET = requireEnv("STORAGE_BUCKET");
  s3 = new S3Client({
    // Server-side calls take the internal endpoint when there is one; the
    // public STORAGE_ENDPOINT is only needed for URLs a browser has to
    // resolve, and this script never presigns anything. See
    // src/lib/storage-config.ts.
    endpoint:
      process.env.STORAGE_INTERNAL_ENDPOINT || requireEnv("STORAGE_ENDPOINT"),
    region: process.env.STORAGE_REGION || "auto",
    forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE !== "false",
    credentials: {
      accessKeyId: requireEnv("STORAGE_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("STORAGE_SECRET_ACCESS_KEY"),
    },
  });
}

// ── models ───────────────────────────────────────────────────────────────────
// Declared with `strict: false` and no validation of their own: the source of
// truth is src/lib/models, and re-declaring the full schemas here would create
// a second definition to keep in sync. These only need the shape of the writes.

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({}, { strict: false, collection: "events" }),
);
const ImageAsset = mongoose.model(
  "ImageAsset",
  new mongoose.Schema({}, { strict: false, collection: "imageassets" }),
);
const AuditLog = mongoose.model(
  "AuditLog",
  new mongoose.Schema({}, { strict: false, collection: "auditlogs" }),
);

// ── transforms ───────────────────────────────────────────────────────────────

/**
 * WordPress percent-encodes a slug it could not transliterate, so a Tamil title
 * arrives as a 190-character run of %e0%ae… . Decoding first gives the real
 * characters, which then get stripped, leaving nothing — at which point the
 * caller falls back to the title and finally to a synthetic slug.
 */
export function slugify(raw) {
  let value = raw ?? "";
  if (value.includes("%")) {
    try {
      value = decodeURIComponent(value);
    } catch {
      // Malformed escape — fall through with the raw text.
    }
  }
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * A slug that fits the column, reads like the post, and is unique across all
 * three colleges — `Event.slug` is globally unique, and eight titles (Republic
 * Day, Onam, the job fairs) genuinely repeat between the engineering and
 * polytechnic sites. Truncating to 80 characters collides another ten times.
 *
 * `taken` is threaded through the whole run so the numbering is stable: the
 * manifest is ordered engineering → arts-science → polytechnic and oldest
 * first, so the same post keeps the same slug on every re-run.
 */
export function uniqueSlug(event, institution, taken) {
  let base = slugify(event.slug) || slugify(event.title);
  if (!base) base = `event-${institution}-${event.id}`;
  // Leave room for a "-99" disambiguator without overrunning the 80-char cap.
  base = base.slice(0, SLUG_MAX - 4).replace(/-+$/, "");

  let candidate = base;
  let n = 1;
  while (taken.has(candidate)) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  taken.add(candidate);
  return candidate;
}

/**
 * When the post has an explicit event-date custom field, that is the date the
 * event happened and post_date is only when somebody typed it in — the 2021
 * migration into this WordPress stamped several hundred backlog posts with the
 * import date, so post_date alone would file a 2010 conference under 2021.
 *
 * `_wp_old_date` is deliberately ignored. It looks like a date field but it is
 * WordPress's own bookkeeping: core writes the *previous* post_date there when
 * an editor changes a post's date, purely to keep old permalinks redirecting.
 */
export function resolveDate(event) {
  const dates = event.dates ?? {};
  const seconds = dates["wpcf-event-date"] ?? dates["wpcf-date"];
  if (seconds && /^\d+$/.test(String(seconds))) {
    const d = new Date(Number(seconds) * 1000);
    if (isSaneDate(d)) return { date: d, source: "event-date-field" };
  }

  const ymd = dates["publication_date"];
  if (ymd && /^\d{8}$/.test(String(ymd))) {
    const s = String(ymd);
    const d = new Date(
      `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T00:00:00Z`,
    );
    if (isSaneDate(d)) return { date: d, source: "publication-date" };
  }

  const posted = new Date(String(event.postDate).replace(" ", "T") + "Z");
  if (isSaneDate(posted)) return { date: posted, source: "post-date" };
  return { date: new Date(0), source: "unknown" };
}

function isSaneDate(d) {
  if (Number.isNaN(d.getTime())) return false;
  const year = d.getUTCFullYear();
  return year >= 2000 && year <= new Date().getUTCFullYear() + 2;
}

// Matched against the title only. Matching the body too pulls half the archive
// into "Placement", because almost every report thanks the placement cell.
// First match wins, so the more specific patterns come first.
const CATEGORY_RULES = [
  [/\b(naac|nba|accredit|iso\s*9001|ugc|aicte|peer team)\b/i, "Accreditation"],
  [
    /\b(mou|memorandum|collaborat|partnership|tie[- ]?up|industrial visit)\b/i,
    "Partnership",
  ],
  [
    /\b(placement|campus drive|recruit|job fair|internship|placed|interview)\b/i,
    "Placement",
  ],
  [
    /\b(webinar|workshop|fdp|faculty development|training|seminar|bootcamp|hands[- ]on|guest lecture|orientation)\b/i,
    "Workshop",
  ],
  [
    /\b(conference|symposium|research|patent|publication|paper|journal|project expo|exhibition)\b/i,
    "Academic",
  ],
  [
    /\b(sports|tournament|marathon|athletic|match|championship|yoga)\b/i,
    "Sports",
  ],
  [
    /\b(award|prize|winner|won|achievement|topper|medal|rank holder|felicitat|appreciat)\b/i,
    "Achievement",
  ],
  [
    /\b(cultural|celebrat|fest|onam|pongal|deepavali|diwali|christmas|annual day|graduation|independence day|republic day|women'?s day|teachers'? day)\b/i,
    "Cultural",
  ],
];

export function inferCategory(title) {
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(title)) return category;
  }
  return "Campus Life";
}

/**
 * Nine of the thousand posts were typed as plain text with blank lines between
 * paragraphs. The renderer feeds `description` straight to
 * dangerouslySetInnerHTML, so unwrapped text would collapse into one run-on
 * block; this is WordPress's wpautop, minus the cases the data doesn't have.
 */
export function ensureHtml(content) {
  const text = (content ?? "").trim();
  if (!text) return "";
  if (text.includes("<")) return text;
  return text
    .split(/\n\s*\n/)
    .map((para) => `<p>${escapeHtml(para.trim()).replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Plain-text summary for the card, since 998 of the posts have no excerpt. */
export function deriveExcerpt(rawExcerpt, html) {
  const source = (rawExcerpt ?? "").trim() || html;
  const text = source
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;|&rsquo;/g, "’")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= EXCERPT_MAX) return text;
  // Cut on a word boundary so the card doesn't end mid-word.
  const cut = text.slice(0, EXCERPT_MAX - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

// ── images ───────────────────────────────────────────────────────────────────

const INSTITUTION_ABBR = {
  engineering: "eng",
  "arts-science": "as",
  polytechnic: "poly",
};

/**
 * A deterministic key, so the second run of a half-finished import recognises
 * what the first one already uploaded. The legacy attachment id makes it unique
 * within a college; the college prefix keeps the three installs' id ranges from
 * colliding with each other.
 */
export function storageKeyFor(institution, file) {
  const base = file.path
    .split("/")
    .pop()
    .replace(/\.[^.]+$/, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 60);
  const abbr = INSTITUTION_ABBR[institution] ?? institution;
  // "newsevents-", not "legacy-": an older import already put 358 objects in
  // the bucket under `images/legacy-<n>-<hash>.png`, and a shared prefix would
  // make the two impossible to tell apart when auditing what this script owns.
  return `images/newsevents-${abbr}-${file.attachmentId}-${base}.webp`;
}

function aspectRatioOf(width, height) {
  if (!width || !height) return "original";
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  const w = width / divisor;
  const h = height / divisor;
  return w <= 40 && h <= 40 ? `${w}:${h}` : `${width}:${height}`;
}

/** The object's size if it is already stored, or null if it isn't. */
async function storedSize(key) {
  try {
    const head = await s3.send(
      new HeadObjectCommand({ Bucket: STORAGE_BUCKET, Key: key }),
    );
    return head.ContentLength ?? 0;
  } catch (err) {
    const status = err?.$metadata?.httpStatusCode;
    if (status === 404 || err?.name === "NotFound") return null;
    throw err;
  }
}

/**
 * Consecutive image failures before the run gives up.
 *
 * Without this a source that goes away mid-run is silently catastrophic: every
 * fetch fails, but the events are still written, so the archive lands as a
 * thousand headlines with no photographs and the summary reports success. That
 * is exactly what happened on the first attempt against the old server's public
 * address. One dead photo should not stop an import of ten thousand; two dozen
 * in a row is not bad photos, it is a broken source.
 */
const FAILURE_STREAK_LIMIT = 25;

class SourceUnreachable extends Error {}

async function fetchWithRetry(url, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      // 60 s, not 120: over the LAN a whole image arrives in milliseconds, so a
      // long ceiling only buys a slower diagnosis. Three attempts at two
      // minutes each meant a single unreachable host cost six minutes per
      // photo.
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      lastError = err;
      // The old box is a single Apache on a slow link; back off rather than
      // hammering it, and give a stalled connection time to clear.
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Fetch one legacy image, re-encode it, store it, and record the asset.
 * Returns the storage key, or null if the image could not be used — a bad
 * source file loses one photo from an album, which is not worth aborting an
 * import of ten thousand over.
 */
async function migrateImage(file, ctx, stats) {
  const key = storageKeyFor(ctx.institution, file);
  // The same photo is usually both the featured image and the album's first
  // entry. Cache the in-flight promise rather than the key, so a second
  // reference waits for the first attempt and sees its real outcome — caching
  // the key alone would hand back a reference to an image that failed to
  // upload, and the page would render a broken tile.
  let pending = ctx.inFlight.get(key);
  if (!pending) {
    pending = migrateImageOnce(key, file, ctx, stats);
    ctx.inFlight.set(key, pending);
  }
  return pending;
}

async function migrateImageOnce(key, file, ctx, stats) {
  if (!file.mime?.startsWith("image/")) {
    stats.skippedNonImage += 1;
    return null;
  }

  const alreadyStored = opts.dryRun ? null : await storedSize(key);
  if (alreadyStored !== null) {
    stats.alreadyPresent += 1;
    // The object survived a previous run but its tracking row may not have
    // been written yet — the media library would then show nothing for a file
    // that exists. Reconcile rather than assuming they agree. Dimensions are
    // unknown without re-downloading the object, which is not worth it just to
    // fill two optional fields; the size at least comes free with the HEAD.
    await ensureAssetRow(key, file, ctx, { size: alreadyStored });
    return key;
  }

  if (opts.dryRun) {
    stats.wouldUpload += 1;
    return key;
  }

  let webp;
  let meta;
  try {
    const source = await fetchWithRetry(ctx.baseUrl + file.path);
    const pipeline = sharp(source, {
      failOn: "error",
      limitInputPixels: 268_402_689,
    }).resize({ width: AUTO_WIDTH, withoutEnlargement: true });
    webp = await pipeline.webp({ quality: WEBP_QUALITY }).toBuffer();
    meta = await sharp(webp).metadata();
  } catch (err) {
    stats.failed.push({ path: file.path, reason: String(err?.message ?? err) });
    stats.failureStreak += 1;
    if (stats.failureStreak >= FAILURE_STREAK_LIMIT) {
      throw new SourceUnreachable(
        `${stats.failureStreak} image fetches failed in a row against ` +
          `${ctx.baseUrl} — treating the source as unreachable rather than ` +
          `importing a thousand events with no photographs. ` +
          `Last error: ${String(err?.message ?? err)}`,
      );
    }
    return null;
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: webp,
      ContentType: "image/webp",
    }),
  );
  await ensureAssetRow(key, file, ctx, { size: webp.length, meta });
  stats.uploaded += 1;
  stats.bytes += webp.length;
  stats.failureStreak = 0;
  return key;
}

/** Upsert the ImageAsset row the media library reads, matching the fields
 *  /api/admin/images/upload writes. */
async function ensureAssetRow(key, file, ctx, processed) {
  if (opts.dryRun) return;
  const existing = await ImageAsset.findOne({ storage_key: key })
    .select("_id")
    .lean();
  if (existing) return;

  await ImageAsset.create({
    filename: key.slice("images/".length),
    storage_key: key,
    url: key,
    alt_text: (file.caption || ctx.altFallback || "").slice(0, 200),
    category: "campus",
    institution: ctx.institution,
    file_size: processed?.size ?? 0,
    mime_type: "image/webp",
    width: processed?.meta?.width,
    height: processed?.meta?.height,
    ratio_type: "auto",
    aspect_ratio: aspectRatioOf(
      processed?.meta?.width,
      processed?.meta?.height,
    ),
    uploaded_by: UPLOADED_BY,
    created_at: new Date(),
  });
}

/** Run `worker` over `items` with at most `limit` in flight. */
async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  const runners = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      while (next < items.length) {
        const i = next;
        next += 1;
        results[i] = await worker(items[i], i);
      }
    },
  );
  await Promise.all(runners);
  return results;
}

// ── main ─────────────────────────────────────────────────────────────────────

/**
 * Fetch one real image before touching the database.
 *
 * The first run against production imported ten events with no photographs at
 * all, because the source was unreachable and nothing checked until it was too
 * late to matter. One request up front turns that into a message before any
 * write happens.
 */
async function preflight(origin, manifest) {
  const install = manifest.installs.find((i) =>
    i.events.some((e) => e.cover || e.gallery.length),
  );
  const sample = install.events.find((e) => e.cover || e.gallery.length);
  const file = sample.cover ?? sample.gallery[0];
  const url = origin + install.uploads_base + file.path;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const bytes = (await res.arrayBuffer()).byteLength;
    console.log(`[seed] source reachable: ${origin} (${bytes} bytes sampled)`);
  } catch (err) {
    throw new SourceUnreachable(
      `Cannot fetch images from ${origin} — ${String(err?.message ?? err)}.\n` +
        `  Tried: ${url}\n` +
        `  From this host the old server's PUBLIC address is not routable; ` +
        `use its LAN address instead:\n` +
        `    --source=http://192.168.20.70`,
    );
  }
}

async function main() {
  configure();
  const manifestPath = resolve(HERE, "manifest.json.gz");
  const manifest = JSON.parse(
    gunzipSync(readFileSync(manifestPath)).toString("utf8"),
  );
  const origin = opts.source || manifest.source;

  if (!opts.dryRun) await preflight(origin, manifest);

  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15_000 });
  console.log(`[seed] connected to MongoDB${opts.dryRun ? " (dry run)" : ""}`);

  const stats = {
    events: 0,
    created: 0,
    updated: 0,
    skippedExisting: 0,
    mergedIntoExisting: 0,
    photosMerged: 0,
    uploaded: 0,
    alreadyPresent: 0,
    wouldUpload: 0,
    skippedNonImage: 0,
    galleryTruncated: 0,
    noCover: 0,
    datesFromPostDate: 0,
    bytes: 0,
    failed: [],
    failureStreak: 0,
  };

  // Assign every slug from the WHOLE manifest before any filtering, so
  // --institution and --limit cannot change the numbering. Deriving them from
  // the filtered set instead would mean a one-college smoke test followed by a
  // full run gives that college's events different slugs the second time
  // round, and each one would be imported a second time as "-2".
  const taken = new Set();
  const slugFor = new Map();
  for (const install of manifest.installs) {
    for (const event of install.events) {
      slugFor.set(
        `${install.institution}:${event.id}`,
        uniqueSlug(event, install.institution, taken),
      );
    }
  }

  // An event somebody created by hand in the admin could already own one of
  // those slugs. The import skips whatever already exists (or overwrites it
  // under --force), which leaves a legacy post unimported — worth saying out
  // loud, because it also means that post's photo album never lands.
  const collisions = await Event.find({ slug: { $in: [...slugFor.values()] } })
    .select("slug")
    .lean();
  if (collisions.length) {
    console.log(
      `[seed] ${collisions.length} target slug(s) already exist and will be ` +
        `${opts.force ? "overwritten" : "skipped"}: ` +
        collisions
          .slice(0, 10)
          .map((d) => d.slug)
          .join(", ") +
        (collisions.length > 10 ? ", …" : ""),
    );
  }

  // Matching on the slug alone is not enough, and the first production run
  // proved it: of 69 events already typed into the CMS, 46 happened to
  // slugify to exactly the generated slug and were skipped, but 23 did not
  // ("international-women-s-day-2026" against the generated
  // "international-womens-day-2026") and were imported a second time. So the
  // college + normalized title + date identity from event-identity.mjs is
  // checked too, and the whole collection is loaded once rather than queried
  // per post — 1024 documents of metadata is nothing next to 10,313 images,
  // and a normalized-title comparison cannot be expressed as an index lookup.
  const priorEvents = await Event.find({})
    .select("_id slug title institution event_date image gallery")
    .lean();
  const priorByTitle = new Map();
  for (const doc of priorEvents) {
    const key = `${doc.institution}|${normalizeTitle(doc.title)}`;
    const bucket = priorByTitle.get(key);
    if (bucket) bucket.push(doc);
    else priorByTitle.set(key, [doc]);
  }

  const planned = [];
  for (const install of manifest.installs) {
    if (opts.institution && install.institution !== opts.institution) continue;
    for (const event of install.events) {
      planned.push({ install, event });
    }
  }
  const work = opts.limit > 0 ? planned.slice(0, opts.limit) : planned;
  console.log(`[seed] ${work.length} events to process`);

  for (const { install, event } of work) {
    stats.events += 1;
    const institution = install.institution;
    const slug = slugFor.get(`${institution}:${event.id}`);

    const existing = await Event.findOne({ slug }).select("_id").lean();
    if (existing && !opts.force) {
      stats.skippedExisting += 1;
      continue;
    }

    const title = event.title.trim().slice(0, TITLE_MAX);
    const description = ensureHtml(event.content).slice(0, DESCRIPTION_MAX);
    const { date, source } = resolveDate(event);
    if (source !== "event-date-field" && source !== "publication-date") {
      stats.datesFromPostDate += 1;
    }

    // Same event under a different slug — either a record an editor typed into
    // the CMS, or an earlier post from this same run (the legacy sites publish
    // one event twice often enough: two departments, minutes apart). Never a
    // second row: the album is merged into whatever is already there.
    //
    // The probe is marked legacy through its cover key, which is what it will
    // be once the images below land; the identity rule reads the cover to tell
    // a hand-authored record from an imported one.
    const twin = existing
      ? null
      : findTwin(
          { institution, title, event_date: date, image: LEGACY_PREFIX },
          priorByTitle.get(`${institution}|${normalizeTitle(title)}`) ?? [],
        );

    const ctx = {
      institution,
      baseUrl: origin + install.uploads_base,
      inFlight: new Map(),
      altFallback: title,
    };

    const cover = event.cover
      ? await migrateImage(event.cover, ctx, stats)
      : null;

    // The cover is also the album's first photo in the legacy theme. Uploading
    // it once and letting it appear in both places would show it twice on the
    // detail page, which stacks the hero on top of an identical tile.
    const galleryFiles = event.gallery.filter(
      (f) => storageKeyFor(institution, f) !== cover,
    );
    if (galleryFiles.length > GALLERY_MAX) {
      stats.galleryTruncated += 1;
    }
    const gallery = (
      await mapLimit(
        galleryFiles.slice(0, GALLERY_MAX),
        opts.concurrency,
        (file) => migrateImage(file, ctx, stats),
      )
    ).filter(Boolean);

    if (!cover && gallery.length === 0) stats.noCover += 1;

    const doc = {
      title,
      slug,
      excerpt: deriveExcerpt(event.excerpt, description),
      description,
      category: inferCategory(title),
      event_date: date,
      location: "",
      // Falling back to the album's first photo keeps the 14 posts that never
      // had a featured image from rendering as a card-shaped hole in the grid.
      image: cover ?? gallery[0] ?? "",
      gallery: cover ? gallery : gallery.slice(1),
      institution,
      is_active: true,
      sort_order: 0,
      updated_by: UPLOADED_BY,
    };

    if (twin) {
      // Photographs only. The twin's body, category and date are left exactly
      // as they are — a CMS record's hand-written prose is the one thing this
      // import cannot reproduce. Overwriting a record wholesale is what
      // --force means on a slug match, not something to do behind the
      // operator's back on a title match.
      const merged = mergePhotoKeys(
        twin.image,
        twin.gallery,
        [doc.image, ...doc.gallery],
        GALLERY_MAX,
      );
      stats.mergedIntoExisting += 1;
      stats.photosMerged += merged.length - (twin.gallery?.length ?? 0);
      const update = { gallery: merged };
      // No cover of its own: promote the first merged photograph, same as the
      // fallback below.
      if (!twin.image && merged.length) update.image = merged.shift();
      if (!opts.dryRun) {
        await Event.updateOne(
          { _id: twin._id },
          { $set: { ...update, updated_at: new Date() } },
        );
      }
      // Also in dry run, so a second legacy copy of the same event merges into
      // this one rather than being counted as another merge target.
      Object.assign(twin, update);
    } else {
      if (opts.dryRun) {
        stats.created += 1;
      } else if (existing) {
        await Event.updateOne({ _id: existing._id }, { $set: doc });
        stats.updated += 1;
      } else {
        const now = new Date();
        await Event.create({ ...doc, created_at: now, updated_at: now });
        stats.created += 1;
      }
      // Visible to the rest of this run, so the legacy side's own duplicates
      // merge into it instead of arriving as "-2".
      if (!existing) {
        const key = `${institution}|${normalizeTitle(title)}`;
        const bucket = priorByTitle.get(key);
        if (bucket) bucket.push(doc);
        else priorByTitle.set(key, [doc]);
      }
    }

    if (stats.events % 25 === 0) {
      console.log(
        `[seed] ${stats.events}/${work.length} events · ` +
          `${stats.uploaded} images uploaded · ` +
          `${(stats.bytes / 1024 / 1024).toFixed(0)} MB stored`,
      );
    }
  }

  if (
    !opts.dryRun &&
    stats.created + stats.updated + stats.mergedIntoExisting > 0
  ) {
    await AuditLog.create({
      entity_type: "event",
      action: "created",
      user_email: UPLOADED_BY,
      summary:
        `Imported ${stats.created + stats.updated} news & events from the ` +
        `legacy site (${stats.uploaded} images), merging ` +
        `${stats.mergedIntoExisting} into records that already existed`,
      // The lean schema declared above has no timestamps config, so the field
      // the AuditLog model would fill in automatically has to be set by hand.
      created_at: new Date(),
    });
  }

  console.log("\n[seed] done");
  console.table({
    "events processed": stats.events,
    "events created": stats.created,
    "events updated": stats.updated,
    "events skipped (same slug already present)": stats.skippedExisting,
    "events merged into an existing record": stats.mergedIntoExisting,
    "photos merged into existing records": stats.photosMerged,
    "images uploaded": stats.uploaded,
    "images already in storage": stats.alreadyPresent,
    "images that would upload (dry run)": stats.wouldUpload,
    "non-image attachments skipped": stats.skippedNonImage,
    "albums truncated at the cap": stats.galleryTruncated,
    "events with no usable photo": stats.noCover,
    "dates falling back to post_date": stats.datesFromPostDate,
    "MB stored": Number((stats.bytes / 1024 / 1024).toFixed(1)),
    "image failures": stats.failed.length,
  });

  if (stats.failed.length) {
    console.log("\n[seed] images that could not be migrated:");
    for (const f of stats.failed.slice(0, 50)) {
      console.log(`  ${f.path} — ${f.reason}`);
    }
    if (stats.failed.length > 50) {
      console.log(`  … and ${stats.failed.length - 50} more`);
    }
    console.log("Re-run the script to retry them; finished work is skipped.");
  }

  console.log(
    "\nNext: clear the public cache so the new events appear — the " +
      "Clear Cache button on /admin/settings.",
  );

  await mongoose.disconnect();
}

// Only import.meta.main-style invocation runs the import; importing this file
// gives you the transforms above without touching Mongo or object storage.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch(async (err) => {
    console.error("[seed] failed:", err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
}
