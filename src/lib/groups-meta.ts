import { Sparkles, Users, type LucideIcon } from "lucide-react";

/**
 * Copy and routing metadata shared by the Clubs & Cells and Committees pages.
 *
 * This lives outside the layout components on purpose. `GroupsPageLayout` is a
 * client component, and importing a plain object out of a `"use client"` module
 * from a Server Component yields a client-reference proxy rather than the
 * object — property reads then come back `undefined`. The detail pages are
 * server components, so the metadata they share has to sit in a module with no
 * `"use client"` directive of its own.
 */
export type GroupsVariant = "clubs" | "committees";

export type GroupsVariantMeta = {
  /** Detail pages live at `${basePath}/${slug}`. */
  basePath: string;
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
  /** Singular noun, for detail-page copy. */
  singular: string;
  /**
   * "image" — a full-width photo leads the card (Clubs & Cells, where every
   * entry has its own picture). "avatar" — a small icon/logo badge next to
   * the name (Committees, which mostly don't have a photo).
   */
  cardStyle: "image" | "avatar";
};

export const GROUPS_VARIANT_META: Record<GroupsVariant, GroupsVariantMeta> = {
  clubs: {
    basePath: "/institutions/engineering/clubs-and-cells",
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
    singular: "Club",
    cardStyle: "image",
  },
  committees: {
    basePath: "/institutions/engineering/committees",
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
    singular: "Committee",
    cardStyle: "avatar",
  },
};

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
