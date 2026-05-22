import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "super_admin");
  if (error) return error;

  try {
    await connectDB();
    const docs = await SiteConfig.find().sort({ config_key: 1 }).lean();

    const backup = {
      version: "1.0",
      exported_at: new Date().toISOString(),
      exported_by: session!.user?.email,
      configs: docs.map((doc) => ({
        config_key: doc.config_key,
        value: doc.value,
        published_value: doc.published_value ?? null,
        status: doc.status,
        version: doc.version,
        published_at: doc.published_at ?? null,
      })),
    };

    await logAudit(
      "site-config",
      "exported",
      session!.user?.email ?? "",
      `Exported ${docs.length} config entries`,
    );

    const filename = `jct-site-config-${new Date().toISOString().slice(0, 10)}.json`;
    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("[site-config/backup]", e);
    return serverError();
  }
}
