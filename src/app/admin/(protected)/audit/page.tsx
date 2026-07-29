export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { AuditLog } from "@/lib/models";
import { hasMinRole } from "@/lib/permissions";
import { PageShell } from "@/components/admin/kit/PageShell";
import { Banner } from "@/components/admin/kit/primitives";
import {
  AuditLogTable,
  type AuditRow,
} from "@/components/admin/AuditLogTable";

const CAP = 500;

async function getLogs(): Promise<{ rows: AuditRow[]; ok: boolean }> {
  try {
    await connectDB();
    const docs = (await AuditLog.find()
      .sort({ created_at: -1 })
      .limit(CAP)
      .lean()) as unknown as Record<string, unknown>[];
    return {
      ok: true,
      rows: docs.map((d) => ({
        id: String(d._id),
        entityType: String(d.entity_type ?? ""),
        action: String(d.action ?? ""),
        userEmail: String(d.user_email ?? ""),
        summary: String(d.summary ?? ""),
        createdAt: new Date(d.created_at as string).toISOString(),
      })),
    };
  } catch (err) {
    console.error("[admin/audit] load failed", err);
    return { ok: false, rows: [] };
  }
}

export default async function AuditPage() {
  const session = await auth();
  const role = (session?.user as Record<string, unknown> | undefined)?.role as
    | string
    | undefined;
  if (!session?.user || !hasMinRole(role ?? "", "admin")) {
    redirect("/admin/dashboard");
  }

  const { rows, ok } = await getLogs();

  return (
    <PageShell
      title="Audit log"
      description="Every content change made in this panel, newest first. Entries are kept for one year."
    >
      {!ok && (
        <div className="mb-4">
          <Banner tone="danger" title="Could not read the audit log">
            The database could not be reached. This is a display problem — no
            history has been lost.
          </Banner>
        </div>
      )}
      <AuditLogTable rows={rows} cap={CAP} />
    </PageShell>
  );
}
