# JCT Institutions — Full QA/QC & Security Audit

**Repo:** `D:\Github\JCT` · **Branch:** `v2-admin` · **Date:** 2026-07-28
**Stack confirmed:** Next.js 16.2.12 **App Router** (not Pages Router), React 19, Mongoose 9, NextAuth v5 beta.31, Cloudflare R2 (S3 SDK), Zod 4, pnpm.

**Method:** static review + **live testing against the real QA infrastructure** from `.env`
(MongoDB Atlas `jct_qa`, R2 bucket `jct-qa`), driving a real production build (`next build` → `next start`)
with authenticated admin and editor sessions. 107 routes swept; CRUD, authz, injection, upload and
orphan-cleanup flows executed end-to-end.

> **Environment restored after testing.** All seeded QA rows deleted (DB back to 0 docs in every
> collection, its pre-audit state), R2 bucket back to 0 objects, servers stopped, working tree clean.

---

## 1. Pass/Fail Summary by Area

| Area | Verdict | Notes |
|---|---|---|
| **Build & types** | ✅ PASS | `pnpm build` exit 0; `pnpm typecheck` clean |
| **Lint** | ❌ FAIL | `pnpm lint` exits 1 — ESLint config gap (F7) |
| **Public page routes** (57 tested) | ✅ PASS | All render 200, no broken routes, no crashes |
| **Not-found handling** | ⚠️ PARTIAL | Correct content, **wrong HTTP status** — soft 404s (F6) |
| **Public API routes** | ⚠️ PARTIAL | Correct shape/caching/405s, but **draft leak by default** (F2) |
| **Admin API — authn** | ✅ PASS | All `/api/admin/*` → 401 unauthenticated |
| **Admin API — authz** | ✅ PASS | Editor scoping, role gates, anti-escalation all enforced |
| **Admin page protection** | ⚠️ CONDITIONAL | Correct when auth works; **fails open when auth errors** (F3) |
| **Authentication** | ❌ **FAIL (prod)** | **Login 500s in every production build** (F1) |
| **MongoDB — connection** | ✅ PASS | Cached conn + in-flight promise dedupe; no leaks |
| **MongoDB — schema match** | ✅ PASS | Live index/field audit matched models; no typos |
| **MongoDB — CRUD** | ✅ PASS | Create/read/update/publish/delete all verified live |
| **MongoDB — index design** | ⚠️ PARTIAL | `Program.slug` global-unique vs `Page (inst,slug)` (F5) |
| **Injection / input validation** | ✅ PASS | NoSQL injection rejected; Zod 422s structured |
| **R2 — upload/download/delete** | ✅ PASS | Full round trip verified against live bucket |
| **R2 — signed URLs** | ✅ PASS | 300s expiry; **ContentLength pinned** → 403 on size mismatch |
| **R2 — file validation** | ✅ PASS | MIME allowlist, magic-byte decode, SVG blocked, size cap |
| **R2 ↔ DB orphan handling** | ✅ PASS | Verified both directions |
| **Admin panel CRUD** | ✅ PASS | Programs, Pages, publish, audit all functional |
| **Error handling consistency** | ⚠️ PARTIAL | Good overall; invalid ObjectId → 500 (F4) |
| **Secrets hygiene** | ✅ PASS | `.env` gitignored and untracked; no secrets in source |

---

## 2. Bugs & Broken Functionality

### 🔴 F1 — CRITICAL: Admin login is completely broken in production builds

`trustHost` is never configured. NextAuth v5 defaults it to `false` outside development, so every
`/api/auth/*` call fails.

**Reproduced on a clean production build, on the exact host/port in `NEXTAUTH_URL`:**

```
GET  /api/auth/csrf                  → 500 {"message":"There was a problem with the server configuration."}
POST /api/auth/callback/credentials  → 500
GET  /api/auth/session               → 500
```

Server log:
```
[auth][error] UntrustedHost: Host must be trusted. URL was: http://localhost:3000/api/auth/session.
```

`AUTH_TRUST_HOST` appears **nowhere** — not in `src/auth.ts`, `.env`, `.env.example`, `dockerfile`,
or `docker-compose.prod.yaml`. Since `docker-compose.prod.yaml` uses `env_file: .env`, the deployed
container inherits the same gap. **No one can log into the admin panel in production.**

**Proof of fix** — re-ran the identical build with `AUTH_TRUST_HOST=true`:
```
login: 302
session: {"user":{"name":"QA Admin","role":"admin","institution":"all",...}}
```

**Fix** (in `src/auth.ts`, alongside the existing `secret:` line — preferred, since it can't be lost
by an incomplete `.env` on a new host):
```ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  // ...
});
```
Then add `AUTH_TRUST_HOST=true` to `.env.example` as documentation. Note this is safe here because
the app sits behind your own reverse proxy; if it were directly internet-facing you'd instead pin
the expected host.

---

### 🟠 F2 — HIGH: Public API leaks unpublished (draft) programs

`src/app/api/public/programs/route.ts:13` — `publishedOnly` is **opt-in**:

```ts
const publishedOnly = searchParams.get("published") === "true";
```

and `listPublicPrograms` defaults `publishedOnly = false` (`src/lib/public-programs.ts:112`), where
`publishedQuery(false)` returns `{}` — no status filter at all.

**Live proof** — unauthenticated request returned draft programs alongside published ones:
```
GET /api/public/programs?institution=engineering
→ qa-cse  qa-editor-eng  qa-temp-prog  qa-draft-only
         ^^^^^^^^^^^^^^  ^^^^^^^^^^^^  ^^^^^^^^^^^^^  all status:"draft"
```
Exposed fields: `name`, `abbr`, `slug`, `description`, `highlight`, `seats`, `outcomes`, `image`.

The detail endpoint and the public *pages* are correctly filtered — this is the **list endpoint only**.
Both in-app callers already pass `published=true`
([courses/page.tsx:153](src/app/institutions/engineering/courses/page.tsx:153),
[EngineeringDomains.tsx:379](src/modules/engineering/EngineeringDomains.tsx:379)), so **inverting the
default breaks no existing caller**.

**Fix** — make published the default and require explicit opt-out:
```ts
// route.ts
const publishedOnly = searchParams.get("published") !== "false";
```
Better still, change `publishedOnly = false` → `publishedOnly = true` in `listPublicPrograms` so the
library is safe-by-default for future callers.

---

### 🟠 F3 — HIGH: Admin gate fails *open* when the auth layer errors

While F1 was active (auth throwing), the proxy did **not** block admin pages:

```
GET /admin/dashboard   → 200   (unauthenticated)
GET /admin/users       → 200
GET /admin/login       → 307 → /admin/dashboard   ← treated caller as logged in
```

Worse, the 200 response **streamed real database content** in the RSC flight payload despite the
layout calling `redirect()`:

> `"Welcome, Admin"` · Active Programs `4` · Published `3` · Placements `1` · Testimonials `1`
> · hub structure with per-section page counts

Two compounding causes:

1. **`src/proxy.ts` has no error handling.** Its failure mode is permissive — when `req.auth`
   resolution breaks, requests fall through to `NextResponse.next()`.
2. **A `redirect()` in `layout.tsx` does not stop sibling page segments.** App Router renders layout
   and page in parallel, so `src/app/admin/(protected)/layout.tsx:15` redirected while the dashboard
   page had already queried Mongo and flushed its data.

Once F1 is fixed the proxy gates correctly (verified: all admin pages → `307 → /admin/login?callbackUrl=…`,
all admin APIs → `401`). But the defense-in-depth layer the code comments claim does not actually hold.

**Fix:**
```ts
// src/proxy.ts — fail closed
export default auth((req) => {
  try {
    // ...existing logic
  } catch (err) {
    console.error("[proxy] auth resolution failed:", err);
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
});
```
And move the session check into the data-fetching path (or `await auth()` at the top of each admin
page before querying) so no admin page renders DB data without a verified session.

---

### 🟡 F4 — MEDIUM: Invalid ObjectId returns 500 instead of 400/404

An unparseable `[id]` throws a Mongoose `CastError` that lands in the generic catch:

```
GET /api/admin/programs/notanobjectid  → 500 {"error":"Internal server error"}
GET /api/admin/pages/xyz               → 500
GET /api/admin/testimonials/zzz        → 500
GET /api/admin/events/zzz              → 500
GET /api/admin/placements/zzz          → 500
```

Wrong status class (a client error reported as a server fault), and it pollutes production error
logs/alerting with attacker- or crawler-triggered noise.

**Fix** — guard once in `src/lib/api-helpers.ts` and call it in each `[id]` route:
```ts
import { Types } from "mongoose";

export function invalidId(id: string) {
  return Types.ObjectId.isValid(id) ? null : notFound();
}
```
```ts
const { id } = await params;
const bad = invalidId(id);
if (bad) return bad;
```
Affects: `programs/[id]`, `pages/[id]`, `testimonials/[id]`, `events/[id]`, `placements/[id]`
(plus their `publish` sub-routes).

---

### 🟡 F5 — MEDIUM: `Program.slug` is globally unique; `Page` is per-institution

`src/lib/models/Program.ts:35` declares `slug: { unique: true }`. Live index dump confirms
`programs: slug_1(uniq)` versus `pages: institution_1_slug_1(uniq)`.

**Live proof:**
```
POST program engineering/qa-dupprog   → 201
POST program polytechnic/qa-dupprog   → 400 {"error":"Program with this slug already exists"}
POST page    main/qa-dup              → 201
POST page    engineering/qa-dup       → 201   ← Page allows it
```

Two colleges cannot both have `computer-science`, `mathematics`, `civil-engineering` etc. — a real
constraint for this three-college site, and inconsistent with the Page model right beside it. Public
lookups already filter on `{ slug, institution }`, so the global constraint buys nothing.

**Fix** — align with `Page`:
```ts
slug: { type: String, required: true },       // drop `unique: true`
ProgramSchema.index({ institution: 1, slug: 1 }, { unique: true });
```
Requires dropping the old `slug_1` index on existing databases:
`db.programs.dropIndex("slug_1")`. Also update the duplicate-check in
`src/app/api/admin/programs/route.ts` to query on `{ slug, institution }`.

---

### 🟡 F6 — MEDIUM: Soft 404s — missing pages return HTTP 200

Every dynamic page renders the correct "Page not found" UI but with a **200** status:

```
/p/nope-404                                       → 200  (body = 404 page)
/events/does-not-exist                            → 200
/institutions/engineering/programs/nope-404       → 200
/institutions/engineering/programs/qa-draft-only  → 200  (draft → 404 body, correct content)
/institutions/arts-science/p/nope-404             → 200
```

The **source is correct** — these pages call `notFound()` (verified in `src/app/p/[slug]/page.tsx:38`
and 19 other files). The 200 comes from the Next 16 ISR/streaming interaction: these are SSG routes
(`generateStaticParams` + `revalidate = 3600` + `dynamicParams`), and the status is committed before
`notFound()` resolves.

Impact: search engines index nonexistent URLs as valid pages, and any client checking `res.ok` /
status gets a false positive. No data is leaked — draft and deleted content correctly render the
404 body.

**Fix** — verify against your Next 16 patch version, then either move the existence check into
`generateMetadata` + a route-level `dynamic = "force-dynamic"` for the not-found path, or add an
explicit `notFound.tsx` per dynamic segment so the status is set before streaming begins. Worth
confirming with a minimal repro before reworking the caching strategy — the trade-off is losing ISR
on those routes.

---

### 🟡 F7 — MEDIUM: `pnpm lint` fails (ESLint config gap)

```
D:\Github\JCT\scripts\_mongo-dns.mjs
  42:21  error  'URL' is not defined  no-undef
✖ 1 problem (1 error, 0 warnings)
[ELIFECYCLE] Command failed with exit code 1.
```

Root cause: the base config covers `**/*.{js,jsx,mjs,cjs,ts,tsx}` (`eslint.config.mjs:9`), but the
override that disables `no-undef` covers only `**/*.{js,jsx,ts,tsx}` (line 63) — **`.mjs` and `.cjs`
are omitted**, so every `.mjs` seed/migration script is linted against a globals list that lacks
`URL`, `crypto`, `fetch`, `URLSearchParams`, etc. `_mongo-dns.mjs` is simply the first file to trip it.

**Fix** — one-character-class change:
```js
// eslint.config.mjs:63
files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
```
Note `pnpm lint` runs `eslint . --fix`, so CI cannot use it as a read-only check — consider a
separate `lint:ci` without `--fix`.

---

### 🟢 F8 — LOW: Four `package.json` scripts point at files that don't exist

```
seed:programs:engineering    → scripts/seed-programs-engineering.js      MISSING
seed:deptcontent:engineering → scripts/seed-deptcontent-engineering.mjs  MISSING
seed:deptcontent:polytechnic → scripts/seed-deptcontent-polytechnic.mjs  MISSING
seed:deptcontent:arts-science→ scripts/seed-deptcontent-arts-science.mjs MISSING
```
(8 npm entries counting the `:dry` variants.) All are documented in `CLAUDE.md` as the way to
bootstrap a fresh DB — following those instructions fails. Only `seed-deptcontent-eee.mjs` survives.
Either restore the scripts or remove the entries and the CLAUDE.md references.

### 🟢 F9 — LOW: Leftover scratch files committed in `scripts/`
`scripts/_tmp-missing.json` and `scripts/_tmp-missing.mjs` are one-off debris. Delete.

### 🟢 F10 — LOW: `CLAUDE.md` has drifted from the code
- Documents a **`Recruiter` model** and `/api/admin/recruiters` + recruiters seed route — none exist
  (no `src/lib/models/Recruiter.ts`, no `src/app/api/admin/recruiters/`). Only `/admin/recruiters`
  (page) and `/api/public/recruiters` exist; the data lives in SiteConfig.
- `src/lib/models/index.ts` exports `Event` and `Placement`, which the doc's model list omits.

Stale architecture docs actively mislead — worth a pass since this file is auto-loaded into context.

---

## 3. Security Notes

### Verified strong (no action needed)

| Control | Evidence |
|---|---|
| Admin API authn | All `/api/admin/*` → `401` unauthenticated, including unknown paths |
| Editor institution scoping | Editor@engineering → `POST` arts-science program = **403** |
| Role gates | Editor → users list/create, audit log, site-config write = **403** each |
| Privilege escalation | Editor `PATCH /users/{self} {"role":"admin"}` = **403** |
| Password storage | bcrypt; `password_hash` has `select: false` so queries can't leak it by omission |
| User enumeration | Dummy-hash compare on the not-found path equalises response timing |
| Login brute force | Dual rate limit — per `(ip\|email)` **and** per-email (spoof-proof bucket) |
| NoSQL injection (auth) | `{"email":{"$ne":null},"password":{"$ne":null}}` → no session created (`session: null`) |
| NoSQL injection (query) | `?institution={"$ne":"x"}` → treated as a literal string, `{"source":"empty","data":[]}` |
| Open redirect | `callbackUrl` restricted to same-origin relative paths (`login/page.tsx:36-39`) |
| Path traversal (R2 serve) | `/api/admin/images/serve/../../etc/passwd` → 404; public variant → 404 |
| Path traversal (presign) | `../../etc/passwd` → sanitised to `documents/…-.._.._etc_passwd` |
| Presigned URL integrity | 300s expiry; `ContentLength` is a **signed header** — oversize upload → **403**, exact size → 200 |
| Upload validation | MIME allowlist, magic-byte decode via sharp (`failOn:"error"`), SVG double-blocked, 268MP decode cap, size cap |
| HTTP method handling | `PUT`/`PATCH`/`DELETE` on read-only routes → `405` |
| Security headers | CSP (SVG-sandboxing), `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy |
| Secrets in VCS | `.env` gitignored (`.gitignore:52`) and untracked; no hardcoded secrets in source |
| Audit trail | Writes logged with actor email; 1-year TTL index confirmed live |

### Gaps

1. **F1 — auth misconfiguration takes down login in production.** Availability, not exposure, but total.
2. **F3 — the admin gate fails open**, and layout-level `redirect()` does not prevent page segments
   from rendering DB data. Both layers are weaker than the code comments claim.
3. **F2 — unpublished content is publicly enumerable.** Not credentials, but embargoed programme
   data (new courses, seat counts) is visible before launch.
4. **Rate limiting is in-memory and per-instance.** `src/lib/rate-limit.ts` and
   `src/lib/public-cache.ts` both assume a single instance. Correct for the current single-container
   deploy — but if you ever scale to >1 replica, login throttling weakens proportionally and cache
   invalidation after admin writes becomes partial (stale public content). Move to Redis before
   scaling out.
5. **`enforceInstitutionScope` treats empty-vs-empty as a match.** In
   `src/lib/api-helpers.ts:153-164`, both sides fall back to `""`, so an editor whose `institution`
   is unset would pass the check against a resource with no institution. Not reachable today (the
   User schema defaults `institution` to `"all"`), but it's a latent fail-open. Reject empty
   institutions explicitly.
6. **`programs[]` allowlist is dead code.** `canAccessProgram` ignores `_userPrograms` and
   `_targetProgram` entirely (`src/lib/permissions.ts:25-33`). Correctly documented in CLAUDE.md,
   but the admin UI collects per-program permissions that are never enforced — an admin could
   reasonably believe an editor is restricted to two programs when they have full institution access.
   Either implement it or remove the field from the UI.
7. **Rotate the credentials in `.env` if that file has ever been shared.** It contains live MongoDB
   Atlas and R2 keys. It is properly gitignored and untracked, so this is precautionary only.

---

## 4. UI/UX & User Flow Suggestions

1. **Fix the soft 404s (F6)** — this is the highest-impact SEO item on the public site. A college
   site ranking nonexistent programme URLs is a real acquisition problem.
2. **Login has no rate-limit feedback.** When the limiter trips, `authorize()` returns `null` and the
   user sees the generic *"Invalid email or password"* — indistinguishable from a wrong password, so
   they keep retrying and stay locked out. Surface a distinct "Too many attempts, try again in Ns".
3. **No logged-out / session-expired signal.** JWT `maxAge` is 24h; when it lapses mid-edit the user
   is bounced to login and unsaved work in the program builder is lost. Add an expiry warning and
   draft autosave to `localStorage`.
4. **Public API error envelope is indistinguishable from empty.** `{ source: "error", data: [] }`
   returns HTTP **200** (`public/programs/route.ts:33`), so a Mongo outage renders as "no programmes
   available" rather than an error state. Return 503 or have the UI branch on `source`.
5. **Draft programmes are invisible in preview.** Since drafts 404 publicly, editors can't preview
   before publishing. A signed preview token (or admin-session-gated preview) would close the loop.
6. **`/institutions/<inst>/[course]` legacy dynamic route** still exists alongside `programs/[slug]`.
   Two URLs for the same content splits SEO authority — 301 the legacy shape to the canonical one.

---

## 5. Admin Panel Suggestions

1. **Implement or remove per-program permissions** (see Security gap 6) — a permission control that
   silently does nothing is worse than none.
2. **Only two roles exist** (`editor` < `admin`). A **viewer/read-only** role would suit reviewers
   and principals who need visibility without write access, and a **publisher** role would let you
   separate "can draft" from "can publish live" — valuable for a public-facing college site.
3. **No bulk actions.** Programs/pages lists have per-row actions only. Bulk publish / activate /
   delete would materially cut effort during term rollovers.
4. **Audit log is write-only in practice.** `/admin/audit` lists entries but has no filtering by
   actor, entity type, or date range, and no diff of *what* changed — only a summary string. Storing
   a before/after delta would make it genuinely useful for incident review.
5. **No restore path for deleted content.** Deletes are hard deletes and cascade into R2 object
   removal (verified). One misclick permanently destroys a programme's content and its images. Add
   soft delete (`deleted_at`) with a 30-day purge, given the destructive cleanup already wired in.
6. **Media library has no usage/orphan view.** `listR2Objects` already exists and the bucket is the
   source of truth. A "storage" screen showing untracked R2 objects and unreferenced `ImageAsset`
   rows would let you reclaim space safely.
7. **Publish is silent about scope.** `POST /publish` bumps `version` but the UI never shows which
   public URLs were revalidated or what changed since the last publish. A diff-and-confirm step
   would reduce accidental publishes.
8. **Editors can't see why an action failed.** Cross-institution writes return a bare
   `{"error":"Forbidden"}`; surfacing "You can only edit Engineering content" would cut support load.

---

## 6. Recommended Fix Order

| # | Finding | Severity | Effort |
|---|---|---|---|
| 1 | **F1** `trustHost` — login broken in prod | 🔴 Critical | 1 line |
| 2 | **F2** Draft programs leak on public API | 🟠 High | 1 line |
| 3 | **F3** Proxy fails open + layout redirect doesn't stop render | 🟠 High | Small |
| 4 | **F7** `pnpm lint` fails | 🟡 Medium | 1 line |
| 5 | **F4** Invalid ObjectId → 500 | 🟡 Medium | Small, 5 routes |
| 6 | **F5** Program slug uniqueness scope | 🟡 Medium | Schema + index migration |
| 7 | **F6** Soft 404s | 🟡 Medium | Needs Next 16 investigation |
| 8 | **F8/F9/F10** Missing scripts, debris, stale docs | 🟢 Low | Cleanup |

No code changes were made — per project convention, edits are yours to review and commit. F1 and F2
are each a one-line change and would be my first commit.
