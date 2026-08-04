/**
 * In-memory fixed-window rate limiter.
 *
 * Suitable for single-instance Next.js deployments. For multi-instance /
 * serverless deployments swap the store for Redis / Upstash — the API
 * here is intentionally narrow so callers don't change.
 *
 * Window resets when the first request inside it expires; we don't slide,
 * which is fine for brute-force / DoS guardrails (not pricing meters).
 */

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

// Sweep stale buckets every minute so the Map can't grow unbounded.
let sweepHandle: ReturnType<typeof setInterval> | null = null;
function ensureSweeper() {
  if (sweepHandle) return;
  sweepHandle = setInterval(() => {
    const now = Date.now();
    for (const [k, b] of store) {
      if (b.resetAt <= now) store.delete(k);
    }
  }, 60_000);
  // Don't keep the event loop alive just for the sweeper.
  if (typeof sweepHandle.unref === "function") sweepHandle.unref();
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  ensureSweeper();
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
  }
  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }
  bucket.count += 1;
  return {
    allowed: true,
    remaining: limit - bucket.count,
    retryAfterSec: 0,
  };
}

// 10 attempts per 5 minutes per (ip|email). Generous for legit retries,
// brutal for credential stuffing.
export function consumeLoginAttempt(key: string): RateLimitResult {
  return rateLimit(`login:${key}`, 10, 5 * 60 * 1000);
}

// Account-level cap, independent of client IP. The (ip|email) limiter above
// is trivially bypassed by rotating a spoofed X-Forwarded-For, so a per-email
// bucket is the real guard against a focused password-guessing attack on one
// account: 20 failed attempts per 15 minutes regardless of source IP.
export function consumeLoginAttemptByEmail(email: string): RateLimitResult {
  return rateLimit(`login-email:${email}`, 20, 15 * 60 * 1000);
}

// 30 uploads per minute per user. Protects sharp / R2.
export function consumeUploadAttempt(key: string): RateLimitResult {
  return rateLimit(`upload:${key}`, 30, 60 * 1000);
}

// Per-user upload cap that ignores client IP entirely. The (user|ip) bucket
// above is bypassable by rotating a spoofed X-Forwarded-For, so this is the
// real guard: 60 uploads per minute per account regardless of source.
export function consumeUploadAttemptByUser(userKey: string): RateLimitResult {
  return rateLimit(`upload-user:${userKey}`, 60, 60 * 1000);
}

/**
 * Resolve the client IP from proxy headers.
 *
 * X-Real-IP is read FIRST because it is the only header our own reverse proxy
 * sets from `$remote_addr` (deploy/nginx-jct.conf.example). X-Forwarded-For is
 * set with `$proxy_add_x_forwarded_for`, which *appends* the real peer to
 * whatever the client sent — so its left-most element is always attacker
 * chosen. When falling back to XFF we therefore take the LAST element, which
 * is the hop our proxy appended.
 */
export function clientIpFromHeaders(headers: Headers): string {
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const parts = fwd
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1]!;
  }
  return "unknown";
}
