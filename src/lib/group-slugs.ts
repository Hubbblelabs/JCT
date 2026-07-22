import type { GroupValue } from "@/lib/validation";

/**
 * URL slugs for the Clubs & Cells / Committees detail pages.
 *
 * A group's slug is normally derived from its name, so the admin never has to
 * think about URLs. `group.slug` is an optional override for when a published
 * URL has to stay stable after a rename.
 *
 * Slugs are resolved for the whole list at once rather than per group, because
 * uniqueness is a property of the list: two committees can legitimately share a
 * name ("Science Club" under two categories), and a detail route must still
 * resolve to exactly one of them.
 */

export function slugifyGroupName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Slug for every group, positionally aligned with `groups`. Collisions get a
 * numeric suffix (`-2`, `-3`, …) in list order, so the first occurrence keeps
 * the clean URL and later ones stay reachable.
 */
export function resolveGroupSlugs(groups: GroupValue[]): string[] {
  const used = new Map<string, number>();
  return groups.map((g, i) => {
    const base =
      slugifyGroupName((g.slug || "").trim()) ||
      slugifyGroupName(g.name || "") ||
      `item-${i + 1}`;
    const seen = used.get(base) ?? 0;
    used.set(base, seen + 1);
    return seen === 0 ? base : `${base}-${seen + 1}`;
  });
}

/** The group a detail route should render, or null when the slug is unknown. */
export function findGroupBySlug(
  groups: GroupValue[],
  slug: string,
): { group: GroupValue; slug: string } | null {
  const slugs = resolveGroupSlugs(groups);
  const idx = slugs.indexOf(slug);
  if (idx === -1) return null;
  return { group: groups[idx], slug: slugs[idx] };
}

/** Slugs worth pre-rendering — skips unnamed placeholder rows. */
export function listGroupSlugs(groups: GroupValue[]): string[] {
  const slugs = resolveGroupSlugs(groups);
  return slugs.filter((_, i) => groups[i].name.trim() !== "");
}
