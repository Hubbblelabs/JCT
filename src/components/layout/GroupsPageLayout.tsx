"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ImageIcon,
  ListChecks,
  UserRound,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import { resolveGroupSlugs } from "@/lib/group-slugs";
import {
  GROUPS_SECTION_LABELS,
  GROUPS_VARIANT_META,
  type GroupsVariant,
  type GroupsVariantMeta,
} from "@/lib/groups-meta";
import type { GroupsPageValue, GroupValue } from "@/lib/validation";

/**
 * Index layout for the two "list of groups" pages — Clubs & Cells and
 * Committees. Each card links to its own detail page (rendered by
 * GroupDetailLayout); `variant` only changes copy and the detail base path.
 *
 * The variant metadata lives in @/lib/groups-meta so the server-rendered detail
 * pages can share it — see the note there.
 */

type Entry = { group: GroupValue; index: number; slug: string };

/**
 * Buckets entries under their `category`, preserving first-appearance order so
 * the admin's ordering drives the page. Groups with no category fall into a
 * single unlabelled bucket, which renders as a plain grid with no subheading.
 */
function groupByCategory(entries: Entry[]): [string, Entry[]][] {
  const buckets = new Map<string, Entry[]>();
  for (const e of entries) {
    const key = e.group.category.trim();
    const existing = buckets.get(key);
    if (existing) existing.push(e);
    else buckets.set(key, [e]);
  }
  return [...buckets.entries()];
}

function CardFooter({
  group,
  meta,
}: {
  group: GroupValue;
  meta: GroupsVariantMeta;
}) {
  const memberCount = group.members.filter((m) => m.name.trim() !== "").length;
  const activityCount = group.activities.filter((a) => a.trim() !== "").length;
  const galleryCount = (group.gallery ?? []).filter(
    (g) => g.trim() !== "",
  ).length;

  return (
    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-5">
      {memberCount > 0 && (
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Users size={13} className="shrink-0" />
          {memberCount} {meta.membersLabel.toLowerCase()}
        </span>
      )}
      {activityCount > 0 && (
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <ListChecks size={13} className="shrink-0" />
          {activityCount} {meta.activitiesLabel.toLowerCase()}
        </span>
      )}
      {galleryCount > 0 && (
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <ImageIcon size={13} className="shrink-0" />
          {galleryCount} photos
        </span>
      )}
      <span className="text-gold ml-auto flex items-center gap-1.5 text-xs font-bold">
        View details
        <ArrowRight
          size={13}
          className="transition-transform duration-300 group-hover/card:translate-x-0.5"
        />
      </span>
    </div>
  );
}

/** Avatar-style card — a small logo badge beside the name (Committees). */
function CardBodyAvatar({
  group,
  meta,
}: {
  group: GroupValue;
  meta: GroupsVariantMeta;
}) {
  const img = getImageUrl(group.image) || "";

  return (
    <>
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
          <h3 className="text-foreground group-hover/card:text-gold font-serif text-lg font-bold transition-colors duration-300">
            {group.name || "Untitled"}
          </h3>
          {group.convenor && (
            <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <UserRound size={12} className="shrink-0" />
              {group.convenor}
            </p>
          )}
        </div>
      </div>

      {group.description && (
        <p className="text-muted-foreground mt-4 line-clamp-3 text-sm leading-relaxed">
          {group.description}
        </p>
      )}

      <CardFooter group={group} meta={meta} />
    </>
  );
}

/** Image-led card — a full-bleed photo above the name/desc (Clubs & Cells). */
function CardBodyImage({
  group,
  meta,
}: {
  group: GroupValue;
  meta: GroupsVariantMeta;
}) {
  const img = getImageUrl(group.image) || "";

  return (
    <>
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-white/5">
        {img ? (
          <Image
            src={img}
            alt={group.name || meta.breadcrumb}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <meta.icon size={32} className="text-gold/40" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-foreground group-hover/card:text-gold font-serif text-lg font-bold transition-colors duration-300">
          {group.name || "Untitled"}
        </h3>
        {group.convenor && (
          <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
            <UserRound size={12} className="shrink-0" />
            {group.convenor}
          </p>
        )}
        {group.description && (
          <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-relaxed">
            {group.description}
          </p>
        )}

        <CardFooter group={group} meta={meta} />
      </div>
    </>
  );
}

function CardBody({
  group,
  meta,
}: {
  group: GroupValue;
  meta: GroupsVariantMeta;
}) {
  return meta.cardStyle === "image" ? (
    <CardBodyImage group={group} meta={meta} />
  ) : (
    <CardBodyAvatar group={group} meta={meta} />
  );
}

const CARD_CLASS_AVATAR =
  "hover:border-gold/30 group/card flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:bg-white/10";

const CARD_CLASS_IMAGE =
  "hover:border-gold/30 group/card flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-black/20";

export function GroupsPageLayout({
  data,
  variant,
  editable = false,
  onEditSection,
}: {
  data: GroupsPageValue;
  variant: GroupsVariant;
  editable?: boolean;
  /** Receives "hero" | "intro" | "groups" | `group:<index>`. */
  onEditSection?: (section: string) => void;
}) {
  const meta = GROUPS_VARIANT_META[variant];
  const cardClass =
    meta.cardStyle === "image" ? CARD_CLASS_IMAGE : CARD_CLASS_AVATAR;
  const intro = data.intro.filter((p) => p.trim() !== "");
  const slugs = resolveGroupSlugs(data.groups);
  const entries: Entry[] = data.groups
    .map((group, index) => ({ group, index, slug: slugs[index] }))
    // Unnamed rows are placeholders the admin hasn't filled in yet.
    .filter((e) => editable || e.group.name.trim() !== "");

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
          label={`${meta.sectionLabel} — add, remove & reorder`}
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

          {entries.length > 0 ? (
            <div className="space-y-12">
              {groupByCategory(entries).map(([category, items]) => (
                <div key={category || "__uncategorised"}>
                  {category && (
                    <h3 className="text-gold mb-4 border-b border-white/10 pb-2 text-sm font-bold tracking-wider uppercase">
                      {category}
                    </h3>
                  )}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map(({ group, index, slug }) =>
                      editable ? (
                        // In the admin, a card opens that one entry's inspector
                        // instead of navigating away from the editor.
                        <EditableRegion
                          key={index}
                          as="div"
                          section={`group:${index}`}
                          label={group.name || "Untitled"}
                          editable
                          onEditSection={onEditSection}
                          className={cardClass}
                        >
                          <CardBody group={group} meta={meta} />
                        </EditableRegion>
                      ) : (
                        <Link
                          key={index}
                          href={`${meta.basePath}/${slug}`}
                          className={cardClass}
                        >
                          <CardBody group={group} meta={meta} />
                        </Link>
                      ),
                    )}
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
