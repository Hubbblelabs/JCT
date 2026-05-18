import { NextRequest, NextResponse } from "next/server";
import type { ZodIssue, ZodType } from "zod";
import { auth } from "@/auth";
import { hasMinRole, type Role } from "@/lib/permissions";

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
  return json(
    { error: "Validation failed", message: summary, details },
    422,
  );
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

export async function requireAuth(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: unauthorized() };
  }
  return { session, error: null };
}

export async function requireRole(req: NextRequest, minRole: Role) {
  const { session, error } = await requireAuth(req);
  if (error || !session) return { session: null, error: error ?? unauthorized() };

  const role = (session.user as Record<string, unknown>).role as string;
  if (!hasMinRole(role, minRole)) {
    return { session: null, error: forbidden() };
  }
  return { session, error: null };
}
