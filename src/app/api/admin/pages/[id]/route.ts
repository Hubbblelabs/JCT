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
import { extractStorageKeys } from "@/lib/storage";
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

    // Page.content is the Mixed block payload and carries image/document keys.
    // PATCH replaces it wholesale, so without this diff editing a block out of
    // a page leaks its assets — the DELETE handler below already reclaims the
    // exact same field.
    const oldKeys =
      body.content !== undefined
        ? extractStorageKeys(current.content)
        : new Set<string>();

    const doc = await Page.findByIdAndUpdate(
      id,
      { $set: { ...body, updated_by: session!.user?.email } },
      { returnDocument: "after" },
    );
    if (!doc) return notFound();

    if (oldKeys.size > 0) {
      // published_content stays on the keep side: a draft edit must not delete
      // an asset the live page still renders.
      const kept = extractStorageKeys({
        content: doc.content,
        published_content: doc.published_content,
      });
      const orphaned = [...oldKeys].filter((k) => !kept.has(k));
      if (orphaned.length > 0) cleanupStorageKeys(orphaned, "pages/patch");
    }

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

    const storageKeys = extractStorageKeys({
      content: doc.content,
      published_content: doc.published_content,
    });
    cleanupStorageKeys(storageKeys, "pages/delete");

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
