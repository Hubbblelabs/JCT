import type { ZodIssue } from "zod";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";

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
