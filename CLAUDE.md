# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**JCT Institutions** is a Next.js 16 app that combines a **public marketing/admissions website** and an **admin CMS** for three colleges (Engineering, Arts & Science, Polytechnic) in Coimbatore.

- **Public site** (`/`, `/institutions/*`, `/campus-life`): institution landing pages, program listings, dynamic per-program detail pages, campus life. Server-rendered with ISR caching.
- **Admin CMS** (`/admin/*`): manage programs (via a live-preview content builder), users, images, documents, testimonials, recruiters, page content, and site-wide config.

Persistence is **MongoDB Atlas** (Mongoose), auth is **NextAuth.js**, image/document storage is **Cloudflare R2** (S3-compatible).

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19
- **Language**: TypeScript 6 (strict, `noImplicitAny`)
- **Database**: MongoDB via Mongoose 9
- **Auth**: NextAuth.js 5 (beta) — Credentials provider, bcryptjs hashing
- **Validation**: Zod 4
- **UI/Styling**: Tailwind CSS 4, Framer Motion, Lucide React, React Icons
- **Storage**: AWS S3 SDK against Cloudflare R2
- **Forms**: React Hook Form + Zod resolver
- **Package Manager**: pnpm

## Development Commands

```bash
pnpm dev       # Dev server with Turbopack at http://localhost:3000
pnpm build     # Production build (output: "standalone")
pnpm start     # Run the production build
pnpm lint      # ESLint — NOTE: this script always runs with --fix
pnpm format    # Prettier (with Tailwind class sorting)
pnpm typecheck # tsc --noEmit (run alongside build to verify changes)
```

Data seeding scripts (bootstrap a fresh DB; `:dry` variants preview without writing):

```bash
pnpm seed:admin                       # create initial admin user
pnpm seed:programs:engineering        # seed Program card rows
pnpm seed:deptcontent:<inst>[:dry]    # seed rich Program.content per institution
```

There is **no test framework** configured — no test runner, no test files, no `test` script. Verify changes with `pnpm build` + `pnpm lint` and by exercising the feature in the browser.

## Architecture

### Routing layout

`src/app/` is the App Router root. The app has two halves:

- **`src/app/admin/`** — the CMS. `(protected)/` is a route group whose `layout.tsx` does a session check; `login/` is public. Key admin pages: `dashboard/`, `programs/`, `pages/`, `users/`, `testimonials/`, `recruiters/`, `about/`, `coe/`, `campus-life/`, `page-content/`, `main/page-content/`, `global/page-content/`, `settings/`, `audit/`.
- **`src/app/institutions/<inst>/`** — public pages for each of `engineering`, `arts-science`, `polytechnic`. Each has `page.tsx` (landing), `about/`, `courses/`, `programs/` + `programs/[slug]/` (DB-driven program detail pages), `p/[slug]/` (generic CMS Page renderer, see Page CMS below), and a legacy `[course]/` dynamic route. Engineering also has `coe/` (Centre of Excellence).
- **Top-level public routes**: `src/app/page.tsx` (home), `campus-life/`, `about-us/`, and `p/[slug]/` (institution-agnostic `main` CMS pages).

### Authentication & authorization

- **`src/proxy.ts` is the Next.js 16 middleware** (Next 16 renamed `middleware.ts` → `proxy.ts`). It wraps NextAuth `auth()` and gates `/admin/:path*` + `/api/admin/:path*`: unauthenticated page requests redirect to `/admin/login?callbackUrl=...`, unauthenticated `/api/admin/*` requests get a JSON 401 (a redirect would hand `fetch()` callers login-page HTML with status 200); an authenticated user hitting the login page is sent to `/admin/dashboard`. This proxy is the real route gate — admin layouts also check the session as defense-in-depth.
- **`src/auth.ts`** configures NextAuth: Credentials provider only (email + password, bcrypt compare), JWT session with 24h `maxAge`. The session/JWT carries `role`, `institution`, and `programs[]`.
- **Roles** (`src/lib/permissions.ts`): only two — `editor` (0) < `admin` (1). Helpers: `hasMinRole`, `canManageUsers` (admin), `canAccessInstitution`, `canAccessProgram`. Editors are scoped to their `institution`; admins act on everything (and are stored with `institution: "all"`). NOTE: the `programs[]` allowlist is **not** enforced — `canAccessProgram` delegates to `canAccessInstitution` and ignores the program list (the `programs[]` params are dead). Scope is institution-level only. For shared media assets, use `enforceAssetScope` (allows own-institution + the shared `"all"` pool).
- In API routes, call `requireRole(req, minRole)` from `src/lib/api-helpers.ts`. It returns `{ session, error }`; if `error` is truthy, return it directly.
- **Editor scope enforcement**: editors with a restricted `institution` must call `enforceInstitutionScope(session, targetInstitution)` in write routes. This prevents an editor scoped to Engineering from writing to Arts & Science data. Call it early after `requireRole` to fail fast. **Reads are scoped too**: list GETs merge `institutionReadFilter(session)` into the Mongo query and detail GETs re-check `enforceInstitutionScope` — admin list/detail responses include draft content, which must not leak across colleges.

### API design

- **Admin routes** (`src/app/api/admin/*`): gate with `requireRole`, parse with `validateBody(req, ZodSchema)` (or `validateFields` for multipart), record `logAudit(...)` (non-fatal), and call `revalidateTargets(...)` after writes. Response/error helpers in `src/lib/api-helpers.ts`: `json`, `badRequest`, `validationError`, `unauthorized`, `forbidden`, `notFound`, `serverError`.
- **Audit logging**: `logAudit(entityType, action, userEmail, summary)` from `src/lib/audit.ts` records a write to the `AuditLog` collection (entries expire after 1 year via a TTL index). It never throws — if logging fails, it's caught and logged but the route response proceeds normally. Always call it even if later operations might fail; it's a best-effort record of intent, not a transactional guarantee.
- **Public routes** (`src/app/api/public/*`): no auth. Responses use a `{ source, data }` envelope (`source` is `"db" | "empty" | "error"`). These handlers read query params, which makes them **dynamic** — route-level `export const revalidate` is inert on them. Instead they serve from the in-memory TTL cache in `src/lib/public-cache.ts` (1h TTL), which `revalidateTargets` / `revalidatePaths` / `revalidateForConfigKey` clear on every admin write. Same single-instance assumption as the rate limiter.
- Some admin routes have `seed/` sub-routes for bootstrapping data (`recruiters`, `testimonials`, `site-config`).

### Database & connection

- **`connectDB()`** (`src/lib/mongodb.ts`): a globally cached Mongoose connection (`global._mongooseConn`), guarded by `readyState === 1`, with a 15s server-selection timeout and `bufferCommands: false`. Call it at the start of any route that touches the DB.
- Models use the singleton guard `mongoose.models.X ?? mongoose.model(...)` to survive hot reload. Exported from `src/lib/models/index.ts`: `User`, `SiteConfig`, `ImageAsset`, `DocumentAsset`, `Program`, `Page`, `Recruiter`, `Testimonial`, `AuditLog`.

### Visual page editors

Several admin areas share a **click-to-edit + inspector** pattern:

- **Program builder** (`/admin/programs/[id]`) — edit tabs/sections on the left, live-preview on the right (see below).
- **About editor** (`/admin/about`) — renders the public `AboutPageLayout` with editable overlays; clicking a section opens `AboutSectionInspector` in a slide-over panel. Backed by SiteConfig keys like `engineeringAbout`.
- **CoE editor** (`/admin/coe`) — same pattern with `CoePageLayout` / `CoeSectionInspector`, backed by the `engineeringCoe` SiteConfig key.
- **Engineering sub-page editors** — `/admin/research`, `/admin/clubs`, `/admin/committees`, `/admin/documents`, backed by `engineeringResearch`, `engineeringClubs`, `engineeringCommittees`, `engineeringDocuments`. These four are built on the shared `LivePageEditor` shell (`src/components/admin/LivePageEditor.tsx`), which owns all the load/save/inspector boilerplate — a new page of this kind needs only a schema, a layout, and an inspector, not another copy of the editor. Clubs & Cells and Committees are the same data shape and share `GroupsPageLayout` / `GroupsSectionInspector`, distinguished by a `variant` prop.

All of them save via `PUT /api/admin/site-config` and revalidate the relevant institution pages immediately.

Public page layouts wrap each section in `EditableRegion`, which is inert unless `editable` is passed — so the admin preview and the live page render from exactly one component.

### Program CMS — the content builder (most important subsystem)

There is **no `Department` model** anymore. Rich page content that used to live on a Department now lives on **`Program`** — the `Program.content` field's schema comment notes it "was previously stored on Department.content". If you encounter "department" in older branches/docs, that concept is folded into Program.

- A **`Program`** (`src/lib/models/Program.ts`) has card-level fields (`name`, `abbr`, `slug`, `institution`, `degree`, `duration`, `seats`, `image`, `highlight`, `description`, `outcomes`, `sort_order`, `is_active`) **plus** a rich-content draft/publish pair: `content` (draft, `Mixed`), `published_content` (live snapshot), `status: "draft" | "published" | "archived"`, `version`, `published_at`.
- **Content shape** (`src/lib/program-tabs.ts`): a `TabsProgram` has `tabs[]`; each `Tab` has `id`, `label`, optional `icon`, and `sections[]`; each `Section` is one of `richText`, `stats`, `list`, `cards`, `image`, `people`. Example:

```typescript
{
  tabs: [
    {
      id: "overview",
      label: "Overview",
      icon: "BookOpen",
      sections: [
        { type: "richText", content: "<p>Program description...</p>" },
        { type: "stats", items: [{ label: "Duration", value: "4 Years" }] },
      ],
    },
    {
      id: "curriculum",
      label: "Curriculum",
      sections: [{ type: "list", items: ["Core Subjects", "Electives"] }],
    },
  ];
}
```

- **The editor** (`src/app/admin/(protected)/programs/[id]/page.tsx` with `ProgramContentEditor`, `ProgramTabsEditor`, `CurriculumEditor`, `ProgramLabelsEditor` in `src/components/admin/`) is a **live-preview builder**: edit content on one side, see the rendered public page on the other.
- **Publish flow**: `POST /api/admin/programs/[id]/publish` copies `content` → `published_content`, sets `status: "published"`, bumps `version`.
- **Migration**: `POST /api/admin/programs/[id]/migrate-tabs` converts legacy content (flat arrays or old section types) into the current `TabsProgram` shape. It is a standalone manual endpoint — nothing calls it automatically (publish does **not** migrate). Idempotent — it no-ops when `tabs` already exist.
- **Public reads** go through `src/lib/public-programs.ts` (`listPublicPrograms`, `getPublishedProgramBySlug`, `listPublishedProgramSlugs`). These only return docs with `status: "published"` and non-null `published_content`, then run the content through `src/lib/normalize-program-data.ts` to produce the typed `ProgramData` the public pages render.

### Page CMS — generic standalone pages

Separate from Program content, the **`Page`** model (`src/lib/models/Page.ts`) backs free-standing CMS pages (admin `/admin/pages`, API `/api/admin/pages`). Same draft/publish pair as Program (`content`/`published_content`, `status`, `version`). A page is scoped by `institution` (`main | engineering | arts-science | polytechnic`) and a `template` (`standard | hero-content | sidebar | gallery | contact`). The `(institution, slug)` index is unique — different institutions can reuse a slug. Public renderers: `/p/[slug]` (the `main` scope) and `/institutions/<inst>/p/[slug]` (per-institution), both reading published content only.

### SiteConfig & page content

- **`SiteConfig`** docs are keyed by a unique `config_key`, with a draft/publish pair `value` / `published_value` and `status: "draft" | "published"`.
- Allowed config keys are a **fixed registry** in `src/lib/validation/siteConfig.ts` (`SITE_CONFIG_SCHEMAS`) — each key maps to a Zod schema, and unknown keys are rejected. Keys include `contact`, `social`, `address`, `stats`, `accreditations`, `home`, `homeStats`, `engineeringHero`, `engineeringMetrics`, `artsScienceHero`, `polytechnicAdmissions`, etc. Add a new site-wide setting by adding an entry here.
- The admin "page content" pages (`(protected)/page-content/`, `(protected)/main/page-content/`, `(protected)/global/page-content/`) edit these config keys via `PageContentForms.tsx` / `PageContentShell.tsx`.
- **Backup/restore/reset**: `POST /api/admin/site-config/backup` snapshots all configs, `POST /api/admin/site-config/restore` restores from a snapshot, `POST /api/admin/site-config/reset` reverts a key to its seed default. All are accessible from the admin Settings page.

### Images & documents

- **Images**: uploaded via `POST /api/admin/images/upload` (FormData) → validated for mime/size → stored in R2 via `src/lib/r2.ts` → an `ImageAsset` doc records metadata (url, alt text, category, institution). If R2 env vars are absent, images fall back to local serving via `/api/public/images/[...path]` or `/api/admin/images/serve/[...key]`.
- **Documents**: `POST /api/admin/documents/upload` handles non-image assets (e.g. prospectus/pamphlet PDFs).
- **R2 key tracking**: `extractR2Keys(value)` in `src/lib/r2.ts` recursively walks any JSON value and collects strings that look like R2 storage keys (`images/…` or `documents/…`). Pass the collected keys to `cleanupStorageKeys(keys, context)` from `src/lib/asset-cleanup.ts` when content is deleted or replaced — it removes **both** the R2 object and its `ImageAsset`/`DocumentAsset` tracking row (deleting only the blob leaves the media library full of broken entries). It's fire-and-forget and never blocks the route response.
- `next.config.ts` `images.remotePatterns` allowlists external hosts (unsplash, pravatar, wikimedia, companieslogo, the R2 public domain) and applies a strict CSP that sandboxes SVGs.

### Caching & revalidation

- Public **pages** use 1h ISR (`export const revalidate = 3600` in page files). Public **API routes** read query params, which makes them dynamic — they are served from the in-memory cache in `src/lib/public-cache.ts` instead (see "API design").
- After a content write, call helpers from `src/lib/revalidate.ts`. All of them also clear the public API cache:
  - `revalidateTargets(...targets)` — targets are `"home" | "engineering" | "arts-science" | "polytechnic" | "all-institutions"`. Note `all-institutions` does **not** include `/campus-life`; only `home` does.
  - `revalidateForConfigKey(key)` — looks up the affected pages via the `SITE_CONFIG_KEY_TARGETS` map. When adding a new SiteConfig key in `src/lib/validation/siteConfig.ts`, add an entry to `SITE_CONFIG_KEY_TARGETS` in `src/lib/revalidate.ts` mapping that key to the targets it affects — without this mapping, the cache invalidation will be incomplete.
  - `revalidatePaths(...paths)` — revalidate explicit paths.

### Frontend structure & state

- **`src/modules/<inst>/`** holds per-institution public page **section components** (e.g. `EngineeringHero`, `EngineeringMetrics`, `EngineeringDomains`, `Admissions`, `Testimonials`), composed by the institution `page.tsx` files. Reusable layout/UI components live in `src/components/layout`, `src/components/shared`, `src/components/ui`.
- **`src/data/`** holds static content not in the CMS — currently only `all-navigations.ts`. (The Meritto chatbot is an external third-party script loaded by `src/components/layout/MerittoScript.tsx`; there is no `/api/chat` route. Its host must stay allowlisted in the CSP `script-src`/`frame-src` in `next.config.ts`.)
- **`InstitutionContext`** (`src/contexts/InstitutionContext.tsx`): client context tracking the current section (`main | engineering | arts-science | polytechnic`). Auto-detected from the pathname and mirrored to `sessionStorage`.
- Server Components are the default; `"use client"` only for interactive UI (forms, the program builder, context consumers).

## Environment Configuration

See `.env.example`. Required:

```
MONGODB_URI       # MongoDB Atlas connection string
NEXTAUTH_SECRET   # 32-char random secret (openssl rand -base64 32)
NEXTAUTH_URL      # http://localhost:3000 (dev) / https://jct.ac.in (prod)
```

Optional — images/documents fall back to local serving if unset:

```
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
NEXT_PUBLIC_R2_PUBLIC_URL
```

## Deployment

CI is `.github/workflows/build-deploy.yml`, two jobs on a single `push` trigger (branch `v2-admin` + tags matching `v*`):

- **`build-and-push`** — runs on **both** branch pushes and tag pushes. Builds `docker-compose.build.yaml` (image `kavinnandha/jct:latest`) and pushes to Docker Hub. `MONGODB_URI` is injected as a BuildKit secret, build-time only.
- **`deploy`** — gated by `if: startsWith(github.ref, 'refs/tags/v')`, so **the server is only touched when a version tag is pushed**. SSHes to the prod host as root and runs `docker compose pull && docker compose up -d --remove-orphans` against the server's copy of `docker-compose.prod.yaml`.

Consequences to keep in mind:

- Pushing to `v2-admin` publishes a new `:latest` image but does **not** deploy. Releasing is a separate, deliberate act: tag `vX.Y.Z` and push the tag.
- Both compose files hardcode `kavinnandha/jct:latest`, so there is no immutable per-version image — a tag deploys whatever that tag's build produced, and rollback means rebuilding. Parameterizing the image tag would need matching changes in `docker-compose.build.yaml`, `docker-compose.prod.yaml`, and the SSH script.
- **Pushing a `v*` tag deploys to production.** Never create or push tags on your own — see Git below.
- The reverse proxy in front of the app is **not** in this repo, but the admin backup/restore routes depend on its settings. Restore POSTs the whole ZIP as one body (currently ~7.5 GB) and backup streams a chunked ZIP out; nginx defaults (`client_max_body_size 1m`, request/response buffering on, 60s timeouts) break both. See `deploy/nginx-jct.conf.example` for the required directives.

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
