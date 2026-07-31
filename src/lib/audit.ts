import type { ZodIssue } from "zod";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";

/**
 * Rows per page of the audit trail — shared by the admin page's first render
 * and the `/api/admin/audit` endpoint that serves the older pages. It lives
 * here rather than in the route module because a Next route file may only
 * export handlers and segment config.
 */
export const AUDIT_PAGE_SIZE = 50;

export async function logAudit(
  entityType: string,
  action: string,
  userEmail: string,
  summary: string,
) {
  try {
    await connectDB();
    await AuditLog.create({
      entity_type: entityType,
      action,
      user_email: userEmail,
      summary,
    });
  } catch {
    // Audit logging should never break main flow
  }
}

/**
 * Record a rejected payload (422). Caps storage by truncating to the first
 * 3 issues — the goal is observability, not a full diff log.
 */
export async function logValidationFailure(
  entityType: string,
  userEmail: string,
  issues: ZodIssue[],
) {
  const head = issues
    .slice(0, 3)
    .map((i) => `${i.path.length ? i.path.join(".") + ": " : ""}${i.message}`);
  const more = issues.length > 3 ? ` (+${issues.length - 3} more)` : "";
  await logAudit(
    entityType,
    "validation-rejected",
    userEmail,
    head.join(" | ") + more,
  );
}
