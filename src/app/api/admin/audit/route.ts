import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";
import {
  requireRole,
  json,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

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

export async function GET(req: NextRequest) {
  // Audit history exposes other users' actions/emails. Editors are
  // institution-scoped and should not see global admin activity.
  const { error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();
    const logs = await AuditLog.find().sort({ created_at: -1 }).limit(200);
    return json(logs);
  } catch (e) {
    console.error(e);
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
