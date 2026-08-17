import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/admin/kit/PageShell";
import { Banner } from "@/components/admin/kit/primitives";
import { COLLEGE_LABELS, type College } from "@/lib/admin-nav";
import { HelpDoc, type HelpDocItem } from "@/components/admin/help/HelpDoc";
import { visibleChapters } from "@/components/admin/help/help-chapters";

export const metadata = { title: "Help & documentation" };

/**
 * The panel's user manual.
 *
 * Rendered on the server so the whole thing is one static document — the only
 * client-side part is the search box, which filters chapters that are already
 * on the page. Chapters are role-filtered here rather than in the browser: an
 * editor should not be shipped the backup and reset instructions at all.
 */
export default async function HelpPage() {
  const session = await auth();
  // The layout's redirect does not stop this segment from rendering (App Router
  // renders layout and page in parallel), and this page reads the session to
  // decide what to show — so it checks for itself.
  if (!session?.user) redirect("/admin/login");

  const user = session.user as Record<string, unknown>;
  const role = (user.role as string) ?? "editor";
  const institution = (user.institution as string) ?? "all";

  const ctx = { role, institution };

  // Icons are rendered to elements here: a lucide component is a function, and
  // functions cannot be handed to a Client Component.
  const items: HelpDocItem[] = visibleChapters(role).map((c) => ({
    id: c.id,
    title: c.title,
    summary: c.summary,
    keywords: c.keywords,
    icon: <c.icon size={15} />,
    body: c.body(ctx),
  }));

  const collegeLabel =
    COLLEGE_LABELS[institution as College] ?? "every college";

  return (
    <PageShell
      title="Help & documentation"
      description="How this panel works — what each screen changes, how publishing works, and what to do when something looks wrong."
    >
      <div className="mb-5">
        <Banner
          tone="info"
          title={role === "admin" ? "You are an admin" : "You are an editor"}
        >
          {role === "admin" ? (
            <>
              You can edit every college, the main website and the site-wide
              elements, and you alone can manage people, read the audit log and
              take or restore backups.
            </>
          ) : (
            <>
              You can edit <strong>{collegeLabel}</strong> and the dynamic
              pages. Screens belonging to another college, to the site-wide
              settings, or to administration are not shown to you — and this
              manual leaves out the chapters about them.
            </>
          )}
        </Banner>
      </div>

      <HelpDoc items={items} />
    </PageShell>
  );
}
