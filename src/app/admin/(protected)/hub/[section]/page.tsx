import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { AdminHub } from "@/components/admin/AdminHub";
import {
  canViewSection,
  getAdminSection,
  hubHref,
  visibleSections,
} from "@/lib/admin-nav";

export const dynamic = "force-dynamic";

export default async function AdminHubPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section: sectionId } = await params;
  const section = getAdminSection(sectionId);
  if (!section) notFound();

  const session = await auth();
  const user = (session?.user ?? {}) as Record<string, unknown>;
  const role = (user.role as string) ?? "editor";
  const institution = (user.institution as string) ?? "";

  // Editors are institution-scoped: send them to the first hub they can open
  // rather than showing an empty page. Resolving the target from the visible
  // list (instead of trusting `institution` verbatim) keeps a stale or unknown
  // institution value from bouncing between two forbidden hubs.
  if (!canViewSection(section, role, institution)) {
    const fallback = visibleSections(role, institution)[0];
    redirect(fallback ? hubHref(fallback.id) : "/admin/programs");
  }

  return (
    <AdminHub sectionId={section.id} role={role} institution={institution} />
  );
}
