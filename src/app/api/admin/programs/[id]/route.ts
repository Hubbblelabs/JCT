import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import {
  requireRole,
  enforceInstitutionScope,
  json,
  notFound,
  serverError,
  validateBody,
  invalidId,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { ProgramFullUpdateSchema } from "@/lib/validation";
import {
  revalidateTargets,
  revalidatePaths,
  type RevalidateTarget,
} from "@/lib/revalidate";
import { extractStorageKeys } from "@/lib/storage";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";

function institutionTarget(inst: string): RevalidateTarget | null {
  if (
    inst === "engineering" ||
    inst === "arts-science" ||
    inst === "polytechnic"
  )
    return inst;
  return null;
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
    const doc = await Program.findById(id);
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

  const parsed = await validateBody(req, ProgramFullUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;
    const badId = invalidId(id);
    if (badId) return badId;

    // Load the existing doc up-front so we can both enforce institution
    // scope and reuse its asset keys for orphan cleanup (one query).
    // `content` is included because the program builder writes hero/HOD/faculty
    // imagery there and PATCH replaces the whole blob — cleaning only the
    // card-level `image` orphaned every asset inside it.
    const existing = await Program.findById(id)
      .select("institution image content published_content")
      .lean<{
        institution?: string;
        image?: string;
        content?: unknown;
        published_content?: unknown;
      } | null>();
    if (!existing) return notFound();

    const scope = enforceInstitutionScope(session, existing.institution);
    if (scope) return scope;
    // Block moving a program into an institution the editor can't access.
    if (body.institution !== undefined) {
      const scopeNext = enforceInstitutionScope(session, body.institution);
      if (scopeNext) return scopeNext;
    }

    // Everything the document referenced before the write. Diffed against the
    // saved document below, so a replaced hero image, a swapped HOD photo or a
    // deleted custom tab block full of images all get reclaimed — not just the
    // card-level `image` field.
    const oldKeys = new Set<string>();
    if (body.image !== undefined && existing.image) {
      extractStorageKeys(existing.image, oldKeys);
    }
    if (body.content !== undefined) {
      extractStorageKeys(existing.content, oldKeys);
    }

    const doc = await Program.findByIdAndUpdate(
      id,
      { $set: { ...body, updated_by: session!.user?.email } },
      { returnDocument: "after" },
    );
    if (!doc) return notFound();

    if (oldKeys.size > 0) {
      // published_content is included on the keep side: a draft edit must not
      // delete an asset the live page is still serving.
      const kept = extractStorageKeys({
        image: doc.image,
        content: doc.content,
        published_content: doc.published_content,
      });
      const orphaned = [...oldKeys].filter((k) => !kept.has(k));
      if (orphaned.length > 0) cleanupStorageKeys(orphaned, "programs/patch");
    }

    const target = institutionTarget(doc.institution);
    if (target) {
      revalidateTargets(target);
      revalidatePaths(`/institutions/${doc.institution}/programs/${doc.slug}`);
    }
    await logAudit(
      "program",
      "updated",
      session!.user?.email ?? "",
      `Updated program ${doc.name}`,
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
    const doc = await Program.findByIdAndDelete(id);
    if (!doc) return notFound();

    const storageKeys = extractStorageKeys({
      image: doc.image,
      content: doc.content,
      published_content: doc.published_content,
    });
    cleanupStorageKeys(storageKeys, "programs/delete");

    const target = institutionTarget(doc.institution);
    if (target) {
      revalidateTargets(target);
      revalidatePaths(`/institutions/${doc.institution}/programs/${doc.slug}`);
    }
    await logAudit(
      "program",
      "deleted",
      session!.user?.email ?? "",
      `Deleted program ${doc.name}`,
    );
    return json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
