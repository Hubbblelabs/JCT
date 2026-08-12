/**
 * Collapse duplicate Event documents left behind by the legacy news & events
 * import, and report the near-misses a human has to judge.
 *
 * Why they exist: seed-news-events.mjs recognised an already-imported event by
 * its slug alone. 69 events had been typed into the CMS before that run; 46
 * slugified to exactly the generated slug and were correctly skipped, but 23
 * did not ("international-women-s-day-2026" vs "international-womens-day-2026")
 * and were imported a second time. The legacy sites also carry their own
 * duplicates — the same event posted twice, minutes apart, by two departments.
 *
 * What it does NOT do is throw away content. The two copies of an event are
 * complementary: the CMS record has the long hand-written body and two or
 * three photographs, the imported record has a thin body and the whole
 * WordPress album (up to 29 images). So the richer body wins the row and every
 * photograph from the copies is merged into its gallery before they are
 * deleted. Nothing is orphaned in object storage, which is why this script
 * needs no S3 credentials.
 *
 * The pairing rule lives in event-identity.mjs and is shared with the
 * importer, which now applies it before creating anything.
 *
 * Usage (inside the app image, which already has mongoose — the same docker
 * command as the seed, see README.md):
 *
 *   node scripts/news-events/dedupe-events.mjs [options]
 *
 *   --apply              Actually merge and delete. Without it, nothing is
 *                        written: the default is a dry run.
 *   --institution=<slug> Limit to one college.
 *   --json=<path>        Write the full plan and the review list as JSON.
 *   --quiet              Suppress the per-group breakdown.
 *
 * Run the Clear Cache button on /admin/settings afterwards: this writes to
 * Mongo directly and cannot reach Next's revalidation.
 */

import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

import mongoose from "mongoose";

import {
  CROSS_ORIGIN_WINDOW_DAYS,
  dayKey,
  daysApart,
  isLegacyImport,
  mergePhotoKeys,
  normalizeTitle,
} from "./event-identity.mjs";

// ── options ──────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    apply: false,
    institution: null,
    json: null,
    quiet: false,
  };
  for (const arg of argv) {
    if (arg === "--apply") opts.apply = true;
    else if (arg === "--quiet") opts.quiet = true;
    else if (arg.startsWith("--institution=")) {
      opts.institution = arg.slice("--institution=".length);
    } else if (arg.startsWith("--json=")) {
      opts.json = arg.slice("--json=".length);
    } else {
      console.error(`[dedupe] unknown option ${arg}`);
      process.exit(2);
    }
  }
  return opts;
}

// ── limits, mirrored from src/lib/validation/events.ts ───────────────────────

const GALLERY_MAX = 200;
// inferCategory's fallback in the importer. A copy carrying anything else
// classified the event more precisely than the default did.
const DEFAULT_CATEGORY = "Campus Life";

// ── models ───────────────────────────────────────────────────────────────────
// `strict: false`, same reasoning as the seed script: src/lib/models is the
// source of truth and re-declaring the schemas here would create a second
// definition to keep in sync.

const Event = mongoose.model(
  "Event",
  new mongoose.Schema({}, { strict: false, collection: "events" }),
);
const AuditLog = mongoose.model(
  "AuditLog",
  new mongoose.Schema({}, { strict: false, collection: "auditlogs" }),
);

// ── clustering ───────────────────────────────────────────────────────────────

/**
 * Group by college + normalized title — those buckets are small — then split
 * each bucket by date in two passes, mirroring findTwin().
 *
 * Pass one is the calendar day, which is what collapses the five records of
 * the CAD software seminar (all 15 October) into a single group rather than
 * pairing them off into three.
 *
 * Pass two allows the retyped-date drift, and only where the bucket came out
 * of pass one as exactly one CMS group facing exactly one legacy group. Any
 * more than that and a four-week window cannot tell drift from a genuinely
 * different event of the same name — see the note on findTwin().
 */
export function clusterDuplicates(docs) {
  const buckets = new Map();
  for (const doc of docs) {
    const key = `${doc.institution}|${normalizeTitle(doc.title)}`;
    const bucket = buckets.get(key);
    if (bucket) bucket.push(doc);
    else buckets.set(key, [doc]);
  }

  const clusters = [];
  const review = [];
  for (const bucket of buckets.values()) {
    if (bucket.length === 1) continue;

    const byDay = new Map();
    for (const doc of bucket) {
      const key = dayKey(doc.event_date);
      const group = byDay.get(key);
      if (group) group.push(doc);
      else byDay.set(key, [doc]);
    }
    let groups = [...byDay.values()];

    if (groups.length === 2) {
      const [a, b] = groups;
      const legacy = (g) => g.every(isLegacyImport);
      const cms = (g) => g.every((d) => !isLegacyImport(d));
      const crossOrigin = (legacy(a) && cms(b)) || (legacy(b) && cms(a));
      if (
        crossOrigin &&
        daysApart(a[0].event_date, b[0].event_date) <= CROSS_ORIGIN_WINDOW_DAYS
      ) {
        groups = [[...a, ...b]];
      }
    }

    for (const group of groups) {
      if (group.length > 1) clusters.push(group);
    }
    // Same title, but the dates (or the origins) kept them apart. Could be a
    // yearly fixture, could be a duplicate whose date nobody can trust. Not a
    // call this script is entitled to make.
    if (groups.length > 1) review.push(groups);
  }
  return { clusters, review };
}

/**
 * The surviving row. The long body is the thing that cannot be reconstructed
 * from the other copy — photographs get merged either way — so description
 * length decides, then the album, then age, so the oldest slug (the one that
 * has been linked to longest) survives a tie.
 */
export function pickWinner(cluster) {
  return [...cluster].sort((a, b) => {
    const byDesc = (b.description ?? "").length - (a.description ?? "").length;
    if (byDesc) return byDesc;
    const byGallery = (b.gallery?.length ?? 0) - (a.gallery?.length ?? 0);
    if (byGallery) return byGallery;
    return new Date(a.created_at ?? 0) - new Date(b.created_at ?? 0);
  })[0];
}

/**
 * Everything the losers hold that the winner does not. A loser's cover becomes
 * a gallery photo — there is only one hero — and the winner's own cover is
 * kept out of its gallery so the detail page doesn't stack the hero on an
 * identical tile, the same rule the importer applies.
 */
export function mergeInto(winner, losers) {
  const photos = mergePhotoKeys(
    winner.image,
    winner.gallery,
    losers.flatMap((l) => [l.image, ...(l.gallery ?? [])]),
    GALLERY_MAX,
  );

  const update = {};
  // No cover of its own: promote the first merged photograph rather than leave
  // a card-shaped hole in the grid.
  if (!winner.image && photos.length) {
    update.image = photos.shift();
  }
  if (photos.length > GALLERY_MAX) photos.length = GALLERY_MAX;
  if (
    photos.length !== (winner.gallery?.length ?? 0) ||
    photos.some((k, i) => k !== winner.gallery?.[i])
  ) {
    update.gallery = photos;
  }

  if (!winner.excerpt) {
    const excerpt = losers.map((l) => l.excerpt).find(Boolean);
    if (excerpt) update.excerpt = excerpt;
  }
  if (!winner.description) {
    const description = losers.map((l) => l.description).find(Boolean);
    if (description) update.description = description;
  }
  if (!winner.location) {
    const location = losers.map((l) => l.location).find(Boolean);
    if (location) update.location = location;
  }
  if (!winner.category || winner.category === DEFAULT_CATEGORY) {
    const category = losers
      .map((l) => l.category)
      .find((c) => c && c !== DEFAULT_CATEGORY);
    if (category) update.category = category;
  }
  // A copy still on the site keeps the merged event on the site.
  if (!winner.is_active && losers.some((l) => l.is_active)) {
    update.is_active = true;
  }
  return update;
}

// ── reporting ────────────────────────────────────────────────────────────────

function describe(doc) {
  return {
    id: String(doc._id),
    slug: doc.slug,
    origin: isLegacyImport(doc) ? "legacy" : "cms",
    date: dayKey(doc.event_date),
    category: doc.category,
    body: (doc.description ?? "").length,
    photos: (doc.gallery?.length ?? 0) + (doc.image ? 1 : 0),
  };
}

function printCluster(cluster, winner, update) {
  console.log(`\n  ${winner.institution} · ${winner.title}`);
  for (const doc of cluster) {
    const d = describe(doc);
    const mark = doc === winner ? "KEEP  " : "DELETE";
    console.log(
      `    ${mark} ${d.slug}\n` +
        `           ${d.origin} · ${d.date} · ${d.category} · ` +
        `${d.body} chars · ${d.photos} photos`,
    );
  }
  const gained =
    (update.gallery?.length ?? winner.gallery?.length ?? 0) -
    (winner.gallery?.length ?? 0);
  if (gained > 0)
    console.log(`    → ${gained} photo(s) merged into the keeper`);
}

function printReview(groups) {
  console.log(
    `\n[dedupe] ${groups.length} title(s) with more than one event that were ` +
      `NOT merged — same name, different date or different content. Judge ` +
      `these by hand:`,
  );
  for (const found of groups) {
    const first = found[0][0];
    console.log(`\n  ${first.institution} · ${first.title}`);
    for (const cluster of found) {
      const parts = cluster.map((d) => {
        const x = describe(d);
        return `${x.date} (${x.origin}, ${x.body} chars, ${x.photos} photos) ${x.slug}`;
      });
      console.log(`    - ${parts.join("\n      + ")}`);
    }
  }
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "[dedupe] MONGODB_URI is not set. Run this with the app's .env.",
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15_000 });
  console.log(
    `[dedupe] connected to MongoDB${opts.apply ? "" : " (dry run — pass --apply to write)"}`,
  );

  const filter = opts.institution ? { institution: opts.institution } : {};
  const docs = await Event.find(filter).lean();
  console.log(`[dedupe] ${docs.length} events loaded`);

  const { clusters, review } = clusterDuplicates(docs);
  const plan = clusters.map((cluster) => {
    const winner = pickWinner(cluster);
    const losers = cluster.filter((d) => d !== winner);
    return { cluster, winner, losers, update: mergeInto(winner, losers) };
  });

  const deletions = plan.reduce((n, p) => n + p.losers.length, 0);
  if (!opts.quiet) {
    for (const p of plan) printCluster(p.cluster, p.winner, p.update);
    if (review.length) printReview(review);
  }

  if (opts.json) {
    writeFileSync(
      opts.json,
      JSON.stringify(
        {
          duplicates: plan.map((p) => ({
            title: p.winner.title,
            institution: p.winner.institution,
            keep: describe(p.winner),
            delete: p.losers.map(describe),
            merged_photos:
              (p.update.gallery?.length ?? p.winner.gallery?.length ?? 0) -
              (p.winner.gallery?.length ?? 0),
          })),
          review: review.map((found) =>
            found.map((cluster) => cluster.map(describe)),
          ),
        },
        null,
        2,
      ),
    );
    console.log(`\n[dedupe] plan written to ${opts.json}`);
  }

  if (opts.apply && deletions) {
    for (const p of plan) {
      if (Object.keys(p.update).length) {
        await Event.updateOne(
          { _id: p.winner._id },
          { $set: { ...p.update, updated_at: new Date() } },
        );
      }
      await Event.deleteMany({ _id: { $in: p.losers.map((l) => l._id) } });
    }
    await AuditLog.create({
      entity_type: "event",
      action: "deleted",
      user_email: process.env.SEED_UPLOADED_BY || "admin@jct.ac.in",
      summary:
        `Merged ${deletions} duplicate event(s) into ${plan.length} record(s) ` +
        `left by the legacy news & events import`,
      // The lean schema above has no timestamps config, so the field the real
      // AuditLog model would fill in has to be set by hand.
      created_at: new Date(),
    });
  }

  console.log("\n[dedupe] done");
  console.table({
    "duplicate groups": plan.length,
    "events deleted": opts.apply ? deletions : 0,
    "events that would be deleted": opts.apply ? 0 : deletions,
    "photos merged into keepers": plan.reduce(
      (n, p) =>
        n +
        ((p.update.gallery?.length ?? p.winner.gallery?.length ?? 0) -
          (p.winner.gallery?.length ?? 0)),
      0,
    ),
    "titles needing review": review.length,
    "events remaining": docs.length - (opts.apply ? deletions : 0),
  });

  if (!opts.apply && deletions) {
    console.log(
      "\nNothing was written. Re-run with --apply to carry this out.",
    );
  } else if (opts.apply && deletions) {
    console.log(
      "\nNext: clear the public cache so the merged events render — the " +
        "Clear Cache button on /admin/settings.",
    );
  }

  await mongoose.disconnect();
}

// Importing this file gives you the pure functions above without touching
// Mongo, the same arrangement as seed-news-events.mjs.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch(async (err) => {
    console.error("[dedupe] failed:", err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
}
