import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Page } from "@/lib/models";
import {
  requireRole,
  json,
  badRequest,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { PageCreateSchema } from "@/lib/validation";
import { revalidateTargets, type RevalidateTarget } from "@/lib/revalidate";

function institutionTarget(inst: string): RevalidateTarget | null {
  if (inst === "main") return "home";
  if (
    inst === "engineering" ||
    inst === "arts-science" ||
    inst === "polytechnic"
  )
    return inst;
  return null;
}

export async function GET(req: NextRequest) {
  const { error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const institution = searchParams.get("institution");
    const status = searchParams.get("status");
    const filter: Record<string, unknown> = {};
    if (institution) filter.institution = institution;
    if (status) filter.status = status;

    const docs = await Page.find(filter).sort({
      institution: 1,
      updated_at: -1,
    });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, PageCreateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const existing = await Page.findOne({
      institution: body.institution,
      slug: body.slug,
    });
    if (existing) {
      return badRequest(
        `A page with slug "${body.slug}" already exists in ${body.institution}`,
      );
    }

    const doc = await Page.create({
      slug: body.slug,
      institution: body.institution,
      title: body.title,
      template: body.template,
      status: "draft",
      content: {},
      updated_by: session!.user?.email ?? undefined,
    });
    const target = institutionTarget(body.institution);
    if (target) revalidateTargets(target);
    await logAudit(
      "page",
      "created",
      session!.user?.email ?? "",
      `Created page ${body.title} (${body.institution}/${body.slug})`,
    );
    return json(doc, 201);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
