import { NextRequest, NextResponse } from "next/server";
import type { ZodIssue, ZodType } from "zod";
import { auth } from "@/auth";
import { hasMinRole, canAccessInstitution, type Role } from "@/lib/permissions";
import { clientIpFromHeaders, consumeUploadAttempt } from "@/lib/rate-limit";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message: string) {
  return json({ error: message }, 400);
}

/**
 * Structured 422 for schema-rejected payloads. The shape is additive over
 * the standard `{ error: string }`: clients that don't know about `details`
 * still get a sensible message; clients that do can map each issue to a
 * form field via `path`.
 */
export type ValidationDetail = {
  path: (string | number)[];
  message: string;
  code: string;
};

export function validationError(issues: ZodIssue[]) {
  const details: ValidationDetail[] = issues.map((i) => ({
    path: i.path as (string | number)[],
    message: i.message,
    code: i.code,
  }));
  const first = details[0];
  const summary = first
    ? `${first.path.length ? first.path.join(".") + ": " : ""}${first.message}`
    : "Validation failed";
  return json({ error: "Validation failed", message: summary, details }, 422);
}

/**
 * Parse a JSON body against a Zod schema. Returns either the typed payload
 * or a ready-to-return NextResponse with 422 + structured errors. Usage:
 *
 *   const parsed = await validateBody(req, MySchema);
 *   if (!parsed.ok) return parsed.response;
 *   const data = parsed.data;
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: ZodType<T>,
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return {
      ok: false,
      response: badRequest("Request body must be valid JSON"),
    };
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    return { ok: false, response: validationError(result.error.issues) };
  }
  return { ok: true, data: result.data };
}

/**
 * Same as validateBody but for already-extracted form fields (used by
 * multipart upload routes where the File handling lives outside the schema).
 */
export function validateFields<T>(
  input: unknown,
  schema: ZodType<T>,
): { ok: true; data: T } | { ok: false; response: NextResponse } {
  const result = schema.safeParse(input);
  if (!result.success) {
    return { ok: false, response: validationError(result.error.issues) };
  }
  return { ok: true, data: result.data };
}

export function unauthorized() {
  return json({ error: "Unauthorized" }, 401);
}

export function forbidden() {
  return json({ error: "Forbidden" }, 403);
}

export function notFound(message = "Not found") {
  return json({ error: message }, 404);
}

export function serverError(message = "Internal server error") {
  return json({ error: message }, 500);
}

export function tooManyRequests(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: { "Retry-After": String(Math.max(1, retryAfterSec)) },
    },
  );
}

/**
 * Apply the upload rate limiter keyed by user email + client IP.
 * Returns a 429 response when over the limit, or null when allowed.
 */
export function enforceUploadRateLimit(
  req: NextRequest,
  userKey: string,
): NextResponse | null {
  const ip = clientIpFromHeaders(req.headers);
  const result = consumeUploadAttempt(`${userKey}|${ip}`);
  if (!result.allowed) return tooManyRequests(result.retryAfterSec);
  return null;
}

export async function requireAuth(_req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: unauthorized() };
  }
  return { session, error: null };
}

export async function requireRole(req: NextRequest, minRole: Role) {
  const { session, error } = await requireAuth(req);
  if (error || !session)
    return { session: null, error: error ?? unauthorized() };

  const role = (session.user as Record<string, unknown>).role as string;
  if (!hasMinRole(role, minRole)) {
    return { session: null, error: forbidden() };
  }
  return { session, error: null };
}

/**
 * Horizontal access-control guard. Admins act on any institution; editors
 * may only create/mutate resources belonging to their own `institution`.
 * Returns a ready-to-return 403 when the caller is out of scope, else null.
 *
 * For updates/deletes, pass the resource's *existing* institution, and
 * re-check separately if the request also tries to change `institution`.
 * Without this, an editor scoped to one college could mutate another
 * college's programs/pages/testimonials simply by guessing a document id.
 */
export function enforceInstitutionScope(
  session: { user?: unknown } | null,
  targetInstitution: string | undefined | null,
): NextResponse | null {
  const user = (session?.user ?? {}) as Record<string, unknown>;
  const role = (user.role as string) ?? "";
  const userInstitution = (user.institution as string) ?? "";
  if (!canAccessInstitution(role, userInstitution, targetInstitution ?? "")) {
    return forbidden();
  }
  return null;
}

/**
 * Mongo filter limiting *reads* to the caller's scope: admins see everything;
 * editors see only their own institution's documents (drafts included), and
 * optionally the shared `"all"` pool. Spread this AFTER any client-supplied
 * filter so the scope always wins.
 */
export function institutionReadFilter(
  session: { user?: unknown } | null,
  opts: { includeShared?: boolean } = {},
): Record<string, unknown> {
  const user = (session?.user ?? {}) as Record<string, unknown>;
  if ((user.role as string) === "admin") return {};
  const inst = (user.institution as string) ?? "";
  return opts.includeShared
    ? { institution: { $in: [inst, "all"] } }
    : { institution: inst };
}

/**
 * Horizontal access-control guard for shared media assets (images/documents).
 * Differs from `enforceInstitutionScope` in that the cross-college *shared*
 * pool (`institution === "all"` or unset) is editable by any editor — only
 * assets tagged to a *specific* other college are off-limits. Admins act on
 * anything. Returns a ready-to-return 403 when out of scope, else null.
 *
 * Without this, an editor scoped to one college could delete or rename
 * another college's images simply by guessing an asset id or storage key.
 */
export function enforceAssetScope(
  session: { user?: unknown } | null,
  assetInstitution: string | undefined | null,
): NextResponse | null {
  const user = (session?.user ?? {}) as Record<string, unknown>;
  const role = (user.role as string) ?? "";
  if (role === "admin") return null;
  const userInstitution = (user.institution as string) ?? "";
  const target = assetInstitution ?? "all";
  if (target === "all" || target === userInstitution) return null;
  return forbidden();
}
