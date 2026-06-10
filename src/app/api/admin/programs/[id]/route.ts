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
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { ProgramFullUpdateSchema } from "@/lib/validation";
import {
  revalidateTargets,
  revalidatePaths,
  type RevalidateTarget,
} from "@/lib/revalidate";
import { extractR2Keys } from "@/lib/r2";
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

    // Load the existing doc up-front so we can both enforce institution
    // scope and reuse its image key for orphan cleanup (one query).
    const existing = await Program.findById(id)
      .select("institution image")
      .lean<{ institution?: string; image?: string } | null>();
    if (!existing) return notFound();

    const scope = enforceInstitutionScope(session, existing.institution);
    if (scope) return scope;
    // Block moving a program into an institution the editor can't access.
    if (body.institution !== undefined) {
      const scopeNext = enforceInstitutionScope(session, body.institution);
      if (scopeNext) return scopeNext;
    }

    const oldImageKey = body.image !== undefined ? (existing.image ?? "") : "";

    const doc = await Program.findByIdAndUpdate(
      id,
      { $set: { ...body, updated_by: session!.user?.email } },
      { new: true },
    );
    if (!doc) return notFound();

    if (oldImageKey && oldImageKey !== body.image) {
      cleanupStorageKeys([oldImageKey], "programs/patch");
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
    const doc = await Program.findByIdAndDelete(id);
    if (!doc) return notFound();

    const r2Keys = extractR2Keys({
      image: doc.image,
      content: doc.content,
      published_content: doc.published_content,
    });
    cleanupStorageKeys(r2Keys, "programs/delete");

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
