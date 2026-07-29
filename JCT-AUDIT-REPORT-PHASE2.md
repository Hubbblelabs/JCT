# JCT Institutions — Phase 2 Audit

**Repo:** `D:\Github\JCT` · **Branch:** `v2-admin` (HEAD `954ec61`, unchanged since Phase 1) · **Date:** 2026-07-28
**Scope:** backup/restore, admin content editing, navigation/ordering, responsiveness, unhandled configuration.
**Method:** same standard as Phase 1 — live testing against the real QA MongoDB (`jct_qa`) and R2 bucket
(`jct-qa`) driving a production build (`next start`), authenticated as both admin and editor, plus browser
viewport probes at 375 / 768 / 1280.

> **Environment restored.** QA DB truncated to 0 docs across all 11 collections, R2 bucket back to 0 objects,
> servers stopped, working tree clean (only the two report files are untracked). No application code changed.

---

## 0. Phase 1 Regression Check

| Finding | Status | Evidence |
|---|---|---|
| **F1** — `trustHost` / prod login 500 | 🔴 **STILL OPEN** | `AUTH_TRUST_HOST` / `trustHost` appear nowhere in `src/auth.ts`, `.env`, `.env.example`, `dockerfile`, `docker-compose.prod.yaml`. Phase 2 testing required `AUTH_TRUST_HOST=true` to log in at all. |
| **F2** — draft programs leak on public API | 🔴 **STILL OPEN** | `src/app/api/public/programs/route.ts:13` unchanged (`=== "true"`); `src/lib/public-programs.ts:112` still `publishedOnly = false`. |

No commits since the Phase 1 audit — F3–F10 are also unchanged. **F1 remains the highest-priority item in
the entire backlog**: it is a total loss of admin access in production, and it is a one-line fix.

---

## 1. Pass/Fail Summary by Area

| Area | Verdict | Notes |
|---|---|---|
| **Backup — feature exists** | ✅ PASS | 5 admin routes + full Settings UI |
| **Backup — coverage** | ✅ PASS | Config + 6 content collections + asset metadata + manifest |
| **Backup — R2 binaries** | ⚠️ PARTIAL | Supported, but **off by default** (P2-2) |
| **Backup — storage/retention/versioning** | ⚠️ PARTIAL | Download-only; no history, no schedule, date-only filename (P2-4) |
| **Restore — field-level revert** | ✅ PASS | Nav order, nesting, config, deleted docs all reverted exactly |
| **Restore — point-in-time fidelity** | ❌ **FAIL** | Additive merge; post-backup rows survive (P2-3) |
| **Restore — schema drift handling** | ❌ **FAIL** | **Silently** writes malformed docs, reports success (P2-1) |
| **Restore — config path validation** | ✅ PASS | Zod-gated, 422 on bad value, original preserved |
| **Restore — authz & injection** | ✅ PASS | Admin-only; collection allowlist; malformed keys rejected |
| **Admin — schema ↔ UI field coverage** | ✅ PASS | Every Program/Page schema field has an edit surface |
| **Admin — HTML sanitization** | ✅ PASS | All 7 XSS vectors stripped at render |
| **Admin — block types creatable** | ✅ PASS | All 6 section kinds creatable and renderable |
| **Admin — custom tabs editor** | ❌ **FAIL** | Writes `content.tabs`, which no public layout reads (P2-5) |
| **Draft → publish propagation** | ✅ PASS | `revalidatePath` verified working (cache `MISS` after publish) |
| **Nav — persisted order** | ✅ PASS | Array-position order; survives save + renders in order |
| **Nav — parent/child nesting** | ✅ PASS | Children survive save and restore |
| **Nav — orphaned page detection** | ⚠️ GAP | No orphan flagging anywhere (P2-7) |
| **Responsive — public pages** | ✅ PASS | No h-scroll at 375/768/1280; all images `next/image` |
| **Responsive — admin panel** | ❌ FAIL @375 | Tab nav collapses to a 44px sliver (P2-6) |
| **Env vars documented** | ⚠️ PARTIAL | 2 undocumented + a structural blind spot (P2-8) |
| **404 / 500 pages** | ⚠️ PARTIAL | Both exist; no `global-error.tsx` (P2-9) |
| **Health endpoint** | ⚠️ PARTIAL | Exists but doesn't check DB (P2-10) |

---

## 2. Findings

### 🔴 P2-1 — CRITICAL: Collection restore performs **no validation** and fails silently

`src/app/api/admin/site-config/restore-collections/route.ts:86` writes documents straight through the
**native MongoDB driver**:

```ts
await col.replaceOne({ _id: id }, body, { upsert: true });
```

This bypasses Mongoose schemas entirely — no required-field check, no type coercion, no enum validation.
Every malformed document below was **accepted and written**, and the API reported success:

| Test | Archive contained | Result in DB | API response |
|---|---|---|---|
| Required field removed | `name` deleted | `name` **gone** from the document | `{"restored":1,"failed":0}` |
| Field renamed | `seats` → `seat_count` | `seats` gone, `seat_count:30` written | `{"restored":1,"failed":0}` |
| Wrong types / bad enums | `seats:"not-a-number"`, `institution:"hogwarts"`, `status:"bogus-status"` | all three written verbatim | `{"restored":1,"failed":0}` |

The user's question was whether drift fails loudly or silently drops data. **It fails silently, and it is
worse than dropping data — it corrupts.** The `institution:"hogwarts"` case is the clearest harm: that
program is now invisible to every institution-scoped query on the site (public pages, admin lists, editor
scoping) while the restore reported `failed:0`. I hit this accidentally mid-audit — a program vanished from
its public URL and it took a DB dump to work out why.

Note the inconsistency: the **config** restore path right next door (`restore/route.ts:99`) *does* validate
with Zod and correctly returned `422` while preserving the stored value. The two halves of the same feature
have opposite safety properties.

**Fix** — validate against the same Zod schemas the write APIs already use, before writing:

```ts
import { ProgramCreateSchema } from "@/lib/validation";

const SCHEMAS: Record<string, ZodType> = { programs: ProgramCreateSchema, pages: PageCreateSchema, /* … */ };

const schema = SCHEMAS[name];
const parsed = schema.safeParse(body);
if (!parsed.success) {
  errors.push(`${name} ${doc._id}: ${parsed.error.issues.map(i => i.message).join(", ")}`);
  continue;               // report it — never write it
}
await col.replaceOne({ _id: id }, body, { upsert: true });
```

Return a non-2xx (or at minimum surface `failed > 0` prominently in the UI) when any document is rejected,
so a partial restore cannot look like a clean one.

---

### 🟠 P2-2 — HIGH: Backups exclude R2 binaries by default

`src/app/admin/(protected)/settings/page.tsx:254-255`:

```ts
const [includeImages, setIncludeImages] = useState(false);
const [includeDocs,   setIncludeDocs]   = useState(false);
```

Both checkboxes default **off**, so the button labelled "Download Backup" produces a DB-only archive.
Verified live — two backups of identical data:

```
BACKUP A (default)  3.0 KB  8 entries   binary assets: 0
  files: site-config.json, collections/{programs,pages,placements,testimonials,recruiters,events}.json, manifest.json

BACKUP B (?includeImages=1&includeDocs=1)  3.9 KB  11 entries   binary assets: 1
  + images/_metadata.json, images/<key>.webp, documents/_metadata.json
```

The default archive contains neither the image bytes **nor `images/_metadata.json`** — so restoring it into
a fresh or partially-purged bucket leaves every image reference dangling, with nothing in the archive to
even enumerate what is missing. Given that Phase 1 confirmed deletes cascade into R2 object removal, "restore
the backup" is exactly the recovery path an operator would reach for after a bad delete — and by default it
cannot restore the files.

The engineering underneath is good: `collectAssetKeys` unions R2's actual listing with DB-tracked keys (so
seeded files with no `ImageAsset` row are still captured), fetches run through a bounded 12-way pool with a
90s per-object timeout, and unreadable objects are counted in the manifest rather than aborting the run.
The default is the only problem.

**Fix** — default both to `true`, and if archive size is the concern, make *excluding* assets the explicit
opt-out with a warning that the result is not restorable without the bucket.

---

### 🟠 P2-3 — HIGH: Restore is an additive merge, not a point-in-time restore

Both restore paths upsert and **never delete**. Documents (and config keys) created *after* the backup
survive a restore, so the post-restore database does not match the archive.

Verified live — backup taken, then four mutations, then restore from that backup:

```
                          before backup    after mutation   after restore
nav order                 First>Second>Third  Third>First>Second  First>Second>Third   PASS
nav nested children       Second[ChildA,ChildB]  Second[ChildB-RENAMED]  Second[ChildA,ChildB]  PASS
contact.phone/email/addr  seed values      changed values   seed values          PASS (all 3)
deleted program qa-alpha  present          deleted          restored             PASS
deleted config qaLegacyKey present         deleted          restored             PASS
program count             2                2                3                    FAIL
```

`qa-gamma`, created after the backup, was still present afterwards. Everything the user asked to verify
*did* revert — including the non-obvious ones (nested nav children, the un-registered legacy config key,
all three contact subfields). The gap is purely that additions are never reversed.

This matters most for the likeliest real use case: a bad bulk import or a compromised editor session. An
operator restores "the good backup", sees success, and the bad rows are still live.

**Fix** — offer a "replace" mode alongside the current "merge": within each restored collection, delete
documents whose `_id` is absent from the archive. Keep merge as the default, make the mode explicit in the
UI, and state plainly which one the operator is getting. At minimum, document the current behaviour in the
Settings copy — today nothing says restore is additive.

---

### 🟠 P2-4 — MEDIUM-HIGH: No backup retention, versioning, scheduling, or unique filenames

- **Storage:** none server-side. `GET /backup` streams a ZIP to the browser; nothing is persisted. There is
  no backup history, no "restore previous", and nothing to clean up.
- **Scheduling:** none. Backups are entirely manual — if nobody clicks the button, there is no backup.
- **Versioning/timestamp:** the filename is **date-only**:
  ```ts
  const filename = `jct-backup-${new Date().toISOString().slice(0, 10)}.zip`;   // backup/route.ts:276
  ```
  Both of my test backups came back as `jct-backup-2026-07-28.zip`. Two backups on the same day silently
  overwrite each other in the operator's downloads folder — and the second one is the one taken *after* the
  mistake.

The archive interior is versioned properly (`manifest.json` carries `version: "2.1"`, `exported_at`,
`exported_by`, and per-collection counts), so the metadata exists; it just isn't in the filename.

**Fix** — include the time in the filename (`…-2026-07-28T1621Z.zip`), and add a scheduled server-side
backup (a cron route writing to a dedicated R2 prefix with an N-day retention sweep) so recovery does not
depend on someone having remembered.

---

### 🟠 P2-5 — HIGH: The "Custom Page Tabs" editor writes content nothing renders

`src/components/admin/ProgramContentEditor.tsx:1929-1939` presents an Advanced panel whose help text states:

> "Custom tabs override the structured fields above on the public page. Use these only if the standard
> six-tab layout is insufficient."

It writes to `content.tabs` via `set("tabs", next)`. But the public program page renders through
`ProgramPageLayout`, which **never reads `dept.tabs`** — zero matches in the file; it reads `dept.tabsConfig`
and renders `tab.blocks` via `PageBlocksRenderer` (lines 2150-2276).

The only component that renders the `tabs[].sections[]` model is `TabsProgramLayout.tsx`, and it is
**imported nowhere in the codebase** — dead code.

Reproduced end-to-end:
```
PATCH content.tabs[0].sections[0] = {kind:"richText", html:"<p>MK…</p>"}   → 200
POST  /publish                                                            → 200
GET   /institutions/engineering/programs/qa-alpha  req1 x-nextjs-cache=MISS  (cache purged, page re-rendered)
      marker present in response: false   ← content never rendered
```
The `MISS` is important: revalidation worked correctly, the page genuinely re-rendered from fresh data, and
the content still did not appear. This is a render-path gap, not a caching problem.

Two further consequences:
- `POST /api/admin/programs/[id]/migrate-tabs` builds `content.tabs` from legacy fields
  (`migrate-tabs/route.ts:257-259`) — the documented migration endpoint produces unrenderable content.
- `CLAUDE.md` documents `tabs[] → sections[] → {type, content}` as *the* Program content shape. Both the
  field (`tabs` vs `tabsConfig`) and the section keys (`{type, content}` vs the real `{kind, html}`) are
  wrong, which is what led me to author an unrenderable fixture in the first place.

The **primary** structured editor path is unaffected and works correctly — this is scoped to the Advanced
panel, the migrate endpoint, and the docs.

**Fix** — decide which model wins. Either wire `ProgramPageLayout` to fall back to `TabsProgramLayout` when
`content.tabs` is non-empty (honouring the "override" promise in the UI copy), or delete the Custom Page
Tabs panel, `TabsProgramLayout.tsx`, and the `migrate-tabs` route, and correct `CLAUDE.md`. Leaving a
control that silently discards the operator's work is the worst of the three options.

---

### 🟡 P2-6 — MEDIUM: Admin tab navigation collapses at mobile width

`AdminTabNav.tsx:81` — `<nav className="scrollbar-hide flex min-w-0 items-center gap-0.5 overflow-x-auto">`.
Measured on `/admin/programs`:

| Viewport | Nav visible width | Nav content width | Result |
|---|---|---|---|
| 1280 | full | fits | ✅ clean, 0 overflow |
| 768 | 308px | 666px | ⚠️ usable but cramped; scrollbar hidden, no affordance |
| 375 | **44px** | 666px | ❌ effectively unusable — 60 nav elements overflow |

There is no hamburger/drawer fallback; `hidden md:inline` / `hidden sm:inline` only hide *labels*, which
shrinks the strip further rather than restructuring it. The page body itself never horizontally scrolls, and
data tables are correctly wrapped in `div.admin-card.overflow-x-auto` (table 517px scrolling inside a 326px
card) — so the layout is sound apart from the nav.

**Stated intent:** the admin panel is **desktop-first**, and that is a reasonable call for a CMS. At 768
(tablet) it does not visually break — it degrades but remains operable, which satisfies the tablet bar. At
375 it does break.

**Fix** — below `md`, swap the horizontal strip for a hamburger-triggered drawer (or a `<select>` jump
menu). If mobile support is explicitly out of scope, add a visible scroll affordance (edge fade + arrows) at
`sm`/`md` so the hidden scrollbar is discoverable, and consider an "optimised for desktop" notice under 640px.

---

### 🟡 P2-7 — MEDIUM: No orphaned-page detection

Confirmed live: a published page (`main` / `qa-page`) whose URL `/p/qa-page` appears in no navbar config is
reachable only by direct URL. Nothing in the admin flags this — the pages list has no orphan indicator, and
`GET /api/admin/pages` returns no such field.

For a site whose whole point is discoverability, a published-but-unlinked page is invisible to users but
still indexed by search engines. Editors get no signal that they published something nobody can navigate to.

**Fix** — the check is cheap and entirely server-side: collect every `href` across the four `*Navbar` config
keys (including `children[]`), compare against `/p/<slug>` and `/institutions/<inst>/p/<slug>` for each
published page, and badge the unmatched ones "Not in navigation" in the pages list.

---

### 🟡 P2-8 — MEDIUM: Undocumented env vars, and a structural blind spot in `.env.example`

Every `process.env.*` reference diffed against `.env.example`:

| Var | In code | In `.env.example` |
|---|---|---|
| `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, all 4 `R2_*`, `NEXT_PUBLIC_R2_PUBLIC_URL` | ✅ | ✅ |
| `MONGODB_MAX_POOL_SIZE` (`src/lib/mongodb.ts:34`) | ✅ | ❌ **missing** |
| `SEED_DNS_SERVERS` (`scripts/_mongo-dns.mjs`) | ✅ | ❌ **missing** |
| `NODE_ENV`, `NEXT_PHASE` | ✅ | n/a — framework-provided |

`MONGODB_MAX_POOL_SIZE` is the more significant omission: its own code comment says to lower it on
serverless to avoid exhausting the Atlas connection cap, but an operator reading `.env.example` never learns
the knob exists.

**The structural point matters more than the two vars.** The user correctly identified grep-vs-`.env.example`
as the method that should have caught `AUTH_TRUST_HOST` — it cannot. `AUTH_TRUST_HOST` is read *inside the
next-auth package*, never via `process.env` in this repo, so it appears in no grep of `src/`. Any config
consumed by a dependency is invisible to this technique.

**Fix** — add the two missing vars, and add a short "consumed by dependencies" block to `.env.example`
covering `AUTH_TRUST_HOST` (and any future library-read config). Better still, fail fast: validate required
env at boot with a Zod schema so a missing/misconfigured var is a startup error with a clear message
rather than a 500 at request time — which is precisely how F1 stayed hidden.

---

### 🟢 P2-9 — LOW: No `global-error.tsx`

`src/app/error.tsx` and `src/app/not-found.tsx` both exist and render correctly (a real `404` is returned for
unmatched static paths — the soft-404 issue from Phase 1 F6 is specific to *dynamic* segments). There is no
`src/app/global-error.tsx`, so an exception thrown in the **root layout** has no boundary and falls back to
Next's built-in error screen — unstyled, and off-brand for a public college site.

Note `src/app/error.tsx` declares `export default function GlobalError(...)`, which reads as if it were the
global handler but is registered as the route-level boundary. Worth renaming to avoid the trap.

### 🟢 P2-10 — LOW: Health endpoint doesn't check dependencies

`GET /api/health` → `{"status":"ok","time":"…"}`. It never touches MongoDB or R2, so it returns `200 ok`
while the database is unreachable. A container orchestrator or uptime monitor pointed at it will report
healthy through a total data outage.

**Fix** — ping the DB (`mongoose.connection.readyState === 1`, or a cheap `db.admin().ping()`) and report
`503` with a per-dependency breakdown when it fails. Keep it unauthenticated but leak nothing beyond
up/down.

### 🟢 P2-11 — LOW: Mongoose deprecation warnings flooding server logs

The server log is dominated by repeated:
```
(node:7548) [MONGOOSE] Warning: mongoose: the `new` option for `findOneAndUpdate()` and
`findOneAndReplace()` is deprecated. Use `returnDocument: 'after'` instead.
```
Emitted on essentially every admin write. Harmless today, but it buries real errors in production logs and
will break when Mongoose drops the option. Mechanical fix: `{ new: true }` → `{ returnDocument: "after" }`.

---

## 3. What Passed

**Restore fidelity (the part that works, and works well).** Every field the user asked to verify reverted
exactly — including the ones easy to miss: nav **child** items nested under a parent, an
**un-registered legacy config key** (`qaLegacyKey`, restored verbatim with an explicit warning rather than
being silently dropped), and all three `contact` subfields. `restore/route.ts:106-110` deliberately stores
the *original* value rather than Zod's parsed output, with a comment explaining that Zod's `.default()`
injection and unknown-key stripping had previously made round-trips lossy — that is a real bug someone
already found and fixed correctly.

**Restore hardening.**

| Probe | Result |
|---|---|
| `collection: "users"` | `400 Unknown collection` — allowlist holds |
| `collection: "auditlogs"` | `400` |
| `collection: "$cmd"` | `400` |
| `config_key: "$evil.key"` | skipped, warned |
| `config_key: "../../etc/passwd"` | skipped, warned |
| Document with no `_id` | `failed:1` with a clear message |
| Schema-invalid config value | `422`, stored value untouched |
| Editor role on all 5 backup/restore routes | `403` × 5 |

`users` and `auditlogs` are excluded from backups by design (`backup-collections.ts:41`) so bcrypt hashes
never ride along in an archive that gets emailed around — a good call, clearly reasoned in the comment.
Duplicate-key collisions during restore fall back to a natural-key match rather than aborting.

**XSS sanitization.** Injected into a program's `richText` section, published, and fetched the rendered
public page. All seven vectors neutralised, and this was verified on a page that genuinely renders (an
earlier run was invalidated because my own drift test had corrupted the fixture — worth stating plainly,
since a 404 page trivially "passes" an XSS test):

```
<script>alert('xss')</script>        stripped
<img onerror="alert(1)">             stripped
<a href="javascript:alert(2)">       stripped
<iframe src="https://evil.com">      stripped
<svg onload="alert(3)">              stripped
<style>body{display:none}</style>    stripped
```

Sanitization is applied **on render** at every `dangerouslySetInnerHTML` site (`TabsProgramLayout:164`,
`ResearchPageLayout:90`, `public-events.ts:175`, `program-tabs.ts:55`), with raw HTML retained in the DB.
That is a defensible sanitize-on-output design and it is applied consistently.

**Draft → publish propagation.** Works without any manual cache bust or redeploy. `publish/route.ts:34-38`
calls `revalidatePaths` for the institution page, the programs list, and the specific program URL;
the first request after publish returned `x-nextjs-cache: MISS`, confirming the ISR entry was genuinely
purged despite the 24h `s-maxage`.

**Navigation.** Order is array position (no separate `order` field needed, and the array order *is* the
persisted order). A reorder via `PUT /api/admin/site-config` persisted correctly and rendered in the new
order on the public home page (`ZZTop` at offset 6100, `AAFirst` at 6561 — matching the saved order).
Parent/child nesting survived save, backup, and restore intact.

**Schema ↔ UI field coverage.** Every field in the Program Mongoose schema and `ProgramBaseSchema`
(`name`, `abbr`, `slug`, `institution`, `degree`, `duration`, `seats`, `image`, `highlight`, `description`,
`outcomes`, `sort_order`, `is_active`) has an editing surface across the programs list page and
`ProgramContentEditor`. No orphaned schema fields, and no form fields without a schema home.

**Block types.** All six section kinds the normalizer emits (`richText`, `stats`, `list`, `cards`, `image`,
`people`) are creatable in `ProgramTabsEditor.emptySection()` — full parity between what can be authored and
what can be rendered. (Whether the *output* reaches the page is P2-5; the type coverage itself is complete.)

**Public responsiveness.** No horizontal scroll at any tested width on home or the courses listing. All
images render through `next/image` with `srcset` (3/3 on home, 7/7 on courses). The two overflowing elements
on the courses page are decorative `absolute` blur circles inside an `overflow-hidden` parent — intentional,
not a layout break. Touch targets under 44px are limited to footer legal links (~20px tall), breadcrumbs,
and a 14×14 icon link — worth tightening, but not a functional break.

**Backup engineering quality.** Bounded-concurrency asset fetching with per-object timeouts, union of R2
listing and DB keys so untracked seeded files are captured, unreadable assets counted rather than fatal, and
a manifest with version + per-collection counts. Aside from the default-off flags (P2-2), this is
well-built.

---

## 4. Recommended Fix Order

| # | Finding | Severity | Effort |
|---|---|---|---|
| 1 | **F1** (Phase 1) `trustHost` — prod login broken | 🔴 Critical | 1 line |
| 2 | **P2-1** Restore writes unvalidated docs, reports success | 🔴 Critical | Small — reuse existing Zod schemas |
| 3 | **F2** (Phase 1) Draft programs leak publicly | 🟠 High | 1 line |
| 4 | **P2-2** Backups exclude R2 binaries by default | 🟠 High | 2 lines (flip defaults) |
| 5 | **P2-5** Custom Tabs editor writes unrenderable content | 🟠 High | Decide model; wire or remove |
| 6 | **P2-3** Restore is additive, not point-in-time | 🟠 High | Medium — add replace mode |
| 7 | **F3** (Phase 1) Proxy fails open | 🟠 High | Small |
| 8 | **P2-4** No retention/schedule/unique filename | 🟠 Med-High | Small → Medium |
| 9 | **P2-6** Admin nav breaks at 375px | 🟡 Medium | Small — drawer below `md` |
| 10 | **P2-7** No orphaned-page detection | 🟡 Medium | Small |
| 11 | **P2-8** Undocumented env + boot-time validation | 🟡 Medium | Small |
| 12 | **F4–F10** (Phase 1) | 🟡/🟢 | See Phase 1 report |
| 13 | **P2-9/10/11** global-error, health depth, Mongoose warnings | 🟢 Low | Small each |

Items 1–4 are each a handful of lines and together close both critical findings plus the two highest-value
data-safety gaps.

No application code was changed during this audit — per project convention, edits are yours to review and
commit.
