import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const docs = await SiteConfig.find().sort({ config_key: 1 });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function PUT(req: NextRequest) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();
    const body = await req.json();
    const { config_key, value } = body;

    const doc = await SiteConfig.findOneAndUpdate(
      { config_key },
      { $set: { value, updated_by: session!.user?.email }, $inc: { version: 1 } },
      { upsert: true, new: true },
    );

    await logAudit("site-config", "updated", session!.user?.email ?? "", `Updated config: ${config_key}`);
    return json(doc);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
