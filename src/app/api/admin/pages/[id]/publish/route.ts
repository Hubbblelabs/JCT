import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Page } from "@/lib/models";
import {
  requireRole,
  json,
  notFound,
  serverError,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import {
  revalidateTargets,
  revalidatePaths,
  type RevalidateTarget,
} from "@/lib/revalidate";

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

function publicPathFor(institution: string, slug: string): string {
  if (institution === "main") return `/p/${slug}`;
  return `/institutions/${institution}/p/${slug}`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await Page.findById(id);
    if (!doc) return notFound();

    doc.published_content = doc.content;
    doc.status = "published";
    doc.version = (doc.version ?? 1) + 1;
    doc.published_at = new Date();
    doc.updated_by = session!.user?.email ?? doc.updated_by;
    await doc.save();

    const target = institutionTarget(doc.institution);
    if (target) {
      revalidateTargets(target);
      revalidatePaths(publicPathFor(doc.institution, doc.slug));
    }
    await logAudit(
      "page",
      "published",
      session!.user?.email ?? "",
      `Published page ${doc.title} v${doc.version}`,
    );
    return json(doc);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
