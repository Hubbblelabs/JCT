import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";
import {
  requireRole,
  json,
  badRequest,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit, AUDIT_PAGE_SIZE } from "@/lib/audit";

/**
 * Retention windows the UI offers, in days. Deliberately a closed set with a
 * floor of 15: an audit trail whose operator can clear it to nothing on a whim
 * is not an audit trail, so "delete everything" is not on the menu. Entries
 * already expire on their own after a year via the model's TTL index; this is
 * for trimming earlier than that.
 */
const PURGE_WINDOWS = [15, 30, 90, 180, 365] as const;

const AuditPurgeSchema = z.object({
  olderThanDays: z
    .number()
    .int()
    .refine(
      (n) => (PURGE_WINDOWS as readonly number[]).includes(n),
      `Must be one of: ${PURGE_WINDOWS.join(", ")}`,
    ),
});

const MAX_PAGE_SIZE = 200;

/**
 * One page of the trail, newest first.
 *
 * `before` is the `created_at` of the oldest row the caller already holds —
 * keyset paging rather than skip/limit, so a purge or a new write between
 * requests cannot make a row appear twice or be skipped.
 */
export async function GET(req: NextRequest) {
  // Audit history exposes other users' actions/emails. Editors are
  // institution-scoped and should not see global admin activity.
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  const params = req.nextUrl.searchParams;
  const rawLimit = Number(params.get("limit"));
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(Math.trunc(rawLimit), MAX_PAGE_SIZE)
      : AUDIT_PAGE_SIZE;
  const beforeRaw = params.get("before");
  const before = beforeRaw ? new Date(beforeRaw) : null;
  if (before && Number.isNaN(before.getTime())) {
    return badRequest("Invalid `before` timestamp");
  }

  try {
    await connectDB();
    // One extra row decides `hasMore` without a second count query.
    const docs = await AuditLog.find(
      before ? { created_at: { $lt: before } } : {},
    )
      .sort({ created_at: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = docs.length > limit;
    const page = hasMore ? docs.slice(0, limit) : docs;
    return json({
      rows: page.map((d: Record<string, unknown>) => ({
        id: String(d._id),
        entityType: String(d.entity_type ?? ""),
        action: String(d.action ?? ""),
        userEmail: String(d.user_email ?? ""),
        summary: String(d.summary ?? ""),
        createdAt: new Date(d.created_at as string).toISOString(),
      })),
      hasMore,
    });
  } catch (e) {
    console.error("[admin/audit] list failed", e);
    return serverError();
  }
}

/** Trim entries older than a fixed retention window. Admin only. */
export async function DELETE(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  const parsed = await validateBody(req, AuditPurgeSchema);
  if (!parsed.ok) return parsed.response;
  const { olderThanDays } = parsed.data;

  try {
    await connectDB();
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    const result = await AuditLog.deleteMany({ created_at: { $lt: cutoff } });
    const deleted = result.deletedCount ?? 0;

    // Recorded after the delete, so the purge itself is not swept up by its
    // own cutoff and the trail retains who trimmed it and by how much.
    const email =
      typeof (session?.user as { email?: unknown } | undefined)?.email ===
      "string"
        ? ((session!.user as { email: string }).email as string)
        : "";
    await logAudit(
      "audit",
      "deleted",
      email,
      `Deleted ${deleted} audit ${deleted === 1 ? "entry" : "entries"} older than ${olderThanDays} days`,
    );

    return json({ deleted });
  } catch (e) {
    console.error("[admin/audit] purge failed", e);
    return serverError();
  }
}
