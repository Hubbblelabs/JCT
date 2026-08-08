# JCT Institutions

Public marketing/admissions site + admin CMS for three colleges in Coimbatore —
JCT College of Engineering & Technology, JCT College of Arts & Science, and
JCT Polytechnic College.

- Public site: institution landing pages, program listings, CMS-driven content
  pages, campus life, events. Server-rendered with ISR.
- Admin CMS (`/admin`): live-preview editors for programs, page content,
  placements, media, users, and site-wide configuration.

Stack: Next.js 16, MongoDB (Mongoose), NextAuth.js, and an S3-compatible object
store for images and documents. Everything runs on-prem by default — MongoDB
and Garage ship in `docker-compose.prod.yaml`.

## Requirements

- Node.js 22+
- pnpm — npm and yarn ignore `pnpm-workspace.yaml`, whose `overrides` pin a
  single copy of sharp; two copies break the build in the image optimizer.
- A MongoDB connection string.

## Setup

```bash
corepack enable pnpm && pnpm install && cp .env.example .env
```

Fill in at least `MONGODB_URI` and `NEXTAUTH_SECRET` — the server refuses to
boot without them. Generate a secret with:

```bash
openssl rand -base64 32
```

Create the first admin user, then start the dev server:

```bash
pnpm seed:admin && pnpm dev
```

Site at http://localhost:3000, CMS at http://localhost:3000/admin.

`pnpm seed:admin` is the only seed script. Everything else is authored in the
CMS or restored from a backup archive via the Settings page.

## Scripts

```bash
pnpm dev        # dev server (Turbopack)
pnpm build      # production build (output: "standalone")
pnpm start      # run the production build
pnpm lint       # ESLint — runs with --fix
pnpm lint:ci    # ESLint without --fix
pnpm format     # Prettier
pnpm typecheck  # tsc --noEmit
```

No test framework. Verify with `pnpm build`, `pnpm typecheck`, `pnpm lint:ci`,
and in a browser.

## Storage

Any S3-compatible server, configured entirely by `STORAGE_*` env vars (see
`.env.example`). On-prem Garage is the default — `deploy/garage.toml.example`
covers cluster setup, bucket creation and the CORS rule that browser-direct
presigned uploads need; `deploy/nginx-jct.conf.example` terminates TLS in front
of it.

Two things bite: `STORAGE_REGION` must match the server's configured region
exactly or every call fails `SignatureDoesNotMatch`, and
`NEXT_PUBLIC_STORAGE_PUBLIC_URL` must be https and is inlined at build time —
changing it needs a rebuild, not a restart.

## Deployment

Docker image (`output: "standalone"`) to a self-hosted server, built and
deployed by `.github/workflows/build-deploy.yml`. Pushing to `v3-admin`
rebuilds and publishes the image; pushing a `vX.Y.Z` tag also deploys it.
`docker-compose.prod.yaml` runs the app, MongoDB and Garage, all on loopback
behind nginx.

## Further reading

`CLAUDE.md` documents the architecture in depth — routing, auth, the CMS
subsystems, caching and revalidation, and the storage-cleanup rules.
