import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateTargets } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();
    const result = await SiteConfig.deleteMany({});
    revalidateTargets("all-institutions");

    await logAudit(
      "site-config",
      "reset",
      session!.user?.email ?? "",
      `Reset all site configs — deleted ${result.deletedCount} entries`,
    );

    return json({ deleted: result.deletedCount });
  } catch (e) {
    console.error("[site-config/reset]", e);
    return serverError();
  }
}
