import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recruiter } from "@/lib/models";
import {
  requireRole,
  json,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { RecruiterCreateSchema } from "@/lib/validation";
import { revalidateTargets } from "@/lib/revalidate";

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const docs = await Recruiter.find().sort({ sort_order: 1, name: 1 });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, RecruiterCreateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const doc = await Recruiter.create({
      ...body,
      updated_by: session!.user?.email,
    });
    revalidateTargets("home");
    await logAudit(
      "recruiter",
      "created",
      session!.user?.email ?? "",
      `Created recruiter ${body.name}`,
    );
    return json(doc, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
