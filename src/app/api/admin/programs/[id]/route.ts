import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import {
  requireRole,
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
import { extractR2Keys, deleteFromR2 } from "@/lib/r2";

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
  const { error } = await requireRole(req, "viewer");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await Program.findById(id);
    if (!doc) return notFound();
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

    const oldImageKey =
      body.image !== undefined
        ? ((await Program.findById(id).select("image").lean())?.image ?? "")
        : "";

    const doc = await Program.findByIdAndUpdate(
      id,
      { $set: { ...body, updated_by: session!.user?.email } },
      { new: true },
    );
    if (!doc) return notFound();

    if (
      oldImageKey &&
      oldImageKey !== body.image &&
      oldImageKey.startsWith("images/")
    ) {
      deleteFromR2(oldImageKey).catch((err) =>
        console.warn(
          `[programs/patch] R2 cleanup failed for "${oldImageKey}":`,
          err,
        ),
      );
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
    for (const key of r2Keys) {
      deleteFromR2(key).catch((err) =>
        console.warn(`[programs/delete] R2 cleanup failed for "${key}":`, err),
      );
    }

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
