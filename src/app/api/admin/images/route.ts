import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ImageAsset } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const institution = searchParams.get("institution");

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (institution) filter.institution = institution;

    const docs = await ImageAsset.find(filter).sort({ created_at: -1 }).limit(500);
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
