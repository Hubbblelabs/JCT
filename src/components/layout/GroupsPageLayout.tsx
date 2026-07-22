"use client";

import Image from "next/image";
import { Mail, Sparkles, UserRound, Users, type LucideIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import type { GroupsPageValue, GroupValue } from "@/lib/validation";

/**
 * Shared layout for the two "list of groups with members" pages — Clubs & Cells
 * and Committees. `variant` only changes the copy (breadcrumb, headings, empty
 * states); the data shape and styling are identical.
 */
export type GroupsVariant = "clubs" | "committees";

export type GroupsEditableSection = "hero" | "intro" | "groups";

export const GROUPS_SECTION_LABELS: Record<GroupsEditableSection, string> = {
  hero: "Hero",
  intro: "Introduction",
  groups: "Groups",
};

export const GROUPS_SECTION_ORDER: GroupsEditableSection[] = [
  "hero",
  "intro",
  "groups",
];

export const GROUPS_VARIANT_META: Record<
  GroupsVariant,
  {
    breadcrumb: string;
    defaultHeroTitle: string;
    listHeading: string;
    icon: LucideIcon;
    convenorFallback: string;
    membersLabel: string;
    activitiesLabel: string;
    emptyHint: string;
    publicEmpty: string;
    /** Label used for the "Groups" section in the admin inspector. */
    sectionLabel: string;
  }
> = {
  clubs: {
    breadcrumb: "Clubs & Cells",
    defaultHeroTitle: "Clubs & Cells",
    listHeading: "Student Clubs & Cells",
    icon: Sparkles,
    convenorFallback: "Faculty Coordinator",
    membersLabel: "Office Bearers",
    activitiesLabel: "Activities",
    emptyHint: "Click to add clubs and cells",
    publicEmpty: "Club details will be published soon.",
    sectionLabel: "Clubs & Cells",
  },
  committees: {
    breadcrumb: "Committees",
    defaultHeroTitle: "Committees",
    listHeading: "Institutional Committees",
    icon: Users,
    convenorFallback: "Convenor",
    membersLabel: "Members",
    activitiesLabel: "Responsibilities",
    emptyHint: "Click to add committees",
    publicEmpty: "Committee details will be published soon.",
    sectionLabel: "Committees",
  },
};

/** Published contacts are phone numbers or emails — link them accordingly. */
function contactHref(contact: string): string {
  const v = contact.trim();
  if (v.includes("@")) return `mailto:${v}`;
  return `tel:${v.replace(/[^\d+]/g, "")}`;
}

/**
 * Buckets groups under their `category`, preserving first-appearance order so
 * the admin's ordering drives the page. Groups with no category fall into a
 * single unlabelled bucket, which renders as a plain grid with no subheading.
 */
function groupByCategory(groups: GroupValue[]): [string, GroupValue[]][] {
  const buckets = new Map<string, GroupValue[]>();
  for (const g of groups) {
    const key = g.category.trim();
    const existing = buckets.get(key);
    if (existing) existing.push(g);
    else buckets.set(key, [g]);
  }
  return [...buckets.entries()];
}

function GroupCard({
  group,
  meta,
  editable,
}: {
  group: GroupValue;
  meta: (typeof GROUPS_VARIANT_META)[GroupsVariant];
  editable?: boolean;
}) {
  const img = getImageUrl(group.image) || "";
  const members = group.members.filter((m) => m.name.trim() !== "");
  const activities = group.activities.filter((a) => a.trim() !== "");

  return (
    <div className="hover:border-gold/30 flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          {img ? (
            <div className="relative h-full w-full">
              <Image
                src={img}
                alt={group.name || meta.breadcrumb}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          ) : (
            <meta.icon size={22} className="text-gold" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {/* The category is the section heading above, so it isn't repeated here. */}
          <h3 className="text-foreground font-serif text-lg font-bold">
            {group.name || "Untitled"}
          </h3>
        </div>
      </div>

      {group.description && (
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
          {group.description}
        </p>
      )}

      {group.convenor && (
        <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
          <span className="bg-gold/15 text-gold flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
            <UserRound size={15} />
          </span>
          <div className="min-w-0">
            <p className="text-foreground text-sm font-bold">
              {group.convenor}
            </p>
            <p className="text-muted-foreground text-[11px]">
              {group.convenorRole || meta.convenorFallback}
            </p>
          </div>
        </div>
      )}

      {members.length > 0 && (
        <div className="mt-4">
          <p className="text-muted-foreground mb-2 text-[10px] font-bold tracking-wider uppercase">
            {meta.membersLabel}
          </p>
          <ul className="divide-y divide-white/5">
            {members.map((m, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-1.5 text-sm"
              >
                <span className="text-foreground font-medium">{m.name}</span>
                <span className="flex flex-wrap items-baseline gap-x-2 text-xs">
                  <span className="text-muted-foreground">
                    {[m.role, m.dept].filter(Boolean).join(" · ")}
                  </span>
                  {m.contact && (
                    <a
                      href={contactHref(m.contact)}
                      onClick={editable ? (e) => e.preventDefault() : undefined}
                      className="text-gold font-medium hover:underline"
                    >
                      {m.contact}
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activities.length > 0 && (
        <div className="mt-4">
          <p className="text-muted-foreground mb-2 text-[10px] font-bold tracking-wider uppercase">
            {meta.activitiesLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {activities.map((a, i) => (
              <span
                key={i}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {group.email && (
        <a
          href={`mailto:${group.email}`}
          className="text-gold mt-auto flex items-center gap-1.5 pt-4 text-xs font-bold hover:underline"
        >
          <Mail size={14} />
          {group.email}
        </a>
      )}
    </div>
  );
}

export function GroupsPageLayout({
  data,
  variant,
  editable = false,
  onEditSection,
}: {
  data: GroupsPageValue;
  variant: GroupsVariant;
  editable?: boolean;
  onEditSection?: (section: GroupsEditableSection) => void;
}) {
  const meta = GROUPS_VARIANT_META[variant];
  const intro = data.intro.filter((p) => p.trim() !== "");
  const groups = editable
    ? data.groups
    : data.groups.filter((g) => g.name.trim() !== "");

  return (
    <main className="bg-surface text-foreground min-h-screen">
      {!editable && <Navbar forceSolidOnTop />}

      <EditableRegion
        as="div"
        section="hero"
        label={GROUPS_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEditSection}
      >
        <PageHero
          title={data.hero.title || meta.defaultHeroTitle}
          subtitle={data.hero.subtitle}
        />
      </EditableRegion>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Engineering", href: "/institutions/engineering" },
            { label: meta.breadcrumb },
          ]}
        />

        {(intro.length > 0 || editable) && (
          <EditableRegion
            as="section"
            section="intro"
            label={GROUPS_SECTION_LABELS.intro}
            editable={editable}
            onEditSection={onEditSection}
            className="mt-8 max-w-3xl"
          >
            {intro.length > 0 ? (
              <div className="space-y-4">
                {intro.map((p, i) => (
                  <p
                    key={i}
                    className="text-muted-foreground text-base leading-relaxed md:text-lg"
                  >
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground/60 text-sm italic">
                Click to add an introduction…
              </p>
            )}
          </EditableRegion>
        )}

        <EditableRegion
          as="section"
          section="groups"
          label={meta.sectionLabel}
          editable={editable}
          onEditSection={onEditSection}
          className="mt-12"
        >
          <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold md:text-3xl">
            <span className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <meta.icon size={20} />
            </span>
            {meta.listHeading}
          </h2>

          {groups.length > 0 ? (
            <div className="space-y-12">
              {groupByCategory(groups).map(([category, items]) => (
                <div key={category || "__uncategorised"}>
                  {category && (
                    <h3 className="text-gold mb-4 border-b border-white/10 pb-2 text-sm font-bold tracking-wider uppercase">
                      {category}
                    </h3>
                  )}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {items.map((group, i) => (
                      <GroupCard
                        key={i}
                        group={group}
                        meta={meta}
                        editable={editable}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-16 text-center">
              <meta.icon size={32} className="text-muted-foreground/40" />
              <p className="text-muted-foreground/60 mt-3 text-sm">
                {editable ? meta.emptyHint : meta.publicEmpty}
              </p>
            </div>
          )}
        </EditableRegion>
      </div>

      {!editable && <Footer />}
    </main>
  );
}
