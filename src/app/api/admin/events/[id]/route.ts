import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/lib/models";
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
import { EventUpdateSchema } from "@/lib/validation";
import { revalidatePaths } from "@/lib/revalidate";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";

// Events render in the "Life at JCT" grid on the home page and all three
// institution landing pages, in the /events listing, and on their own detail
// page. An event's institution can change, so refresh every landing page.
// Pass both slugs when a rename changes the URL.
function revalidateEventPages(...slugs: (string | undefined)[]) {
  const paths = new Set([
    "/",
    "/events",
    "/institutions/engineering",
    "/institutions/engineering/events",
    "/institutions/arts-science",
    "/institutions/arts-science/events",
    "/institutions/polytechnic",
    "/institutions/polytechnic/events",
  ]);
  for (const slug of slugs) if (slug) paths.add(`/events/${slug}`);
  revalidatePaths(...paths);
}

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
    const doc = await Event.findById(id);
    if (!doc) return notFound();
    // Events are college-scoped — an editor may only read their own college's.
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

  const parsed = await validateBody(req, EventUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;
    const badId = invalidId(id);
    if (badId) return badId;

    // Load existing doc up-front to enforce institution scope and reuse the
    // image key / old slug for cleanup and revalidation in a single query.
    const existing = await Event.findById(id)
      .select("institution image gallery slug")
      .lean<{
        institution?: string;
        image?: string;
        gallery?: string[];
        slug?: string;
      } | null>();
    if (!existing) return notFound();

    const scope = enforceInstitutionScope(session, existing.institution);
    if (scope) return scope;
    if (body.institution !== undefined) {
      const scopeNext = enforceInstitutionScope(session, body.institution);
      if (scopeNext) return scopeNext;
    }

    const oldImage = body.image !== undefined ? (existing.image ?? "") : "";

    const updateFields: Record<string, unknown> = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    if (typeof updateFields.event_date === "string") {
      updateFields.event_date = new Date(updateFields.event_date);
    }
    const doc = await Event.findByIdAndUpdate(
      id,
      { $set: { ...updateFields, updated_by: session!.user?.email } },
      { returnDocument: "after" },
    );
    if (!doc) return notFound();

    // Drop the blobs for anything this edit replaced: the old cover, plus any
    // gallery photo the editor removed from the list.
    const orphaned: string[] = [];
    if (oldImage && oldImage !== body.image) orphaned.push(oldImage);
    if (body.gallery !== undefined) {
      const kept = new Set(body.gallery);
      for (const key of existing.gallery ?? []) {
        if (key && !kept.has(key)) orphaned.push(key);
      }
    }
    if (orphaned.length > 0) {
      cleanupStorageKeys(orphaned, "events/patch");
    }

    revalidateEventPages(existing.slug, doc.slug);
    await logAudit(
      "event",
      "updated",
      session!.user?.email ?? "",
      `Updated event "${doc.title}"`,
    );
    return json(doc);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      return badRequest("An event with this slug already exists");
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

    const existing = await Event.findById(id)
      .select("institution")
      .lean<{ institution?: string } | null>();
    if (!existing) return notFound();
    const scope = enforceInstitutionScope(session, existing.institution);
    if (scope) return scope;

    const doc = await Event.findByIdAndDelete(id);
    if (!doc) return notFound();

    const keys = [doc.image, ...(doc.gallery ?? [])].filter(
      (key: string): key is string => !!key,
    );
    if (keys.length > 0) {
      cleanupStorageKeys(keys, "events/delete");
    }

    revalidateEventPages(doc.slug);
    await logAudit(
      "event",
      "deleted",
      session!.user?.email ?? "",
      `Deleted event "${doc.title}"`,
    );
    return json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
