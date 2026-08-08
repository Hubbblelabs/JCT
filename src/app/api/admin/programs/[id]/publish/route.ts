import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import {
  requireRole,
  json,
  notFound,
  serverError,
  invalidId,
} from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidatePaths } from "@/lib/revalidate";
import { extractStorageKeys } from "@/lib/storage";
import { cleanupStorageKeys } from "@/lib/asset-cleanup";

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
    const current = await Program.findById(id);
    if (!current) return notFound("Program not found");

    // Assets the outgoing published snapshot held. Publishing overwrites it,
    // so anything the new draft doesn't carry is orphaned from here on.
    const oldPublishedKeys = extractStorageKeys(current.published_content);

    const doc = await Program.findByIdAndUpdate(
      id,
      {
        status: "published",
        published_content: current.content,
        published_at: new Date(),
        $inc: { version: 1 },
        updated_by: session!.user?.email,
      },
      { returnDocument: "after" },
    );
    if (!doc) return notFound("Program not found");

    if (oldPublishedKeys.size > 0) {
      const kept = extractStorageKeys({
        image: doc.image,
        content: doc.content,
        published_content: doc.published_content,
      });
      const orphaned = [...oldPublishedKeys].filter((k) => !kept.has(k));
      if (orphaned.length > 0) cleanupStorageKeys(orphaned, "programs/publish");
    }

    revalidatePaths(
      `/institutions/${doc.institution}`,
      // The listing page is /courses — `/programs` has no page.tsx, so
      // revalidating it was a silent no-op.
      `/institutions/${doc.institution}/courses`,
      `/institutions/${doc.institution}/programs/${doc.slug}`,
    );

    await logAudit(
      "program",
      "published",
      session!.user?.email ?? "",
      `Published program ${doc.slug}`,
    );
    return json({ message: "Published", doc });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
