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

Dry run first — it writes nothing and reports exactly what the real run would
do:

```bash
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T --entrypoint node -v /root/jctSite/scripts:/app/scripts jct scripts/news-events/seed-news-events.mjs --dry-run
```

Then a single-college smoke test, so a mistake costs six events rather than a
thousand:

```bash
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T --entrypoint node -v /root/jctSite/scripts:/app/scripts jct scripts/news-events/seed-news-events.mjs --institution=arts-science
```

Check `/admin/events` and one public detail page, then run the rest:

```bash
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T --entrypoint node -v /root/jctSite/scripts:/app/scripts jct scripts/news-events/seed-news-events.mjs
```

Budget roughly **40–60 minutes** on the current ~10 Mbps link: 1.72 GB of source
images, fetched six at a time.

Finally, clear the public cache with the **Clear Cache** button on
`/admin/settings` — the script writes to Mongo directly, so nothing has called
`revalidateTargets` and the ISR pages are still holding the old empty listings.

### Options

| Flag                   | Effect                               |
| ---------------------- | ------------------------------------ |
| `--dry-run`            | Report only; writes nothing.         |
| `--force`              | Overwrite events that already exist. |
| `--institution=<slug>` | Limit to one college.                |
| `--limit=<n>`          | Stop after n events.                 |
| `--concurrency=<n>`    | Parallel image fetches (default 6).  |

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

## Schema headroom this needed

`src/lib/validation/events.ts` was widened for the real data — the caps were set
before anyone had measured it:

- `titleMax` 160 → 280 (the longest legacy title is 261 characters; 32 exceed 160).
- `galleryMax` 24 → 200 (64 albums exceed 24; the largest is a 172-photo
  graduation day).
