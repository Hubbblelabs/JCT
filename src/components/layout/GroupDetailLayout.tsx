import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Mail, UserRound } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getImageUrl } from "@/lib/utils";
import {
  GROUPS_INSTITUTION_LABELS,
  GROUPS_VARIANT_META,
  groupsBasePath,
  type GroupsInstitution,
  type GroupsVariant,
} from "@/lib/groups-meta";
import type { GroupValue } from "@/lib/validation";

/** Published contacts are phone numbers or emails — link them accordingly. */
function contactHref(contact: string): string {
  const v = contact.trim();
  if (v.includes("@")) return `mailto:${v}`;
  return `tel:${v.replace(/[^\d+]/g, "")}`;
}

// Column counts for the sidebar gallery grid — a lone photo reads as a
// banner, two+ read better as uniform tiles.
const GALLERY_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2",
};

/**
 * Detail page for one club/cell/committee. Rendered by
 * `<basePath>/[slug]/page.tsx` for both variants. Photo, convenor contact,
 * and the event gallery live in a sticky sidebar; the description, roster,
 * and activities are the main column.
 */
export function GroupDetailLayout({
  group,
  variant,
  institution = "engineering",
}: {
  group: GroupValue;
  variant: GroupsVariant;
  /** Which college's list this detail page belongs to. */
  institution?: GroupsInstitution;
}) {
  const meta = GROUPS_VARIANT_META[variant];
  const basePath = groupsBasePath(variant, institution);
  const img = getImageUrl(group.image) || "";
  const gallery = (group.gallery ?? [])
    .map((g) => getImageUrl(g) || "")
    .filter(Boolean);
  const galleryCols = GALLERY_COLS[gallery.length] ?? "grid-cols-2";
  const members = group.members.filter((m) => m.name.trim() !== "");
  const activities = group.activities.filter((a) => a.trim() !== "");
  // Columns are dropped entirely when no member fills them, so a roster with
  // only names and phone numbers doesn't render two dead columns.
  const showDept = members.some((m) => m.dept.trim() !== "");
  const showContact = members.some((m) => m.contact.trim() !== "");
  const hasSidebarInfo = img || group.convenor || group.email;

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />

      <PageHero title={group.name} subtitle={group.category} />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            {
              label: GROUPS_INSTITUTION_LABELS[institution],
              href: `/institutions/${institution}`,
            },
            { label: meta.breadcrumb, href: basePath },
            { label: group.name },
          ]}
        />

        <Link
          href={basePath}
          className="text-muted-foreground hover:text-gold mt-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          All {meta.breadcrumb}
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div className="min-w-0">
            {group.description && (
              <p className="text-muted-foreground text-justify text-base leading-relaxed md:text-lg">
                {group.description}
              </p>
            )}

            {members.length > 0 && (
              <section className="mt-12">
                <h2 className="text-foreground mb-5 font-serif text-xl font-bold md:text-2xl">
                  {meta.membersLabel}
                </h2>

                {/* Desktop: a real table. A 4-column roster is tabular data and
                    reads far better than stacked key/value pairs. */}
                <div className="hidden overflow-x-auto rounded-2xl border border-white/10 sm:block">
                  <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="text-muted-foreground w-12 px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
                          #
                        </th>
                        <th className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
                          Name
                        </th>
                        <th className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
                          Designation
                        </th>
                        {showDept && (
                          <th className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
                            Department / Affiliation
                          </th>
                        )}
                        {showContact && (
                          <th className="text-muted-foreground px-4 py-3 text-[11px] font-bold tracking-wider uppercase">
                            Contact
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {members.map((m, i) => (
                        <tr
                          key={i}
                          className="transition-colors hover:bg-white/5"
                        >
                          <td className="text-muted-foreground px-4 py-3 text-xs">
                            {i + 1}
                          </td>
                          <td className="text-foreground px-4 py-3 font-medium">
                            {m.name}
                          </td>
                          <td className="text-muted-foreground px-4 py-3">
                            {m.role}
                          </td>
                          {showDept && (
                            <td className="text-muted-foreground px-4 py-3">
                              {m.dept}
                            </td>
                          )}
                          {showContact && (
                            <td className="px-4 py-3">
                              {m.contact && (
                                <a
                                  href={contactHref(m.contact)}
                                  className="text-gold font-medium hover:underline"
                                >
                                  {m.contact}
                                </a>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile: one card per member — a 5-column table can't shrink. */}
                <ul className="space-y-3 sm:hidden">
                  {members.map((m, i) => (
                    <li
                      key={i}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <p className="text-foreground font-bold">{m.name}</p>
                      {m.role && (
                        <p className="text-gold mt-0.5 text-xs font-semibold">
                          {m.role}
                        </p>
                      )}
                      {m.dept && (
                        <p className="text-muted-foreground mt-1 text-xs">
                          {m.dept}
                        </p>
                      )}
                      {m.contact && (
                        <a
                          href={contactHref(m.contact)}
                          className="text-gold mt-2 inline-block text-xs font-bold hover:underline"
                        >
                          {m.contact}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {activities.length > 0 && (
              <section className="mt-12">
                <h2 className="text-foreground mb-5 font-serif text-xl font-bold md:text-2xl">
                  {meta.activitiesLabel}
                </h2>
                <ul className="space-y-3">
                  {activities.map((a, i) => (
                    <li
                      key={i}
                      className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed md:text-base"
                    >
                      <CheckCircle
                        size={15}
                        className="text-gold mt-1 shrink-0"
                      />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {members.length === 0 && activities.length === 0 && (
              <p className="text-muted-foreground/60 mt-10 rounded-2xl border border-dashed border-white/15 py-12 text-center text-sm">
                Details for this {meta.singular.toLowerCase()} will be published
                soon.
              </p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-12rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
            {hasSidebarInfo && (
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                {img && (
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={img}
                      alt={group.name}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  </div>
                )}
                {(group.convenor || group.email) && (
                  <div className="space-y-4 p-5">
                    {group.convenor && (
                      <div className="flex items-center gap-3">
                        <span className="bg-gold/15 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                          <UserRound size={18} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-foreground text-sm font-bold">
                            {group.convenor}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {group.convenorRole || meta.convenorFallback}
                          </p>
                        </div>
                      </div>
                    )}
                    {group.email && (
                      <a
                        href={`mailto:${group.email}`}
                        className="text-gold flex items-center gap-1.5 text-sm font-bold hover:underline"
                      >
                        <Mail size={15} className="shrink-0" />
                        <span className="truncate">{group.email}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {gallery.length > 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-foreground mb-4 font-serif text-base font-bold">
                  Gallery
                </h2>
                <div className={`grid gap-2 ${galleryCols}`}>
                  {gallery.map((src, i) => (
                    <div
                      key={`${src}-${i}`}
                      className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-white/5"
                    >
                      <Image
                        src={src}
                        alt={`${group.name} — photo ${i + 1}`}
                        fill
                        sizes="150px"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
