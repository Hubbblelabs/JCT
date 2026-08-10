# ---------- Deps (install dependencies) ----------
FROM node:26-slim AS deps
WORKDIR /app
RUN npm install -g corepack
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Increase fetch timeout for slow networks (default 60s → 5 min)
RUN pnpm config set fetch-timeout 300000
RUN pnpm install --frozen-lockfile --store=/pnpm-store

# ---------- Builder (build the app) ----------
FROM node:26-slim AS builder
WORKDIR /app
RUN npm install -g corepack
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .
# NEXT_PUBLIC_* vars are inlined by `next build`, so they must be present here,
# not just at container runtime — this is what next.config.ts reads to build
# images.remotePatterns for the asset host, and what
# src/lib/storage-public.ts#publicAssetBaseUrl reads to turn a stored storage
# key into a full URL. Missing it silently degrades to the local image-proxy
# route, but any image already stored as a full URL then fails at request time
# with '"url" parameter is not allowed' because the asset host was never
# allowlisted in this build. It's a public value (just the bucket's public
# domain), so a plain build ARG is fine — unlike MONGODB_URI it doesn't need
# the BuildKit secret mechanism. Not setting it at build time cannot be fixed
# by setting it at runtime.
ARG NEXT_PUBLIC_STORAGE_PUBLIC_URL
ENV NEXT_PUBLIC_STORAGE_PUBLIC_URL=${NEXT_PUBLIC_STORAGE_PUBLIC_URL}
# Same build-time-only rule as the asset origin above. src/lib/page-nav-links.ts
# compares navbar hrefs against this to decide which absolute URLs are
# same-origin; unset at build time it reads as undefined in the bundle and the
# admin page list badges live, linked pages as orphans.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
# MONGODB_URI is injected as a BuildKit secret (never persisted in the image
# layers) so `next build` can reach MongoDB and prerender the public ISR pages
# with real content. Without it, DB-backed pages (campus-life, coe, about,
# events, placements, accreditations) bake as 404/empty and only recover after
# an admin Save force-revalidates. Optional at build: if absent, pnpm build
# still succeeds and those pages degrade to their empty/404 fallbacks.
RUN --mount=type=secret,id=mongodb_uri,env=MONGODB_URI pnpm build

# ---------- Runner ----------
FROM node:26-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

USER node

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]