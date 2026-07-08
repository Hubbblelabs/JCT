import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/lib/models";
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
import { EventCreateSchema } from "@/lib/validation";
import { revalidatePaths } from "@/lib/revalidate";

// Events render in the "Life at JCT" grid on the home page and all three
// institution landing pages, in the /events listing, and on their own detail
// page. An event's institution can change, so refresh every landing page.
function revalidateEventPages(slug?: string) {
  const paths = [
    "/",
    "/events",
    "/institutions/engineering",
    "/institutions/arts-science",
    "/institutions/polytechnic",
  ];
  if (slug) paths.push(`/events/${slug}`);
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

    const docs = await Event.find({
      ...filter,
      // Editors see their own college's events plus the shared "all" pool
      // (read-only for them — writes stay institution-scoped).
      ...institutionReadFilter(session, { includeShared: true }),
    }).sort({ event_date: -1, sort_order: 1 });
    return json(docs);
  } catch (e) {
    console.error(e);
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  const parsed = await validateBody(req, EventCreateSchema);
  if (!parsed.ok) return parsed.response;
  const body = parsed.data;

  const scope = enforceInstitutionScope(session, body.institution);
  if (scope) return scope;

  try {
    await connectDB();
    const doc = await Event.create({
      ...body,
      event_date: new Date(body.event_date),
      updated_by: session!.user?.email,
    });
    revalidateEventPages(doc.slug);
    await logAudit(
      "event",
      "created",
      session!.user?.email ?? "",
      `Created event "${body.title}"`,
    );
    return json(doc, 201);
  } catch (e) {
    if (isDuplicateKeyError(e)) {
      return badRequest("An event with this slug already exists");
    }
    console.error(e);
    return serverError();
  }
}
