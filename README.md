# JCT Institutions

A Next.js 16 application that is both the **public marketing/admissions site**
and the **admin CMS** for three colleges in Coimbatore — JCT College of
Engineering & Technology, JCT College of Arts & Science, and JCT Polytechnic
College.

- Public site: institution landing pages, program listings, CMS-driven content
  pages, campus life, events. Server-rendered with ISR.
- Admin CMS (`/admin`): live-preview editors for programs, page content,
  placements, media, users, and site-wide configuration.

Persistence is MongoDB Atlas (Mongoose), auth is NextAuth.js, and image/document
storage is Cloudflare R2 (S3-compatible).

## Requirements

- **Node.js 22+**
- **pnpm** — this project is pnpm-only. `pnpm-workspace.yaml` carries
  load-bearing `overrides` (a `postcss` security patch and a single-copy `sharp`
  pin). npm and yarn ignore that file, resolve two copies of sharp, and the
  build then dies in the image optimizer with
  `ERR_DLOPEN_FAILED: libvips-cpp.so … cannot open shared object file`.
- A MongoDB connection string (Atlas or local).

## Setup

```bash
corepack enable pnpm
```

```bash
pnpm install
```

```bash
cp .env.example .env
```

Fill in at least `MONGODB_URI` and `NEXTAUTH_SECRET` in `.env` — the server
refuses to boot without them. Generate a secret with:

```bash
openssl rand -base64 32
```

Create the first admin user:

```bash
pnpm seed:admin
```

Then start the dev server:

```bash
pnpm dev
```

The site is at http://localhost:3000 and the CMS at http://localhost:3000/admin.

`pnpm seed:admin` is the only seed script. Every other piece of content is
authored through the admin CMS, or restored from a backup archive via the
Settings page.

## Scripts

```bash
pnpm dev        # dev server (Turbopack)
pnpm build      # production build (output: "standalone")
pnpm start      # run the production build
pnpm lint       # ESLint — note: this one runs with --fix
pnpm lint:ci    # ESLint without --fix
pnpm format     # Prettier (with Tailwind class sorting)
pnpm typecheck  # tsc --noEmit
```

There is no test framework in this repo. Verify changes with `pnpm build`,
`pnpm typecheck`, `pnpm lint:ci`, and by exercising the feature in a browser.

## Deployment

The app ships as a Docker image (`output: "standalone"`) to a self-hosted
server, built and deployed by `.github/workflows/build-deploy.yml`. Pushing to
`v3-admin` rebuilds and publishes the image; pushing a `vX.Y.Z` tag also deploys
it to production. It is **not** deployed to Vercel.

## Further reading

`CLAUDE.md` documents the architecture in depth — routing layout, the auth and
authorization model, the Program/Page/SiteConfig CMS subsystems, caching and
revalidation, and the storage-cleanup rules. Read it before making changes.
