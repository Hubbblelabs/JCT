# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**JCT Institutions** is a Next.js 16 app that combines a **public marketing/admissions website** and an **admin CMS** for three colleges (Engineering, Arts & Science, Polytechnic) in Coimbatore.

- **Public site** (`/`, `/institutions/*`, `/campus-life`): institution landing pages, program listings, dynamic per-program detail pages, campus life. Server-rendered with ISR caching.
- **Admin CMS** (`/admin/*`): manage programs (via a live-preview content builder), users, images, documents, testimonials, recruiters, page content, and site-wide config.

Persistence is **MongoDB** (Mongoose), auth is **NextAuth.js**, image/document storage is **any S3-compatible object store**. Both are provider-agnostic — MongoDB Atlas or a self-hosted `mongod`, on-prem Garage or a managed S3 — chosen entirely by environment (see "Images & documents" and `src/lib/storage-config.ts`).

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19
- **Language**: TypeScript 6 (strict, `noImplicitAny`)
- **Database**: MongoDB via Mongoose 9
- **Auth**: NextAuth.js 5 (beta) — Credentials provider, bcryptjs hashing
- **Validation**: Zod 4
- **UI/Styling**: Tailwind CSS 4, Framer Motion, Lucide React, React Icons
- **Storage**: AWS S3 SDK against any S3-compatible store (on-prem Garage by default)
- **Forms**: React Hook Form + Zod resolver
- **Package Manager**: pnpm

## Development Commands

**pnpm only, Node 22+.** `pnpm-workspace.yaml` carries load-bearing
`overrides` that npm and yarn both ignore: a `postcss@<8.5.10` security bump,
and `sharp: 0.35.3` pinned so the tree resolves **one** sharp and one libvips.
Install with anything else and two copies resolve — `/api/admin/images/upload`
then dlopens a `.so` Next's file tracing never bundled and the build dies with
`ERR_DLOPEN_FAILED: libvips-cpp.so.8.18.3: cannot open shared object file`. The
pin is deliberately above the `^0.34.5` Next declares (below 0.35.0 ships a
libvips with CVE-2026-33327/33328/35590/35591), so a range mismatch is expected —
don't "fix" it. `engines.node` still says `>=18.18.0` and is stale.

```bash
pnpm dev       # Dev server with Turbopack at http://localhost:3000
pnpm build     # Production build (output: "standalone")
pnpm start     # Run the production build
pnpm lint      # ESLint — NOTE: this script always runs with --fix
pnpm lint:ci   # ESLint without --fix — use when you must not rewrite files
pnpm format    # Prettier (with Tailwind class sorting)
pnpm typecheck # tsc --noEmit (run alongside build to verify changes)
```

There is exactly **one** script, and it only creates the first admin user:

```bash
pnpm seed:admin   # scripts/seed-admin.js — creates the initial admin user
```

`scripts/` contains that one file. The seed/migrate catalogue this section used
to document (`seed:deptcontent:*`, `seed:placements`, `seed:accreditations`,
`seed:naac`, `seed:contentpages`, `seed:committees`, `seed:clubs`,
`seed:research`, `seed:lifeatjct`, `seed:seo`, `seed:aboutsections`,
`migrate:disclosurepages`, `migrate:moremenu`, …) **no longer exists** — the
scripts themselves were deleted, not merely their package.json entries. Do not
reintroduce references to them.

Everything else is bootstrapped one of two ways on a fresh database:

- through the admin CMS, which writes each SiteConfig key on first save, or
- by restoring a backup archive: `POST /api/admin/site-config/restore` (the
  Settings page has the UI for it).

There is **no test framework** configured — no test runner, no test files, no `test` script. Verify changes with `pnpm build` + `pnpm lint` and by exercising the feature in the browser.

## Architecture

### Routing layout

`src/app/` is the App Router root. The app has two halves:

- **`src/app/admin/`** — the CMS. `(protected)/` is a route group whose `layout.tsx` does a session check; `login/` is public. Key admin pages: `dashboard/`, `programs/`, `pages/`, `users/`, `testimonials/`, `recruiters/`, `about/`, `coe/`, `campus-life/`, `page-content/`, `main/page-content/`, `global/page-content/`, `settings/`, `audit/`, `events/` (thin CRUD over the `Event` model), `research/`, `clubs/`, `committees/`, `documents/`, `naac/` (all `LivePageEditor` shells, see "Visual page editors"), `accreditations/`, `placements-page/` (bespoke SiteConfig editors, not the `LivePageEditor` shell), `placements/` (**a redirect only** — year-wise `Placement` records are now authored inside `placements-page/`; two screens writing the same docs is what that avoids), `content/[slug]/` (one dynamic editor for all block-based content pages — NIRF, timeline, library — driven by a registry in `src/lib/content-pages.ts`). The sidebar/breadcrumbs/Ctrl+K palette are all generated from a single source of truth, `src/lib/admin-nav.ts` — add a page there to get nav + search for free instead of wiring a hub page. Each college has just two groups: **Landing Page** (ordered as the public landing page renders, top to bottom) and **Other Pages**; standalone content-page editors are appended in `CONTENT_PAGE_ORDER`, and anything not listed there lands at the end rather than vanishing.
- **`src/app/institutions/<inst>/`** — public pages for each of `engineering`, `arts-science`, `polytechnic`. Each has `page.tsx` (landing), `about/`, `courses/`, `programs/` + `programs/[slug]/` (DB-driven program detail pages), `p/[slug]/` (generic CMS Page renderer, see Page CMS below), and a legacy `[course]/` dynamic route. Engineering also has `coe/` (Centre of Excellence).
- **Top-level public routes**: `src/app/page.tsx` (home), `campus-life/`, `about-us/`, `accreditations/`, `events/` + `events/[slug]/`, `p/[slug]/` (institution-agnostic `main` CMS pages), plus `sitemap.ts` / `robots.ts` (fed by `src/lib/seo-pages.ts`).

### Authentication & authorization

- **`src/proxy.ts` is the Next.js 16 middleware** (Next 16 renamed `middleware.ts` → `proxy.ts`). It wraps NextAuth `auth()` and gates `/admin/:path*` + `/api/admin/:path*`: unauthenticated page requests redirect to `/admin/login?callbackUrl=...`, unauthenticated `/api/admin/*` requests get a JSON 401 (a redirect would hand `fetch()` callers login-page HTML with status 200); an authenticated user hitting the login page is sent to `/admin/dashboard`. This proxy is the real route gate — admin layouts also check the session as defense-in-depth. It **fails closed**: the `auth()` call is wrapped so any throw during session resolution denies the request rather than falling through to `NextResponse.next()`.
- **A `redirect()` in an admin `layout.tsx` does not stop the page segment.** App Router renders layout and page in parallel, so a layout-only guard still lets the page query Mongo and stream the result into a 200. Any admin page that reads the DB server-side must check the session itself before querying (see `dashboard/page.tsx`, `audit/page.tsx`).
- **`src/auth.ts`** configures NextAuth: Credentials provider only (email + password, bcrypt compare), JWT session with 24h `maxAge`. The session/JWT carries `role`, `institution`, and `programs[]`.
- **Roles** (`src/lib/permissions.ts`): only two — `editor` (0) < `admin` (1). Helpers: `hasMinRole`, `canManageUsers` (admin), `canAccessInstitution`. Editors are scoped to their `institution`; admins act on everything (and are stored with `institution: "all"`). **Scope is institution-level only.** `User.programs[]` still exists on the model and rides in the JWT, but nothing reads it and the admin UI does not collect it; the `canAccessProgram` helper that pretended otherwise has been removed. For shared media assets, use `enforceAssetScope` (allows own-institution + the shared `"all"` pool).
- In API routes, call `requireRole(req, minRole)` from `src/lib/api-helpers.ts`. It returns `{ session, error }`; if `error` is truthy, return it directly.
- **Editor scope enforcement**: editors with a restricted `institution` must call `enforceInstitutionScope(session, targetInstitution)` in write routes. This prevents an editor scoped to Engineering from writing to Arts & Science data. Call it early after `requireRole` to fail fast. **Reads are scoped too**: list GETs merge `institutionReadFilter(session)` into the Mongo query and detail GETs re-check `enforceInstitutionScope` — admin list/detail responses include draft content, which must not leak across colleges.
- **Boot-time env validation**: `validateServerEnv()` (`src/lib/env.ts`) runs at **module scope in `src/auth.ts`** — there is no `instrumentation.ts`. It throws on a bad `MONGODB_URI`/`NEXTAUTH_SECRET` (min 32 chars, and rejected against a `SECRET_PLACEHOLDERS` set — add to that set, never replace it) or a _partial_ storage config, but only **warns** when `NEXT_PHASE === "phase-production-build"`, so `next build` still runs on a machine with an incomplete `.env`.

### Rate limiting & client IP

`src/lib/rate-limit.ts` is an in-memory fixed-window limiter (single-instance assumption, same as `public-cache.ts`; swap the store for Redis to scale out). Two things about it are load-bearing:

- **Every limit is two buckets, not one.** `consumeLoginAttempt` keys on `ip|email` (10 / 5 min) _and_ `consumeLoginAttemptByEmail` keys on the account alone (20 / 15 min); uploads mirror this via `consumeUploadAttempt` + `consumeUploadAttemptByUser` (`enforceUploadRateLimit` in `src/lib/api-helpers.ts` calls both). The IP-keyed bucket is bypassable by rotating a spoofed `X-Forwarded-For`, so the account-keyed one is the real guard. Adding a new limited route means adding both.
- **`clientIpFromHeaders` reads `X-Real-IP` first and, falling back to `X-Forwarded-For`, takes the LAST element** — nginx sets XFF with `$proxy_add_x_forwarded_for`, which _appends_ the real peer to whatever the client sent, so the left-most element is attacker-chosen. Changing this to `parts[0]` reopens the bypass.

### HTML sanitization

CMS `richText` is authored by `editor`-role users, i.e. **authenticated but untrusted**. Anything reaching `dangerouslySetInnerHTML` must go through `sanitizeHtml()` (`src/lib/sanitize-html.ts`, isomorphic-dompurify with a tag/attr allowlist). Currently three call sites exist and all are covered: events are sanitized **server-side** in `getPublicEventBySlug` (`descriptionHtml` is already clean by the time `EventDetailLayout` renders it), `ResearchPageLayout` sanitizes at render, and `src/app/layout.tsx` injects only `JSON.stringify`'d JSON-LD. To support a new tag, extend the allowlist — never bypass the call.

### API design

- **Admin routes** (`src/app/api/admin/*`): gate with `requireRole`, parse with `validateBody(req, ZodSchema)` (or `validateFields` for multipart), record `logAudit(...)` (non-fatal), and call `revalidateTargets(...)` after writes. Response/error helpers in `src/lib/api-helpers.ts`: `json`, `badRequest`, `validationError`, `unauthorized`, `forbidden`, `notFound`, `serverError`.
- **Audit logging**: `logAudit(entityType, action, userEmail, summary)` from `src/lib/audit.ts` records a write to the `AuditLog` collection (entries expire after 1 year via a TTL index). It never throws — if logging fails, it's caught and logged but the route response proceeds normally. Always call it even if later operations might fail; it's a best-effort record of intent, not a transactional guarantee. `GET /api/admin/audit` paginates by **keyset cursor**, not page number — `?limit=&before=<ISO timestamp>`, capped at `AUDIT_PAGE_SIZE`/200. `DELETE /api/admin/audit` purges entries older than a fixed retention window (15/30/90/180/365 days only).
- **Public routes** (`src/app/api/public/*`): no auth. Responses use a `{ source, data }` envelope (`source` is `"db" | "empty" | "error"`). These handlers read query params, which makes them **dynamic** — route-level `export const revalidate` is inert on them. Instead they serve from the in-memory TTL cache in `src/lib/public-cache.ts` (1h TTL), which `revalidateTargets` / `revalidatePaths` / `revalidateForConfigKey` clear on every admin write. Same single-instance assumption as the rate limiter.
- Some admin routes have `seed/` sub-routes for bootstrapping data — `testimonials/seed` and `site-config/seed` (there is no `recruiters` route at all, see below).
- **Documents upload in two shapes.** `POST /api/admin/documents/upload` takes the bytes through the function, which a host caps at ~4.5 MB. The client path used by the editors is instead **presign → direct PUT → confirm**: `POST /api/admin/documents/presign` returns `{presigned_url, storage_key, safe_name}`, the browser PUTs the file straight to the bucket, then `POST /api/admin/documents/confirm` records the `DocumentAsset`. Images still go through `POST /api/admin/images/upload` (a 413 there is surfaced as a size message, not "Upload failed").

### Database & connection

- **`connectDB()`** (`src/lib/mongodb.ts`): a globally cached Mongoose connection (`global._mongooseConn`), guarded by `readyState === 1`, with a 15s server-selection timeout and `bufferCommands: false`. Call it at the start of any route that touches the DB.
- Models use the singleton guard `mongoose.models.X ?? mongoose.model(...)` to survive hot reload. Exported from `src/lib/models/index.ts`: `User`, `SiteConfig`, `ImageAsset`, `DocumentAsset`, `Program`, `Page`, `Event`, `Placement`, `Testimonial`, `AuditLog`.
- **There is no `Recruiter` model and no `/api/admin/recruiters` route.** The recruiter carousel is derived from `Placement.top_recruiters` (see `src/app/api/public/recruiters/route.ts`), deduped by name across colleges. `/admin/recruiters` is a page over that data; `RecruitersSectionSchema` is a SiteConfig section, not a collection.

### Visual page editors

Several admin areas share a **click-to-edit + inspector** pattern:

- **Program builder** (`/admin/programs/[id]`) — edit tabs/sections on the left, live-preview on the right (see below).
- **About editor** (`/admin/about`) — renders the public `AboutPageLayout` with editable overlays; clicking a section opens `AboutSectionInspector` in a slide-over panel. Backed by SiteConfig keys like `engineeringAbout`.
- **CoE editor** (`/admin/coe`) — same pattern with `CoePageLayout` / `CoeSectionInspector`, backed by the `engineeringCoe` SiteConfig key.
- **Engineering sub-page editors** — `/admin/research`, `/admin/clubs`, `/admin/committees`, `/admin/documents`, `/admin/naac`, backed by `engineeringResearch`, `engineeringClubs`, `engineeringCommittees`, `engineeringDocuments`, `engineeringNaac`. These are built on the shared `LivePageEditor` shell (`src/components/admin/LivePageEditor.tsx`), which owns all the load/save/inspector boilerplate — a new page of this kind needs only a schema, a layout, and an inspector, not another copy of the editor. Clubs & Cells and Committees are the same data shape and share `GroupsPageLayout` / `GroupsSectionInspector`, distinguished by a `variant` prop.
- **`/admin/about`, `/admin/accreditations`, `/admin/placements-page`** — same "click a section, edit in a panel" spirit but **not** on the `LivePageEditor` shell; they load/save their SiteConfig keys directly via `loadEditableConfig`/`saveEditableConfig` (`src/lib/admin-site-config.ts`, which reads the **admin** endpoint so an unpublished draft survives a reload). Don't assume every editor in the CMS is a `LivePageEditor` instance.
- **`/admin/placements-page` also owns `Placement` documents**, not just its config key: `src/lib/admin-placement-records.ts` loads every year for the college, the preview renders them through `toPreviewRecord`, and save PATCHes **only the records whose editable fields changed** (writing all of them would rewrite and audit-log untouched years). Records are collection docs, so they have **no draft/publish split** — "Save draft" still writes them through. New years must use `nextFreeYear()`; `(institution, year)` is unique.

All of them save via `PUT /api/admin/site-config` and revalidate the relevant institution pages immediately.

Public page layouts wrap each section in `EditableRegion`, which is inert unless `editable` is passed — so the admin preview and the live page render from exactly one component.

### Hosted content pages (a page inside another page)

A `ContentPageDef` in `src/lib/content-pages.ts` with a **`host`** has no route of its own — it publishes as one sidebar panel of `path` (Timeline inside About, NIRF / financial statements / ICT content inside Documents, the NAAC sub-pages inside NAAC, the placement gallery inside Placements). Consequences that are easy to get wrong:

- The host route renders every panel into the HTML via `SectionedPageShell` and toggles them with `hidden` — panels are **not** mounted on demand, because the absorbed pages carry indexable tables. `#anchor` deep-links a panel.
- Server side, the host loads them with `loadHostedContentPages(path)` (`src/lib/hosted-content.ts`), which drops a page that is missing, unpublished or empty rather than showing a dead tab.
- Admin side, the host's editor edits them too: `useHostedDrafts` / `HostedInspector` (`src/components/admin/hosted-content.tsx`) keep a draft per slug, and inspector keys are namespaced `hosted:<slug>:<section>` (`hostedSectionKey` / `parseHostedSection`). `LivePageEditor` wires this in automatically; the bespoke editors call the same hooks.
- Hosted pages are deliberately **absent from `admin-nav.ts`** — listing them would give two doors to one panel. `/admin/content/<slug>` for a hosted page redirects to its host editor via `hostAdminEditor()`.
- `content-pages.ts` throws at import time on a duplicate `slug`, `configKey`, or host `anchor`. Slugs are global, not per-institution.

### Admin UI building blocks

- **`src/components/admin/kit/`** — the shared kit (`PageShell`, `DataTable`, `Drawer`, `SaveBar`, `SortableList`, `useUnsavedGuard`, plus `primitives.tsx` badges/banners/skeletons). List-style screens (dashboard, programs, events, users, testimonials, audit) build from it. If a screen needs markup the kit lacks, add it to the kit rather than inlining it.
- **Deferred uploads** (`src/lib/deferred-uploads.tsx`) — inside a `DeferredUploadsProvider`, picking a file does **not** upload. It registers a `pending:<id>` placeholder key plus an object-URL preview, and the real upload happens in `flush(value)` at save time, which walks the value and swaps placeholders for storage keys. Two rules follow: a placeholder not found in the flushed value is dropped (so its file is never uploaded), and everything being saved must go through **one** `flush` call — `LivePageEditor` flushes `{host, hosted}` together for exactly this reason. `getPreview(key)` is what makes an unsaved image render in the live preview.

### Program CMS — the content builder (most important subsystem)

There is **no `Department` model** anymore. Rich page content that used to live on a Department now lives on **`Program`** — the `Program.content` field's schema comment notes it "was previously stored on Department.content". If you encounter "department" in older branches/docs, that concept is folded into Program.

- A **`Program`** (`src/lib/models/Program.ts`) has card-level fields (`name`, `abbr`, `slug`, `institution`, `degree`, `duration`, `seats`, `image`, `highlight`, `description`, `outcomes`, `sort_order`, `is_active`) **plus** a rich-content draft/publish pair: `content` (draft, `Mixed`), `published_content` (live snapshot), `status: "draft" | "published" | "archived"`, `version`, `published_at`.
- **Content shape** (`ProgramContentSchema` in `src/lib/validation/programs.ts`): `content` is `Mixed`, and the schema validates only the parts the public page renders — everything else passes through, so legacy fields keep working. The renderer is `src/components/layout/ProgramPageLayout.tsx`. The keys that matter:
  - `heroImage`, `heroMeta[]` — hero image and the `{icon,label,value}` strip under the title.
  - `tabsConfig[]` — the **sidebar**. Each entry is `{ id, label, icon, visible, href?, blocks? }`. It overrides the six built-in tabs (reorder / relabel / hide), adds external or CMS-page links via `href`, and adds a fully custom tab via `blocks[]` (`PageBodySection[]`, rendered by `PageBlocksRenderer`).
  - `labels` — per-section title and column-header overrides for the built-in tabs.
  - `seo` — meta title/description for the program's public page, so it follows the draft → publish cycle.
  - plus the structured built-in fields (about, stats, HOD, curriculum, faculty, …) consumed by the six default tabs.

```typescript
{
  heroImage: "images/eee-hero.webp",
  tabsConfig: [
    { id: "overview", label: "Overview", icon: "BookOpen", visible: true },
    { id: "syllabus", label: "Syllabus", href: "/institutions/engineering/p/eee-syllabus" },
    {
      id: "outreach",
      label: "Outreach",
      blocks: [{ kind: "richText", html: "<p>Community projects…</p>" }],
    },
  ],
  labels: { overview: { about: { title: "About the Department" } } },
}
```

> There is **no `content.tabs`**. A second model (`tabs[] → sections[]`, rendered by `TabsProgramLayout`) once existed alongside this one but nothing ever rendered it — the layout was imported nowhere, so the "Custom Page Tabs" editor that wrote it discarded every edit. The layout, that editor panel, the `migrate-tabs` route that generated the same unrenderable shape, and the `tabs` key in `ProgramContentSchema` were all removed. `src/lib/program-tabs.ts` now exports only the `Section`/`Tab` **editing** types, which the Engineering Research page reuses via `<ProgramTabsEditor />`.

- **The editor** (`src/app/admin/(protected)/programs/[id]/page.tsx` with `ProgramContentEditor`, `CurriculumEditor`, `ProgramLabelsEditor` in `src/components/admin/`) is a **live-preview builder**: edit content on one side, see the rendered public page on the other.
- **Publish flow**: `POST /api/admin/programs/[id]/publish` copies `content` → `published_content`, sets `status: "published"`, bumps `version`.
- **Slug uniqueness is per-institution.** `Program` indexes `{institution, slug}` unique, matching `Page` — three colleges can each have `computer-science`. Databases created before this change still carry the old global `slug_1` index and must drop it once: `db.programs.dropIndex("slug_1")`.
- **Public reads** go through `src/lib/public-programs.ts` (`listPublicPrograms`, `getPublishedProgramBySlug`, `listPublishedProgramSlugs`). `listPublicPrograms` has **no** draft escape hatch — not a parameter, not a query string. Its one caller is the unauthenticated `/api/public/programs`, where any opt-out (it used to accept `?published=false`) hands anyone the full card payload for every draft and archived program: embargoed course names, slugs, seat counts, hero images. Admin previews read the `requireRole`-gated `/api/admin/programs` instead. These only return docs with `status: "published"` and non-null `published_content`, then run the content through `src/lib/normalize-program-data.ts` to produce the typed `ProgramData` the public pages render.

### Page CMS — generic standalone pages

Separate from Program content, the **`Page`** model (`src/lib/models/Page.ts`) backs free-standing CMS pages (admin `/admin/pages`, API `/api/admin/pages`). Same draft/publish pair as Program (`content`/`published_content`, `status`, `version`). A page is scoped by `institution` (`main | engineering | arts-science | polytechnic`) and a `template` (`standard | hero-content | sidebar | gallery | contact`). The `(institution, slug)` index is unique — different institutions can reuse a slug. Public renderers: `/p/[slug]` (the `main` scope) and `/institutions/<inst>/p/[slug]` (per-institution), both reading published content only.

`GET /api/admin/pages` also flags **orphan pages**: `src/lib/page-nav-links.ts` checks every published `Page` against the four navbars' draft and published values, and pages not linked from any of them get an orphan badge in the admin list — a way to catch pages that exist but nothing on the site links to.

### SiteConfig & page content

- **`SiteConfig`** docs are keyed by a unique `config_key`, with a draft/publish pair `value` / `published_value` and `status: "draft" | "published"`.
- Allowed config keys are a **fixed registry** in `src/lib/validation/siteConfig.ts` (`SITE_CONFIG_SCHEMAS`) — each key maps to a Zod schema, and unknown keys are rejected. The registry has grown to ~90 keys; the individual schemas live in topic files under `src/lib/validation/` (`hero.ts`, `navbar.ts`, `floatingElements.ts`, `homeSections.ts`, `engineeringPages.ts`/`engineeringSections.ts`, `naacPage.ts`, `campusLifePage.ts`, `contentPage.ts`, `pamphlet.ts`, `upcomingEvents.ts`, `announcement.ts`, `admissions.ts`, `seo.ts`, etc.) and each contributes one or more keys to `SITE_CONFIG_SCHEMAS` — the topic file is not itself the key name. Add a new site-wide setting by adding a schema in the right topic file (or a new one) and registering it in `SITE_CONFIG_SCHEMAS`.
- The admin "page content" pages (`(protected)/page-content/`, `(protected)/main/page-content/`, `(protected)/global/page-content/`) edit these config keys via `PageContentForms.tsx` / `PageContentShell.tsx`.
- **Backup/restore/reset**: backup is **staged — build to disk, then download**, and is not one request. `POST /api/admin/site-config/backup` starts a build and returns a job (202) immediately; `GET …/backup?jobId=` polls its progress; `GET …/backup/file?jobId=` downloads the finished archive; `DELETE …/backup?jobId=` frees it. `GET …/backup?probe=1` still reports what an export would contain without building it. The archive (site config, every `BACKUP_COLLECTIONS` collection, and — if requested — every stored asset) is assembled by `src/lib/backup-archive.ts` via `archiver` and written to `BACKUP_DIR`; `src/lib/backup-jobs.ts` owns job state, disk layout, retention and the free-space check. **Do not fold this back into a single streaming response.** Archiving into the response socket coupled storage read speed to the client's drain rate, which forced assets through strictly one at a time and made a 7.5 GB export take hours; it also ruled out `Content-Length`, so there was no real progress and no resume. Building first decouples the two: small objects are fetched from storage concurrently (see `SMALL_ASSET_BYTES`/`FETCH_CONCURRENCY`), and the download is a ranged static file. Memory is still flat — collections stream from a cursor and only bounded small-object buffers are held. `POST /api/admin/site-config/restore` takes the ZIP as a raw request body, spools it to a temp file, and restores everything from its central directory via `unzipper` (`src/lib/restore.ts`), reporting progress as NDJSON; pass `?mode=replace` to delete, per collection, anything not present in the archive (default `?mode=merge` only upserts). `POST /api/admin/site-config/reset` is **not** a per-key revert: it takes no key, and performs a full wipe — every `SiteConfig` document, plus every stored object and asset row nothing still references. Scope is widened by an optional JSON body (`ResetOptionsSchema`, `src/lib/validation/reset.ts`): `{"content":true}` also deletes Program, Page, Event, Placement and Testimonial, and `{"assets":true}` skips the reference scan and purges every uploaded file. An absent or empty body means the historical scope, so an old client that POSTs nothing still works. `User` and `AuditLog` are never touched. The destructive half lives in `src/lib/reset.ts`, and two invariants there are load-bearing: **the sweep enumerates the union of the bucket and the tracking rows**, because objects legitimately exist with no `ImageAsset`/`DocumentAsset` row (files seeded or uploaded by hand, `restoreAsset` putting bytes back for an archive entry that carried no metadata, a presigned PUT whose `documents/confirm` never landed) — walking only the DB left those in storage permanently, invisible to every later reset; and **a tracking row is deleted only once its object is provably gone**, so a failed `deleteObject` or an unconfigured store keeps the row rather than converting a tracked object into an unreachable one. Audit-logged as "Full reset" / "Full purge"; there is no undo short of restoring a backup. The restore route is excluded from the `proxy.ts` matcher and enforces auth itself — see the Next.js 16 body-size note below. All are accessible from the admin Settings page.

### Images & documents

- **Provider is env-only.** `src/lib/storage-config.ts` resolves the endpoint, bucket, credentials, signing region and addressing style from `STORAGE_*` — those four are required together, and there are no legacy aliases. `STORAGE_ENDPOINT` is the **public** address because presigned PUTs are signed against it and a browser has to resolve it; `STORAGE_INTERNAL_ENDPOINT` (optional) is the address this process uses for its own calls. `getS3Client({forBrowser: true})` in `src/lib/storage.ts` is what keeps presigning on the public one — everything else takes the internal endpoint when set. `src/lib/storage.ts` is the S3 layer on top (`uploadObject`, `uploadObjectStream`, `getObject`, `getObjectStream`, `getObjectBytes`, `headObject`, `deleteObject`, `listObjects`, `getPresignedPutUrl`, `publicAssetUrl`, `extractStorageKeys`). Two things bite on a self-hosted server: the signing region must match the server's configured region exactly or every call fails `SignatureDoesNotMatch`, and browser-direct presigned PUTs need a **CORS rule** — without one, document uploads fail in the browser and the server logs nothing. There is no server-side fallback for that, because `proxy.ts` truncates any matched request body at 10 MB. On Garage the rule cannot live on the bucket: v2.0.0 does not implement `PutBucketCors` (`aws s3api put-bucket-cors` returns 501), so nginx answers the preflight and adds the headers on the signed `/jct-assets/` location instead.
- **Public asset URLs** come from `publicAssetBaseUrl()` in `src/lib/storage-public.ts` (`NEXT_PUBLIC_STORAGE_PUBLIC_URL`). It is a **separate, client-safe module** because the literal must appear verbatim for Next's build-time inlining to reach the browser bundle. Never read that env var through a computed lookup — it is never substituted and reads as `undefined` client-side. Changing the value needs a **rebuild**, not a restart.
- **`NEXT_PUBLIC_STORAGE_PUBLIC_URL` is not `STORAGE_ENDPOINT` + bucket.** On Garage they are two different servers. The S3 API (3900) rejects every unsigned request with `Forbidden: Garage does not support anonymous access yet`, so a browser can never read `https://cdn.jct.ac.in/<bucket>/<key>`; public reads have exactly one door, Garage's **web endpoint** (3902), which picks the bucket from the `Host` header and needs `garage bucket website --allow <bucket>`. In production nginx puts both on `cdn.jct.ac.in` split by path — `/jct-assets/…` to 3900 with `Host` untouched (rewriting it breaks SigV4), everything else to 3902 with `Host: jct-assets`. So the public base URL carries **no bucket segment**. Setting it to the path-style S3 URL 403s every image on the site. See `deploy/nginx-jct.conf.example`.
- **Images**: uploaded via `POST /api/admin/images/upload` (FormData) → validated for mime/size → stored via `src/lib/storage.ts` → an `ImageAsset` doc records metadata (url, alt text, category, institution). If storage env vars are absent, images fall back to local serving via `/api/public/images/[...path]` or `/api/admin/images/serve/[...key]`. A _partial_ configuration is refused at boot by `validateServerEnv`.
- **Documents**: `POST /api/admin/documents/upload` handles non-image assets (e.g. prospectus/pamphlet PDFs).
- **Storage key tracking**: `extractStorageKeys(value)` in `src/lib/storage.ts` recursively walks any JSON value and collects strings that look like storage keys (`images/…` or `documents/…`). Pass the collected keys to `cleanupStorageKeys(keys, context)` from `src/lib/asset-cleanup.ts` when content is deleted or replaced — it removes **both** the stored object and its `ImageAsset`/`DocumentAsset` tracking row (deleting only the blob leaves the media library full of broken entries). It's fire-and-forget and never blocks the route response. **Call it AFTER the write that dropped the reference**: before deleting anything it scans SiteConfig, Program, Page, Event, Placement and Testimonial for the key and keeps any that is still referenced, so a pre-write call would find its own document and skip. That scan is not optional — storage keys are not one-to-one with documents (the "Also apply to" control in the Life at JCT editor writes the same keys under four config entries, and any editor can reuse an asset by pasting its key).
- `next.config.ts` `images.remotePatterns` allowlists external hosts (unsplash, wikimedia, companieslogo, the asset host derived from `NEXT_PUBLIC_STORAGE_PUBLIC_URL`, and `i.pravatar.cc` outside production) and applies a strict CSP that sandboxes SVGs. The pattern is `protocol: "https"` only, so **the asset host must be behind TLS** — over plain HTTP every optimised image fails with `"url" parameter is not allowed`. Never allowlist a shared multi-tenant asset domain: it trusts every bucket on that platform and turns `/_next/image` into an open image proxy.

### Caching & revalidation

- Public **pages** use 1h ISR (`export const revalidate = 3600` in page files). Public **API routes** read query params, which makes them dynamic — they are served from the in-memory cache in `src/lib/public-cache.ts` instead (see "API design").
- After a content write, call helpers from `src/lib/revalidate.ts`. All of them also clear the public API cache:
  - `revalidateTargets(...targets)` — targets are `"home" | "engineering" | "arts-science" | "polytechnic" | "all-institutions"`. Note `all-institutions` does **not** include `/campus-life`; only `home` does.
  - `revalidateForConfigKey(key)` — looks up the affected pages via the `SITE_CONFIG_KEY_TARGETS` map. When adding a new SiteConfig key in `src/lib/validation/siteConfig.ts`, add an entry to `SITE_CONFIG_KEY_TARGETS` in `src/lib/revalidate.ts` mapping that key to the targets it affects — without this mapping, the cache invalidation will be incomplete.
  - `revalidatePaths(...paths)` — revalidate explicit paths.
  - `revalidateEverything()` — `publicCacheClear()` + `revalidatePath("/", "layout")`, i.e. every public route including the dynamic detail pages. Not for write routes (use the targeted helpers); it backs the **Clear Cache** button on the admin Settings page via `POST /api/admin/cache`, for when the targeted mapping was bypassed — a restore, a hand-edited document, a config key with no `SITE_CONFIG_KEY_TARGETS` entry.

### Frontend structure & state

- **`src/modules/<inst>/`** holds per-institution public page **section components** (e.g. `EngineeringHero`, `EngineeringMetrics`, `EngineeringDomains`, `Admissions`, `Testimonials`), composed by the institution `page.tsx` files. Reusable layout/UI components live in `src/components/layout`, `src/components/shared`, `src/components/ui`.
- **`src/data/`** holds static content not in the CMS — currently only `all-navigations.ts`. (The Meritto chatbot is an external third-party script loaded by `src/components/layout/MerittoScript.tsx`; there is no `/api/chat` route. Its host must stay allowlisted in the CSP `script-src`/`frame-src` in `next.config.ts`.)
- **`InstitutionContext`** (`src/contexts/InstitutionContext.tsx`): client context tracking the current section (`main | engineering | arts-science | polytechnic`). Auto-detected from the pathname and mirrored to `sessionStorage`.
- Server Components are the default; `"use client"` only for interactive UI (forms, the program builder, context consumers).

## Environment Configuration

See `.env.example`. Required:

```
MONGODB_URI       # mongodb+srv:// (Atlas) or mongodb:// (self-hosted). Nothing
                  # here uses transactions, change streams or Atlas Search, so
                  # a standalone mongod is sufficient — no replica set needed.
NEXTAUTH_SECRET   # 32-char random secret (openssl rand -base64 32)
NEXTAUTH_URL      # http://localhost:3000 (dev) / https://jct.ac.in (prod)
```

Optional — images/documents fall back to local serving if unset. Set all four
or none; a partial set fails at boot. Any S3-compatible store:

```
STORAGE_ENDPOINT
STORAGE_BUCKET
STORAGE_ACCESS_KEY_ID
STORAGE_SECRET_ACCESS_KEY
STORAGE_REGION              # default "auto"; MUST match the server's region
STORAGE_FORCE_PATH_STYLE    # defaults true
STORAGE_INTERNAL_ENDPOINT   # optional; where THIS PROCESS reaches the S3 API
                            # when that isn't the public address. Unset, every
                            # server-side call (a backup makes one per object)
                            # leaves through STORAGE_ENDPOINT's public hostname
                            # and hairpins back — which is why an archive build
                            # depends on the internet link on a box that holds
                            # every byte locally. Presigning ignores it: those
                            # URLs are for the browser. On compose that's
                            # http://garage:3900, never 127.0.0.1 (the app
                            # container's own loopback).
NEXT_PUBLIC_STORAGE_PUBLIC_URL   # must be https; inlined at BUILD time
```

Also read by this repo's code:

```
NEXT_PUBLIC_SITE_URL   # public origin; src/lib/page-nav-links.ts uses it plus
                       # NEXTAUTH_URL to decide which absolute navbar URLs are
                       # same-origin. Unset on a deployment where NEXTAUTH_URL
                       # is not the public domain, and the admin page list
                       # badges linked pages as orphans. NEXT_PUBLIC_*, so it
                       # must be present at BUILD time, not just at runtime.
MONGODB_MAX_POOL_SIZE  # per-instance Mongo pool (default 10)
BACKUP_DIR             # where the admin backup route builds archives before
                       # they are downloaded (default: <os tmp>/jct-backups).
                       # A full archive is ~7.5 GB, so in Docker this must be a
                       # bind-mounted host volume, not the container filesystem.
BACKUP_ACCEL_PREFIX    # optional; when set, the download route answers with an
                       # X-Accel-Redirect under this prefix so nginx serves the
                       # archive via sendfile() instead of piping it through
                       # Node. Needs a matching `internal` nginx location.
```

## Deployment

CI is `.github/workflows/build-deploy.yml`, two jobs over `push` (branch `v3-admin` + tags matching `v*`) and `pull_request`:

- **`verify`** — runs on every trigger. `pnpm install --frozen-lockfile`, `pnpm lint:ci`, `pnpm typecheck`, `prettier --check .`. Nothing else in the pipeline lints: `next build` type-checks but Next 16 no longer runs ESLint as part of it.
- **`deploy`** — `needs: verify`, gated by `if: startsWith(github.ref, 'refs/tags/v')`, so **the server is only touched when a version tag is pushed**. SSHes to the prod host and runs `git reset --hard` to the tag, then `docker compose -f docker-compose.prod.yaml build jct && docker compose -f docker-compose.prod.yaml up -d --remove-orphans`. There is no registry: the image is built on the same host it runs on, straight from `docker-compose.prod.yaml`'s `build:` block. `MONGODB_URI` is injected as a BuildKit secret, build-time only; `network: host` on that build is what lets it reach MongoDB on `127.0.0.1` — an on-prem database published on loopback only. Build without that and every DB-backed page bakes empty and stays wrong until the next revalidation.

Consequences to keep in mind:

- Pushing to `v3-admin` alone does **not** deploy — `verify` still runs, but the `deploy` job's tag gate skips it. Releasing is a separate, deliberate act: tag `vX.Y.Z` and push the tag.
- The deploy step reads `DEPLOY_HOST`, `DEPLOY_USER` and `SSH_KEY` from repo secrets, falling back to `SSH_PASSWORD` while `SSH_KEY` is unset. The host address is deliberately not committed.
- **Pushing a `v*` tag deploys to production.** Never create or push tags on your own — see Git below.
- The reverse proxy in front of the app is **not** in this repo, but the admin backup/restore routes depend on its settings. Restore POSTs the whole ZIP as one body (currently ~7.5 GB) and backup downloads one out; nginx defaults (`client_max_body_size 1m`, request/response buffering on, 60s timeouts) break both. See `deploy/nginx-jct.conf.example` for the required directives, including the optional `internal` location that lets nginx serve the built archive with `sendfile()` (enabled by setting `BACKUP_ACCEL_PREFIX`), and the object-storage vhost that fronts Garage.
- **On-prem stack.** `docker-compose.prod.yaml` also defines `mongo` (MongoDB 8, standalone, `--auth`) and `garage` (S3-compatible object storage, config in `deploy/garage.toml.example`). Both are published on loopback only; nginx terminates TLS. Garage rather than MinIO: MinIO's community Docker images were withdrawn in October 2025 and the repo is archived, so it gets no security patches. Delete either service and point the matching env vars at a managed equivalent — nothing else changes.
- **Backups need disk.** `docker-compose.prod.yaml` bind-mounts `/srv/jct/backups` to the container's `BACKUP_DIR`. Without a mount the archive lands on the container's overlay filesystem and is discarded on every rebuild. Retention (`pruneJobs` in `src/lib/backup-jobs.ts`) keeps **only the newest** archive, but will not delete a superseded one until it is **3 hours old** — that grace protects a multi-gigabyte download still in flight, and it outranks disk pressure (`ensureSpace` refuses the new build rather than reclaiming a young archive, and the 400 says so). Nothing outlives 24h. `pruneJobs` is called before a build, after one seals, and on the job-list GET; archives spared by the grace also arm an `unref`'d timer so they are swept without waiting for the next admin action. Settings has a manual delete, which is deliberately exempt from the grace.

## Validation

Zod schemas define every entity shape. They live in `src/lib/validation/` and are re-exported from `src/lib/validation/index.ts` (the barrel), each alongside a `LIMITS` constant for max string lengths / array sizes.

- Primitives in `_primitives.ts`: `zEmail`, `zSlug`, `zUrl`, `zClampedString()`, `zPasswordMin8`, color validators.
- Admin pages validate forms with React Hook Form + Zod resolver; API routes validate JSON with `validateBody()`.
- Validation failures return a structured **422** that is additive over `{ error }`:

```json
{
  "error": "Validation failed",
  "message": "name: String must contain at least 1 character",
  "details": [{ "path": ["name"], "message": "...", "code": "too_small" }]
}
```

## Common Workflows

### Add a new content type

1. Mongoose schema in `src/lib/models/NewType.ts`; export it from `src/lib/models/index.ts`.
2. Zod schemas (+ `LIMITS`) in `src/lib/validation/newtype.ts`; re-export from the validation barrel.
3. Admin API: `src/app/api/admin/newtype/route.ts` (GET/POST) and `[id]/route.ts` (PATCH/DELETE) — gate with `requireRole`, validate, audit, revalidate.
4. Admin UI: `src/app/admin/(protected)/newtype/page.tsx`.
5. Public API (if needed): `src/app/api/public/newtype/route.ts` — serve through `publicCacheGet`/`publicCacheSet` from `src/lib/public-cache.ts` (route-level `revalidate` is inert once the handler reads query params).
6. If it affects public pages, extend `src/lib/revalidate.ts`.

### Publish draft content

`Program` and `SiteConfig` use a draft/publish split. Publishing copies the draft field into the published field, flips `status` to `"published"`, and bumps `version`. The public site reads **only** published content; drafts are visible only in the admin.

### Cache invalidation after a write

```typescript
import { revalidateTargets, revalidateForConfigKey } from "@/lib/revalidate";

revalidateTargets("engineering", "arts-science"); // institution pages
revalidateForConfigKey("engineeringHero"); // a changed site-config key
```

## Conventions

- **ESLint + Prettier**: `eslint.config.mjs` (flat config, TS + react-hooks) and `.prettierrc` (2-space, double quotes, trailing commas, 80 col, Tailwind class sorting). Unused vars are a warning unless prefixed `_`.
- **Imports**: use the `@/*` alias for `src/*`.
- **Logging**: `console.log/error` with a `[context]` prefix (see `src/auth.ts`).
- **Errors**: API routes catch, log, and return a 500 via `serverError()`. Audit logging never throws fatally.
- **Build**: `output: "standalone"` for Docker/Node deployment.

The codebase is indexed using ccc. Use ccc for codebase knowledge.

## Build Rules

- Always run:
  pnpm run build
  pnpm run typecheck
- If `pnpm run typecheck` fails with "Cannot find module" errors inside `.next/types` or `.next/dev/types`, those are stale generated validators referencing deleted routes — delete the `.next` directory and re-run.

## Next.js 16

- Use proxy.ts instead of middleware.ts
- useSearchParams requires Suspense boundary
- **Never add a root `src/app/loading.tsx`.** It streams a skeleton on every route, and once HTML is flushed the HTTP status is locked — so `notFound()` renders the 404 body with status **200** across the whole site. Removing it is what makes missing pages return a real 404; ISR is unaffected. See `src/app/README-loading.md`. Segment-scoped `loading.tsx` is fine only where the pages never call `notFound()`; otherwise use `<Suspense>` inside the page, below the fetch that decides.
- **Any route matched by `proxy.ts` has its request body capped.** Next clones the body for the proxy and truncates the clone at `experimental.proxyClientMaxBodySize` (10 MB default) — it does not reject the request, it silently ends the stream early, so the handler sees a partial body. Raising the limit is not a fix: the proxy never drains its clone, so a large body accumulates in memory instead. A route that accepts a large upload must be excluded from the matcher and enforce auth itself via `requireRole` (see the `site-config/restore` exclusion in `src/proxy.ts`).

## Zod 4

- Avoid .default({})
- Use explicit schema shape or function defaults
- **Never `.partial()` a schema whose fields carry `.default()`** for PATCH payloads — Zod 4 still injects the defaults for omitted keys, so a `$set` spread wipes stored values (e.g. `{ is_active: false }` resetting `sort_order`/`outcomes`). Keep a defaults-free base schema, `.partial()` that for updates, and `.extend()` the defaults onto the create schema only (see `programs.ts`, `recruiters.ts`, `testimonials.ts`).

## CMS Conventions

- Use Programs-style inspector editors
- Never use tab-based admin editors

## Storage Cleanup

- Audit ALL delete paths:
  - Trash buttons
  - Replace flows
  - PhotoList
  - nested delete actions

## Git

- **Do not commit.** Never run `git commit`, `git push`, `git tag`, `git merge`, `git rebase`, or `git reset` unless the user explicitly asks for it in that message. Make the file edits, then stop and report what changed — the user reviews and commits.
- This is not a formality: pushing a `v*` tag triggers an SSH deploy to the production server (see Deployment). An unrequested tag push ships to prod.
- Read-only git commands (`status`, `diff`, `log`, `show`) are fine at any time.
- A request to commit applies once, to that request only. Do not carry it forward to later edits in the same session.

## Before Editing

1. Identify the actual root cause.
2. Grep all affected code paths
3. Analyse every component/API/hook touching this feature
4. Then implement

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
