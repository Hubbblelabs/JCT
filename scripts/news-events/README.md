# News & Events migration

Imports every published `news-event` post from the three legacy WordPress
installs on the old server into the `Event` collection, photo albums included.

| Source (old site, `182.74.29.15`)    | Institution    | Events |
| ------------------------------------ | -------------- | -----: |
| `/engineering/life-jct/news-events/` | `engineering`  |    881 |
| `/cas/` news posts                   | `arts-science` |      6 |
| `/polytechnic/` news posts           | `polytechnic`  |    114 |

**1001 events, 10,313 unique images, 1.72 GB of source JPEGs.** Re-encoded to
WebP on the way in, so what lands in object storage is considerably smaller.

## Two steps, and only the second one runs against production

### 1. `extract.php` — already done

Runs on the **old** server, reads the DB credentials out of each install's
`wp-config.php`, and dumps a faithful JSON manifest. Its output is committed as
`manifest.json.gz` (573 KB), so the import needs no database access to the
legacy MySQL at all.

Only re-run this if the old site gains new posts before the cutover:

```bash
scp scripts/news-events/extract.php root@182.74.29.15:/tmp/
ssh root@182.74.29.15 'php /tmp/extract.php' > manifest.json
gzip -9 manifest.json && mv manifest.json.gz scripts/news-events/
```

The manifest is a dump, not a migration: slugs, dates and HTML are untouched.
Every transform lives in `seed-news-events.mjs`, so it stays reviewable and a
re-run against the same manifest produces the same result.

### 2. `seed-news-events.mjs` — the import

Runs on the **new** server. It reads the manifest, pulls each referenced image
over HTTP from the old site, re-encodes it to WebP exactly the way
`/api/admin/images/upload` does, stores it, records an `ImageAsset`, and upserts
the `Event`.

It talks to MongoDB and object storage directly rather than going through the
admin API, because the upload route is rate limited to 60 images per minute per
account — 10,313 images would be a six-hour run against production — and
`proxy.ts` truncates any `/api/admin/*` body at 10 MB. The consequence is that
it has to reproduce the route's conventions instead of inheriting them: if the
WebP settings or the `ImageAsset` fields ever change there, change them here too.

## Running it

The script needs `mongoose`, `sharp` and `@aws-sdk/client-s3`, all of which the
app image already carries, plus the app's `.env`. `docker compose run` starts a
**new, throwaway** container from that image — it does not touch, restart or
reconfigure the running `jct` container:

```bash
cd /root/jctSite && git pull
```

### Always pass `--source` with the old server's LAN address

```
--source=http://192.168.20.70
```

The manifest records the old site's public origin, `http://182.74.29.15`, and
**that address does not work from the production host.** Both machines sit on
`192.168.20.0/22` — old is `192.168.20.70`, new is `192.168.20.20`, 0.3 ms
apart — but the new server routes the old server's _public_ IP out through the
gateway, where it is dropped: ICMP, port 80 and port 22 all time out, while the
rest of the internet is fine. Curiously the reverse works, so the two are not
symmetrically firewalled.

This is not a footnote. The first production run silently imported ten events
with no photographs at all before anyone noticed, which is why the script now
fetches one image before touching the database and refuses to start if it
cannot. Over the LAN the same images come back at ~60 MB/s.

### The run

Dry run first — it writes nothing and reports exactly what the real run would
do (it skips the source check, since it fetches nothing):

```bash
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T --entrypoint node -v /root/jctSite/scripts:/app/scripts jct scripts/news-events/seed-news-events.mjs --dry-run
```

Then a single-college smoke test, so a mistake costs seven events rather than a
thousand:

```bash
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T --entrypoint node -v /root/jctSite/scripts:/app/scripts jct scripts/news-events/seed-news-events.mjs --source=http://192.168.20.70 --institution=arts-science
```

Check `/admin/events` and one public detail page, then run the rest:

```bash
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T --entrypoint node -v /root/jctSite/scripts:/app/scripts jct scripts/news-events/seed-news-events.mjs --source=http://192.168.20.70 --concurrency=8
```

Over the LAN the whole import takes **about four minutes** — 1.72 GB of source
JPEGs in, 947 MB of WebP out. (Against the public address it would have been
hours, if it worked at all.)

Finally, clear the public cache with the **Clear Cache** button on
`/admin/settings` — the script writes to Mongo directly, so nothing has called
`revalidateTargets` and the ISR pages are still holding the old empty listings.

### Options

| Flag                   | Effect                                                   |
| ---------------------- | -------------------------------------------------------- |
| `--source=<origin>`    | Where to fetch images from. See above — always set this. |
| `--dry-run`            | Report only; writes nothing.                             |
| `--force`              | Overwrite events that already exist.                     |
| `--institution=<slug>` | Limit to one college.                                    |
| `--limit=<n>`          | Stop after n events.                                     |
| `--concurrency=<n>`    | Parallel image fetches (default 6).                      |

`SEED_SOURCE_ORIGIN` sets the source from the environment instead.

### If it stops halfway

Start it again. Storage keys are derived from the legacy attachment id, so an
image already in the bucket is skipped, and an event whose slug already exists
is left alone unless `--force` is passed. Nothing is uploaded or written twice.

Images that could not be fetched are listed at the end and retried on the next
run; the import does not abort for one bad photo.

If the app image ever stops carrying one of the three dependencies, the import
fails immediately with `ERR_MODULE_NOT_FOUND`. Run it from a plain Node
container instead:

```bash
docker run --rm --network host -v /root/jctSite:/work -w /work --env-file /root/jctSite/.env node:26-slim sh -c 'npm i --no-save mongoose sharp @aws-sdk/client-s3 && node scripts/news-events/seed-news-events.mjs'
```

## What the transforms do

- **Slugs.** `Event.slug` is globally unique, but eight titles genuinely repeat
  between the engineering and polytechnic sites (Republic Day, Onam, the job
  fairs), 240 legacy slugs are longer than the 80-character cap, and four are
  percent-encoded Tamil. They are decoded, stripped, truncated, and numbered
  `-2`, `-3` in manifest order — engineering first, oldest first. Numbering is
  computed over the whole manifest before `--institution` / `--limit` are
  applied, so a one-college smoke test and the full run agree on every slug;
  deriving them from the filtered set would re-import the smoke-tested college
  a second time under `-2`. Any target slug an admin-created event already owns
  is reported at the start of the run.
- **Recognising an event that is already there.** The slug is not enough, and
  the first production run proved it: of the 69 events already typed into the
  admin, 46 slugified to exactly the generated slug and were skipped, but 23 did
  not — `international-women-s-day-2026` against the generated
  `international-womens-day-2026` — and were imported a second time. So a post
  that matches an existing record on college + normalized title + date has its
  photo album merged into that record instead, and no second row is created.
  Newly created events join the same index as the run proceeds, which collapses
  the duplicates the legacy sites carry themselves (the same event posted twice,
  minutes apart, by two departments). The rule lives in `event-identity.mjs` and
  is shared with `dedupe-events.mjs`; see that section below for why the date
  window is as narrow as it is.
- **Dates.** The 2021 migration into this WordPress stamped several hundred
  backlog posts with the import date, so `post_date` alone would file a 2010
  conference under 2021. The `wpcf-event-date` / `wpcf-date` custom field is
  preferred where it exists, then `publication_date`, then `post_date` — which
  works out as 425 / 6 / 570 across the thousand posts. `_wp_old_date` is
  deliberately ignored: it looks like a date field, and it would have covered
  another 517 posts, but it is WordPress's own bookkeeping — core writes the
  _previous_ `post_date` there when an editor re-dates a post, purely so old
  permalinks keep redirecting. Using it would have back-dated posts by a few
  days at random.
- **Categories.** The legacy posts carry no taxonomy. The category is inferred
  from the title against the existing `EVENT_CATEGORY_SUGGESTIONS` badges,
  defaulting to `Campus Life`. Matching the body instead would drag half the
  archive into `Placement`, because nearly every report thanks the placement
  cell.
- **Excerpts.** 998 of the posts have an empty excerpt, so it is derived from
  the body text and cut on a word boundary.
- **Bodies.** Every tag the legacy content uses is already in the
  `sanitizeHtml` allowlist. Nine posts were typed as plain text with blank
  lines; those get wrapped in paragraphs.
- **Cover images.** The featured image is also the album's first photo in the
  legacy theme, so it is uploaded once and removed from the gallery — otherwise
  the detail page stacks the hero on an identical tile. The 14 posts with no
  featured image fall back to the album's first photo.
- **Non-images.** Eight MP4s and two DOCX files are attached to these posts as
  gallery entries. `Event.gallery` is images only, so they are skipped and
  counted in the summary.

## `dedupe-events.mjs` — cleaning up what the first run duplicated

The first production import ran on 11 August 2026 with slug-only matching and
left 31 duplicate `Event` documents behind: 20 from CMS records it failed to
recognise, 11 already duplicated on the legacy sites. This script finds them and
collapses them.

```bash
# dry run — prints the plan and the review list, writes nothing
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T --entrypoint node -v /root/jctSite/scripts:/app/scripts jct scripts/news-events/dedupe-events.mjs

# carry it out
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T --entrypoint node -v /root/jctSite/scripts:/app/scripts jct scripts/news-events/dedupe-events.mjs --apply
```

| Flag                   | Effect                                            |
| ---------------------- | ------------------------------------------------- |
| `--apply`              | Merge and delete. Without it, nothing is written. |
| `--institution=<slug>` | Limit to one college.                             |
| `--json=<path>`        | Write the plan and review list as JSON.           |
| `--quiet`              | Suppress the per-group breakdown.                 |

Two decisions in it are load-bearing.

**Nothing is thrown away.** The two copies of an event are complementary: the
CMS record has the long hand-written body and two or three photographs, the
imported one has a thin body and the entire WordPress album — up to 29 images.
So the longer body wins the row, every photograph from the other copies is
merged into its gallery, and only then are they deleted. No storage key is
orphaned, which is why this script needs no S3 credentials and no
`cleanupStorageKeys` pass.

**The date window does not run transitively.** The same calendar day is the only
unconditional match. `CROSS_ORIGIN_WINDOW_DAYS` (four weeks) exists because an
editor retyping an event into the CMS often enters a different day from the one
the legacy post carries — the BTBCE industrial visit is filed 3 January by
WordPress and 31 January by its twin — but it is applied only where a title's
records come out as exactly one CMS group facing one legacy group. Three
departments each held an _Engineer's Navaratri Golu Fest-2025_, on 22, 24 and 30
September, each typed into the CMS and each posted to WordPress; a window
allowed to chain across them turns six correct records into one event and five
wrong deletions.

Anything the rule will not judge — annual fixtures, three departments' separate
association inaugurals in one fortnight, two posts a day apart with different
photographs — is printed as a **review list** rather than guessed at. Nine
titles came out that way on the production run.

Clear the public cache from `/admin/settings` afterwards, same as the import.

## Schema headroom this needed

`src/lib/validation/events.ts` was widened for the real data — the caps were set
before anyone had measured it:

- `titleMax` 160 → 280 (the longest legacy title is 261 characters; 32 exceed 160).
- `galleryMax` 24 → 200 (64 albums exceed 24; the largest is a 172-photo
  graduation day).
