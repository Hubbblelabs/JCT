import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Placement } from "@/lib/models";
import {
  requireRole,
  enforceInstitutionScope,
  badRequest,
  json,
  notFound,
  serverError,
  validateBody,
  invalidId,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { PlacementUpdateSchema } from "@/lib/validation";
import { revalidateTargets, type RevalidateTarget } from "@/lib/revalidate";
import { extractStorageKeys } from "@/lib/storage";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";

function isDuplicateKeyError(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    (e as { code?: number }).code === 11000
  );
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
    const doc = await Placement.findById(id);
    if (!doc) return notFound();
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

  const parsed = await validateBody(req, PlacementUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;
    const badId = invalidId(id);
    if (badId) return badId;

    const existing = await Placement.findById(id).lean<{
      institution?: string;
      top_recruiters?: unknown;
      notable_placements?: unknown;
      company_placements?: unknown;
    } | null>();
    if (!existing) return notFound();

    const scope = enforceInstitutionScope(session, existing.institution);
    if (scope) return scope;
    if (body.institution !== undefined) {
      const scopeNext = enforceInstitutionScope(session, body.institution);
      if (scopeNext) return scopeNext;
    }

    // Collect storage keys that are being replaced so we can clean up the
    // orphaned stored objects + ImageAsset rows after the update succeeds.
    const oldKeys = new Set<string>();
    if (body.top_recruiters !== undefined)
      extractStorageKeys(existing.top_recruiters, oldKeys);
    if (body.notable_placements !== undefined)
      extractStorageKeys(existing.notable_placements, oldKeys);
    if (body.company_placements !== undefined)
      extractStorageKeys(existing.company_placements, oldKeys);

    const updateFields: Record<string, unknown> = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );

    const doc = await Placement.findByIdAndUpdate(
      id,
      { $set: { ...updateFields, updated_by: session!.user?.email } },
      { returnDocument: "after" },
    );
    if (!doc) return notFound();

    // Keys still referenced after the update must be kept.
    if (oldKeys.size > 0) {
      const stillUsed = new Set<string>();
      extractStorageKeys(doc.top_recruiters, stillUsed);
      extractStorageKeys(doc.notable_placements, stillUsed);
      extractStorageKeys(doc.company_placements, stillUsed);
      const removed = [...oldKeys].filter((k) => !stillUsed.has(k));
      if (removed.length > 0) cleanupStorageKeys(removed, "placements/patch");
    }

    revalidateTargets(doc.institution as RevalidateTarget);
    await logAudit(
      "placement",
      "updated",
      session!.user?.email ?? "",
      `Updated ${doc.institution} placement record for ${doc.year}`,
    );
    return json(doc);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      return badRequest(
        "A placement record for this college and year already exists",
      );
    }
    console.error(e);
    return serverError();
  }
}

export async function DELETE(
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

    const existing = await Placement.findById(id)
      .select("institution")
      .lean<{ institution?: string } | null>();
    if (!existing) return notFound();
    const scope = enforceInstitutionScope(session, existing.institution);
    if (scope) return scope;

    const doc = await Placement.findByIdAndDelete(id);
    if (!doc) return notFound();

    const keys = new Set<string>();
    extractStorageKeys(doc.top_recruiters, keys);
    extractStorageKeys(doc.notable_placements, keys);
    extractStorageKeys(doc.company_placements, keys);
    if (keys.size > 0) cleanupStorageKeys(keys, "placements/delete");

    revalidateTargets(doc.institution as RevalidateTarget);
    await logAudit(
      "placement",
      "deleted",
      session!.user?.email ?? "",
      `Deleted ${doc.institution} placement record for ${doc.year}`,
    );
    return json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
