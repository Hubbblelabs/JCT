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

export function publicCacheGet<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function publicCacheSet(
  key: string,
  value: unknown,
  ttlMs = DEFAULT_TTL_MS,
): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/**
 * Drop cached public responses. Called from the revalidate helpers on every
 * content write — writes are rare and reads are hot, so clearing everything
 * (rather than tracking fine-grained dependencies) is the simple, safe call.
 */
export function publicCacheClear(): void {
  store.clear();
}
