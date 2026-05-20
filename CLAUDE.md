# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**JCT Institutions** is a Next.js 16 app that combines a **public marketing/admissions website** and an **admin CMS** for three colleges (Engineering, Arts & Science, Polytechnic) in Coimbatore. 

- **Public site** (`/`, `/institutions/*`, `/campus-life`, `/research`): institution landing pages, program listings, dynamic per-program detail pages, campus life, research. Server-rendered with ISR caching.
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
```

There is **no test framework** configured — no test runner, no test files, no `test` script. Verify changes with `pnpm build` + `pnpm lint` and by exercising the feature in the browser.

## Architecture

### Routing layout

`src/app/` is the App Router root. The app has two halves:

- **`src/app/admin/`** — the CMS. `(protected)/` is a route group whose `layout.tsx` does a session check; `login/` is public.
- **`src/app/institutions/<inst>/`** — public pages for each of `engineering`, `arts-science`, `polytechnic`. Each has `page.tsx` (landing), `about/`, `courses/`, `programs/` + `programs/[slug]/` (DB-driven program detail pages), and a legacy `[course]/` dynamic route. Engineering also has `coe/` (Centre of Excellence). 

### Authentication & authorization

- **`src/proxy.ts` is the Next.js 16 middleware** (Next 16 renamed `middleware.ts` → `proxy.ts`). It wraps NextAuth `auth()` and gates `/admin/:path*` + `/api/admin/:path*`: unauthenticated requests redirect to `/admin/login?callbackUrl=...`; an authenticated user hitting the login page is sent to `/admin/dashboard`. This proxy is the real route gate — admin layouts also check the session as defense-in-depth.
- **`src/auth.ts`** configures NextAuth: Credentials provider only (email + password, bcrypt compare), JWT session with 24h `maxAge`. The session/JWT carries `role`, `institution`, and `programs[]`.
- **Roles** (`src/lib/permissions.ts`): `viewer` (0) < `editor` (1) < `admin` (2) < `super_admin` (3). Helpers: `hasMinRole`, `canEdit` (editor+), `canPublish` (admin+), `canManageUsers` (super_admin), `canAccessProgram` — editors are scoped to their `institution` and an optional `programs[]` allowlist; admins+ access everything.
- In API routes, call `requireRole(req, minRole)` from `src/lib/api-helpers.ts`. It returns `{ session, error }`; if `error` is truthy, return it directly.

### API design

- **Admin routes** (`src/app/api/admin/*`): gate with `requireRole`, parse with `validateBody(req, ZodSchema)` (or `validateFields` for multipart), record `logAudit(...)` (non-fatal), and call `revalidateTargets(...)` after writes. Response/error helpers in `src/lib/api-helpers.ts`: `json`, `badRequest`, `validationError`, `unauthorized`, `forbidden`, `notFound`, `serverError`.
- **Public routes** (`src/app/api/public/*`): no auth, `export const revalidate = 3600` (1h ISR). Responses use a `{ source, data }` envelope (`source` is `"db" | "empty" | "error"`).
- Some admin routes have `seed/` sub-routes for bootstrapping data (`programs`, `recruiters`, `testimonials`, `site-config`).

### Database & connection

- **`connectDB()`** (`src/lib/mongodb.ts`): a globally cached Mongoose connection (`global._mongooseConn`), guarded by `readyState === 1`, with a 10s connect-timeout race and `bufferCommands: false`. Call it at the start of any route that touches the DB.
- Models use the singleton guard `mongoose.models.X ?? mongoose.model(...)` to survive hot reload. Exported from `src/lib/models/index.ts`: `User`, `SiteConfig`, `ImageAsset`, `Program`, `Recruiter`, `Testimonial`, `AuditLog`.

### Program CMS — the content builder (most important subsystem)

There is **no `Department` model** anymore. Rich page content that used to live on a Department now lives on **`Program`** — the `Program.content` field's schema comment notes it "was previously stored on Department.content". If you encounter "department" in older branches/docs, that concept is folded into Program.

- A **`Program`** (`src/lib/models/Program.ts`) has card-level fields (`name`, `abbr`, `slug`, `institution`, `degree`, `duration`, `seats`, `image`, `highlight`, `description`, `outcomes`, `sort_order`, `is_active`) **plus** a rich-content draft/publish pair: `content` (draft, `Mixed`), `published_content` (live snapshot), `status: "draft" | "published" | "archived"`, `version`, `published_at`.
- **Content shape** (`src/lib/program-tabs.ts`): a `TabsProgram` has `tabs[]`; each `Tab` has `id`, `label`, optional `icon`, and `sections[]`; each `Section` is one of `richText`, `stats`, `list`, `cards`, `image`, `people`.
- **The editor** (`src/app/admin/(protected)/programs/[id]/page.tsx` with `ProgramContentEditor`, `ProgramTabsEditor`, `CurriculumEditor`, `ProgramLabelsEditor` in `src/components/admin/`) is a **live-preview builder**: edit content on one side, see the rendered public page on the other.
- **Publish flow**: `POST /api/admin/programs/[id]/publish` copies `content` → `published_content`, sets `status: "published"`, bumps `version`. `POST /api/admin/programs/[id]/migrate-tabs` upgrades older content shapes to the current tabs format.
- **Public reads** go through `src/lib/public-programs.ts` (`listPublicPrograms`, `getPublishedProgramBySlug`, `listPublishedProgramSlugs`). These only return docs with `status: "published"` and non-null `published_content`, then run the content through `src/lib/normalize-program-data.ts` to produce the typed `ProgramData` the public pages render.

### SiteConfig & page content

- **`SiteConfig`** docs are keyed by a unique `config_key`, with a draft/publish pair `value` / `published_value` and `status: "draft" | "published"`.
- Allowed config keys are a **fixed registry** in `src/lib/validation/siteConfig.ts` (`SITE_CONFIG_SCHEMAS`) — each key maps to a Zod schema, and unknown keys are rejected. Keys include `contact`, `social`, `address`, `stats`, `accreditations`, `home`, `homeStats`, `engineeringHero`, `engineeringMetrics`, `artsScienceHero`, `polytechnicAdmissions`, etc. Add a new site-wide setting by adding an entry here.
- The admin "page content" pages (`(protected)/page-content/`, `(protected)/main/page-content/`) edit these config keys via `PageContentForms.tsx` / `PageContentShell.tsx`.

### Images & documents

- **Images**: uploaded via `POST /api/admin/images/upload` (FormData) → validated for mime/size → stored in R2 via `src/lib/r2.ts` → an `ImageAsset` doc records metadata (url, alt text, category, institution). If R2 env vars are absent, images fall back to local serving via `/api/public/images/[...path]` or `/api/admin/images/serve/[...key]`.
- **Documents**: `POST /api/admin/documents/upload` handles non-image assets (e.g. prospectus/pamphlet PDFs).
- `next.config.ts` `images.remotePatterns` allowlists external hosts (unsplash, pravatar, wikimedia, companieslogo, the R2 public domain) and applies a strict CSP that sandboxes SVGs.

### Caching & revalidation

- Public API routes use 1h ISR (`export const revalidate = 3600`).
- After a content write, call helpers from `src/lib/revalidate.ts`:
  - `revalidateTargets(...targets)` — targets are `"home" | "engineering" | "arts-science" | "polytechnic" | "all-institutions"`.
  - `revalidateForConfigKey(key)` — looks up the affected pages via the `SITE_CONFIG_KEY_TARGETS` map and also clears the `/api/public/site-config` route cache.
  - `revalidatePaths(...paths)` — revalidate explicit paths.

### Frontend structure & state

- **`src/modules/<inst>/`** holds per-institution public page **section components** (e.g. `EngineeringHero`, `EngineeringMetrics`, `EngineeringDomains`, `Admissions`, `Testimonials`), composed by the institution `page.tsx` files. Reusable layout/UI components live in `src/components/layout`, `src/components/shared`, `src/components/ui`.
- **`src/data/`** holds static content not in the CMS: `site.ts`, `home.ts`, `engineering.ts`, `*-programs.ts`, `all-navigations.ts`, and `chatbot/` (data for the Meritto chatbot wired through `/api/chat`).
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
5. Public API (if needed): `src/app/api/public/newtype/route.ts` with `revalidate = 3600`.
6. If it affects public pages, extend `src/lib/revalidate.ts`.

### Publish draft content

`Program` and `SiteConfig` use a draft/publish split. Publishing copies the draft field into the published field, flips `status` to `"published"`, and bumps `version`. The public site reads **only** published content; drafts are visible only in the admin.

### Cache invalidation after a write

```typescript
import { revalidateTargets, revalidateForConfigKey } from "@/lib/revalidate";

revalidateTargets("engineering", "arts-science"); // institution pages
revalidateForConfigKey("engineeringHero");        // a changed site-config key
```

## Conventions

- **ESLint + Prettier**: `eslint.config.mjs` (flat config, TS + react-hooks) and `.prettierrc` (2-space, double quotes, trailing commas, 80 col, Tailwind class sorting). Unused vars are a warning unless prefixed `_`.
- **Imports**: use the `@/*` alias for `src/*`.
- **Logging**: `console.log/error` with a `[context]` prefix (see `src/auth.ts`).
- **Errors**: API routes catch, log, and return a 500 via `serverError()`. Audit logging never throws fatally.
- **Build**: `output: "standalone"` for Docker/Node deployment.

### Agent guidance (from `AGENTS.md`)

- Prefer local Next.js docs in `node_modules/next/dist/docs` over training data.
- Follow App Router conventions; Server Components by default, Client Components only when interaction is required.
- Prefer async/await data fetching with caching.
