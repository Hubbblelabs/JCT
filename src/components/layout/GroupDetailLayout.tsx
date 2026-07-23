"use client";

import { useState, type ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Image as ImageIcon,
  ListChecks,
  Mail,
  UserRound,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getImageUrl } from "@/lib/utils";
import { GROUPS_VARIANT_META, type GroupsVariant } from "@/lib/groups-meta";
import type { GroupValue } from "@/lib/validation";

/** Published contacts are phone numbers or emails — link them accordingly. */
function contactHref(contact: string): string {
  const v = contact.trim();
  if (v.includes("@")) return `mailto:${v}`;
  return `tel:${v.replace(/[^\d+]/g, "")}`;
}

// Column counts for the gallery grid, keyed by photo count.
const GALLERY_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
};

type TabKey = "overview" | "members" | "activities" | "gallery";

/**
 * Detail page for one club/cell/committee. Rendered by
 * `<basePath>/[slug]/page.tsx` for both variants.
 *
 * The fixed sidebar + section switcher mirrors the program detail page
 * (see TabsProgramLayout) — one nav on the left, one panel visible at a
 * time on the right — rather than a single long scroll.
 */
export function GroupDetailLayout({
  group,
  variant,
}: {
  group: GroupValue;
  variant: GroupsVariant;
}) {
  const meta = GROUPS_VARIANT_META[variant];
  const img = getImageUrl(group.image) || "";
  const gallery = (group.gallery ?? [])
    .map((g) => getImageUrl(g) || "")
    .filter(Boolean);
  const galleryCols = GALLERY_COLS[gallery.length] ?? "grid-cols-2 sm:grid-cols-3";
  const members = group.members.filter((m) => m.name.trim() !== "");
  const activities = group.activities.filter((a) => a.trim() !== "");
  // Columns are dropped entirely when no member fills them, so a roster with
  // only names and phone numbers doesn't render two dead columns.
  const showDept = members.some((m) => m.dept.trim() !== "");
  const showContact = members.some((m) => m.contact.trim() !== "");

  const tabs: { key: TabKey; label: string; icon: ElementType }[] = [
    { key: "overview", label: "Overview", icon: BookOpen },
  ];
  if (members.length > 0) {
    tabs.push({ key: "members", label: meta.membersLabel, icon: Users });
  }
  if (activities.length > 0) {
    tabs.push({
      key: "activities",
      label: meta.activitiesLabel,
      icon: ListChecks,
    });
  }
  if (gallery.length > 0) {
    tabs.push({ key: "gallery", label: "Gallery", icon: ImageIcon });
  }

  const [active, setActive] = useState<TabKey>("overview");
  const showNav = tabs.length > 1;

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />

      <PageHero title={group.name} subtitle={group.category} />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Engineering", href: "/institutions/engineering" },
            { label: meta.breadcrumb, href: meta.basePath },
            { label: group.name },
          ]}
        />

        <Link
          href={meta.basePath}
          className="text-muted-foreground hover:text-gold mt-8 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          All {meta.breadcrumb}
        </Link>

        <div
          className={`mt-6 grid grid-cols-1 gap-8 ${showNav ? "md:grid-cols-[16rem_minmax(0,1fr)]" : ""}`}
        >
          {showNav && (
            <aside className="md:sticky md:top-24 md:self-start">
              <nav className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                {tabs.map((tab) => {
                  const isActive = tab.key === active;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActive(tab.key)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full items-center gap-3 border-b border-white/5 px-4 py-3 text-left text-sm font-medium transition-colors last:border-b-0 ${
                        isActive
                          ? "bg-gold/10 text-gold"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      <Icon size={16} className="shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </aside>
          )}

          <div className="min-w-0">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active === "overview" && (
                <div>
                  {(img || group.description) && (
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                      {img && (
                        <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                          <Image
                            src={img}
                            alt={group.name}
                            fill
                            sizes="160px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      {group.description && (
                        <p className="text-muted-foreground text-base leading-relaxed md:text-lg">
                          {group.description}
                        </p>
                      )}
                    </div>
                  )}

                  {(group.convenor || group.email) && (
                    <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
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
                          <Mail size={15} />
                          {group.email}
                        </a>
                      )}
                    </div>
                  )}

                  {!img &&
                    !group.description &&
                    !group.convenor &&
                    !group.email && (
                      <p className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-12 text-center text-sm">
                        Details for this {meta.singular.toLowerCase()} will be
                        published soon.
                      </p>
                    )}
                </div>
              )}

              {active === "members" && (
                <section>
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

              {active === "activities" && (
                <section>
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

              {active === "gallery" && (
                <section>
                  <div className={`grid gap-4 ${galleryCols}`}>
                    {gallery.map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                      >
                        <Image
                          src={src}
                          alt={`${group.name} — photo ${i + 1}`}
                          fill
                          sizes="(min-width: 768px) 33vw, 50vw"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
