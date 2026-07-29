import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Page } from "@/lib/models";
import {
  requireRole,
  enforceInstitutionScope,
  json,
  notFound,
  serverError,
  validateBody,
  badRequest,
  invalidId,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { PageUpdateSchema } from "@/lib/validation";
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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const badId = invalidId(id);
    if (badId) return badId;
    const doc = await Page.findById(id);
    if (!doc) return notFound();
    // Reads expose draft content — keep them institution-scoped like writes.
    const scope = enforceInstitutionScope(session, doc.institution);
    if (scope) return scope;
    return json(doc);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, PageUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;
    const badId = invalidId(id);
    if (badId) return badId;

    const current = await Page.findById(id).lean();
    if (!current) return notFound();

    // Editors may only mutate pages within their own institution, and may
    // not move a page into an institution they can't access.
    const scope = enforceInstitutionScope(session, current.institution);
    if (scope) return scope;
    if (body.institution !== undefined) {
      const scopeNext = enforceInstitutionScope(session, body.institution);
      if (scopeNext) return scopeNext;
    }

    // Guard slug uniqueness within institution if slug or institution changes.
    if (body.slug !== undefined || body.institution !== undefined) {
      const nextSlug = body.slug ?? current.slug;
      const nextInst = body.institution ?? current.institution;
      const collision = await Page.findOne({
        _id: { $ne: id },
        slug: nextSlug,
        institution: nextInst,
      }).lean();
      if (collision) {
        return badRequest(
          `A page with slug "${nextSlug}" already exists in ${nextInst}`,
        );
      }
    }

    const doc = await Page.findByIdAndUpdate(
      id,
      { $set: { ...body, updated_by: session!.user?.email } },
      { returnDocument: "after" },
    );
    if (!doc) return notFound();

    const target = institutionTarget(doc.institution);
    if (target) {
      revalidateTargets(target);
      revalidatePaths(publicPathFor(doc.institution, doc.slug));
    }
    await logAudit(
      "page",
      "updated",
      session!.user?.email ?? "",
      `Updated page ${doc.title}`,
    );
    return json(doc);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function DELETE(
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
    const doc = await Page.findByIdAndDelete(id);
    if (!doc) return notFound();

    const r2Keys = extractR2Keys({
      content: doc.content,
      published_content: doc.published_content,
    });
    cleanupStorageKeys(r2Keys, "pages/delete");

    const target = institutionTarget(doc.institution);
    if (target) {
      revalidateTargets(target);
      revalidatePaths(publicPathFor(doc.institution, doc.slug));
    }
    await logAudit(
      "page",
      "deleted",
      session!.user?.email ?? "",
      `Deleted page ${doc.title}`,
    );
    return json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
