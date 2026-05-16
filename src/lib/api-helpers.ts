import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasMinRole, type Role } from "@/lib/permissions";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function badRequest(message: string) {
  return json({ error: message }, 400);
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
