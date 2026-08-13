import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models";
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
import { BlogUpdateSchema } from "@/lib/validation";
import { revalidatePaths } from "@/lib/revalidate";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";

// Blogs publish to one institution-agnostic listing plus their own detail
// page. Pass both slugs when a rename changes the URL.
function revalidateBlogPages(...slugs: (string | undefined)[]) {
  const paths = new Set(["/blogs"]);
  for (const slug of slugs) if (slug) paths.add(`/blogs/${slug}`);
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
    const doc = await Blog.findById(id);
    if (!doc) return notFound();
    // Blogs are college-scoped — an editor may only read their own college's.
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

  const parsed = await validateBody(req, BlogUpdateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  try {
    await connectDB();
    const { id } = await params;
    const badId = invalidId(id);
    if (badId) return badId;

    // Load existing doc up-front to enforce institution scope and reuse the
    // image key / old slug for cleanup and revalidation in a single query.
    const existing = await Blog.findById(id)
      .select("institution image slug")
      .lean<{
        institution?: string;
        image?: string;
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
    if (typeof updateFields.published_at === "string") {
      updateFields.published_at = new Date(updateFields.published_at);
    }
    const doc = await Blog.findByIdAndUpdate(
      id,
      { $set: { ...updateFields, updated_by: session!.user?.email } },
      { returnDocument: "after" },
    );
    if (!doc) return notFound();

    // Drop the blob for a cover this edit replaced.
    if (oldImage && oldImage !== body.image) {
      cleanupStorageKeys([oldImage], "blogs/patch");
    }

    revalidateBlogPages(existing.slug, doc.slug);
    await logAudit(
      "blog",
      "updated",
      session!.user?.email ?? "",
      `Updated blog "${doc.title}"`,
    );
    return json(doc);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      return badRequest("A blog with this slug already exists");
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

    const existing = await Blog.findById(id)
      .select("institution")
      .lean<{ institution?: string } | null>();
    if (!existing) return notFound();
    const scope = enforceInstitutionScope(session, existing.institution);
    if (scope) return scope;

    const doc = await Blog.findByIdAndDelete(id);
    if (!doc) return notFound();

    if (doc.image) {
      cleanupStorageKeys([doc.image], "blogs/delete");
    }

    revalidateBlogPages(doc.slug);
    await logAudit(
      "blog",
      "deleted",
      session!.user?.email ?? "",
      `Deleted blog "${doc.title}"`,
    );
    return json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
