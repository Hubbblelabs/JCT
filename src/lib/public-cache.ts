import "server-only";

/**
 * In-memory TTL cache for public read endpoints.
 *
 * The public API routes (/api/public/*) read query params from the request,
 * which makes them dynamic route handlers — `export const revalidate` is
 * inert on them and every hit would otherwise reach MongoDB. This cache
 * keeps those responses in memory and is explicitly invalidated by the
 * revalidate helpers whenever admin writes happen.
 *
 * Same deployment assumption as the rate limiter: a single long-lived
 * instance (standalone output). The TTL bounds staleness if that ever
 * changes; swap for Redis when scaling horizontally.
 */

type Entry = { value: unknown; expiresAt: number };

const store = new Map<string, Entry>();

const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1h, mirrors the intended ISR window

// Hard cap on retained entries. Cache keys are built from query params on
// unauthenticated routes, so without a bound an anonymous client can mint an
// unbounded number of never-read-again entries and exhaust the container's
// heap. Insertion order in a Map is stable, so the first key is the oldest.
const MAX_ENTRIES = 2000;

// Sweep expired entries every minute, mirroring src/lib/rate-limit.ts — lazy
// expiry alone only reclaims a key when that exact key is read again, which
// never happens for one-shot attacker-generated keys.
let sweepHandle: ReturnType<typeof setInterval> | null = null;
function ensureSweeper() {
  if (sweepHandle) return;
  sweepHandle = setInterval(() => {
    const now = Date.now();
    for (const [k, e] of store) {
      if (e.expiresAt <= now) store.delete(k);
    }
  }, 60_000);
  // Don't keep the event loop alive just for the sweeper.
  if (typeof sweepHandle.unref === "function") sweepHandle.unref();
}

export function publicCacheGet<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  // Re-insert so hot keys move to the back and survive eviction.
  store.delete(key);
  store.set(key, entry);
  return entry.value as T;
}

export function publicCacheSet(
  key: string,
  value: unknown,
  ttlMs = DEFAULT_TTL_MS,
): void {
  ensureSweeper();
  store.delete(key);
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  while (store.size > MAX_ENTRIES) {
    const oldest = store.keys().next();
    if (oldest.done) break;
    store.delete(oldest.value);
  }
}

/**
 * Drop cached public responses. Called from the revalidate helpers on every
 * content write — writes are rare and reads are hot, so clearing everything
 * (rather than tracking fine-grained dependencies) is the simple, safe call.
 */
export function publicCacheClear(): void {
  store.clear();
}
