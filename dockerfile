# ---------- Deps (install dependencies) ----------
FROM node:26-slim AS deps
WORKDIR /app
RUN npm install -g corepack
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --store=/pnpm-store

# ---------- Builder (build the app) ----------
FROM node:26-slim AS builder
WORKDIR /app
RUN npm install -g corepack
RUN corepack enable pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY . .
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