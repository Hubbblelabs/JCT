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
    await AuditLog.create({ entity_type: entityType, action, user_email: userEmail, summary });
  } catch {
    // Audit logging should never break main flow
  }
}
