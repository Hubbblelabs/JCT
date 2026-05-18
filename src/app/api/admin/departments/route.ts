import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Department } from "@/lib/models";
import { requireRole, json, badRequest, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const college = searchParams.get("college");
    const slug = searchParams.get("slug");
    const filter: Record<string, unknown> = {};
    if (college) filter.college = college;
    if (slug) filter.slug = slug;

    // Return full document when querying by slug (for program editor)
    // otherwise return lightweight list fields only
    const query = Department.find(filter).sort({ college: 1, slug: 1 });
    if (!slug) query.select("slug college status version published_at updated_at");
    const docs = await query;
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const body = await req.json();
    if (!body.slug || !body.college) return badRequest("slug and college are required");

    const existing = await Department.findOne({ slug: body.slug });
    if (existing) return badRequest("Department with this slug already exists");

    const doc = await Department.create({
      slug: body.slug,
      college: body.college,
      content: body.content ?? {},
      updated_by: session!.user?.email,
    });

    await logAudit("department", "created", session!.user?.email ?? "", `Created department ${body.slug}`);
    return json(doc, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
