import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models";
import {
  requireRole,
  enforceInstitutionScope,
  institutionReadFilter,
  badRequest,
  json,
  serverError,
  validateBody,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { BlogCreateSchema } from "@/lib/validation";
import { revalidatePaths } from "@/lib/revalidate";

// Blogs publish to one institution-agnostic listing plus their own detail
// page, so — unlike events — no college landing page has to be refreshed.
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

export async function GET(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const institution = searchParams.get("institution");
    const filter: Record<string, unknown> = {};
    if (institution) filter.institution = institution;

    const docs = await Blog.find({
      ...filter,
      // Editors see their own college's posts plus the shared "all" pool
      // (read-only for them — writes stay institution-scoped).
      ...institutionReadFilter(session, { includeShared: true }),
    }).sort({ published_at: -1, sort_order: 1 });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, BlogCreateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  const scope = enforceInstitutionScope(session, body.institution);
  if (scope) return scope;

  try {
    await connectDB();
    const doc = await Blog.create({
      ...body,
      published_at: new Date(body.published_at),
      updated_by: session!.user?.email,
    });
    revalidateBlogPages(doc.slug);
    await logAudit(
      "blog",
      "created",
      session!.user?.email ?? "",
      `Created blog "${body.title}"`,
    );
    return json(doc, 201);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      return badRequest("A blog with this slug already exists");
    }
    console.error(e);
    return serverError();
  }
}
