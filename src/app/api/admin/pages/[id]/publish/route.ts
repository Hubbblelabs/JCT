import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Page } from "@/lib/models";
import {
  requireRole,
  json,
  notFound,
  serverError,
  invalidId,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import {
  revalidateTargets,
  revalidatePaths,
  type RevalidateTarget,
} from "@/lib/revalidate";
import { extractR2Keys } from "@/lib/r2";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";

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
    const badId = invalidId(id);
    if (badId) return badId;
    const doc = await Page.findById(id);
    if (!doc) return notFound();

    // Assets held only by the outgoing published snapshot are orphaned once it
    // is overwritten below.
    const oldPublishedKeys = extractR2Keys(doc.published_content);

    doc.published_content = doc.content;
    doc.status = "published";
    doc.version = (doc.version ?? 1) + 1;
    doc.published_at = new Date();
    doc.updated_by = session!.user?.email ?? doc.updated_by;
    await doc.save();

    if (oldPublishedKeys.size > 0) {
      const kept = extractR2Keys({
        content: doc.content,
        published_content: doc.published_content,
      });
      const orphaned = [...oldPublishedKeys].filter((k) => !kept.has(k));
      if (orphaned.length > 0) cleanupStorageKeys(orphaned, "pages/publish");
    }

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
