import {
  ContentPageSchema,
  GroupsPageSchema,
  type ContentBlockValue,
  type ContentPageValue,
  type GroupsPageValue,
} from "@/lib/validation";

/**
 * The Polytechnic used to publish its clubs as one block-based content page,
 * "Fine Arts Club" (config key `polytechnicFineArtsClub`). It now has a Clubs &
 * Cells page like Engineering's (`polytechnicClubs`), and the Fine Arts Club
 * moves in as one club on it.
 *
 * Until someone saves the new page, both the public page and its editor start
 * from the old content converted here — so nothing has to be retyped and the
 * Fine Arts Club never disappears from the site in between. The old value is
 * left stored untouched.
 */

export const POLYTECHNIC_CLUBS_KEY = "polytechnicClubs";
export const FINE_ARTS_CLUB_KEY = "polytechnicFineArtsClub";
/** Kept stable so links to the club keep working whatever it is renamed to. */
export const FINE_ARTS_CLUB_SLUG = "fine-arts-club";

const DESCRIPTION_MAX = 1500;

function firstImage(blocks: ContentBlockValue[]): string {
  for (const block of blocks) {
    if (block.type !== "gallery") continue;
    for (const group of block.groups) {
      const src = group.images.find((img) => img.src.trim() !== "")?.src;
      if (src) return src;
    }
  }
  return "";
}

/**
 * The starting Clubs & Cells page: empty, or holding the Fine Arts Club when
 * the old page has any content. The club keeps every block of the old page;
 * its intro paragraphs lead them as a text block so none is cut short by the
 * club's shorter description field.
 */
export function polytechnicClubsStart(fineArtsRaw: unknown): GroupsPageValue {
  const empty = GroupsPageSchema.parse({});
  const parsed = ContentPageSchema.safeParse(fineArtsRaw ?? {});
  if (!parsed.success) return empty;
  const fineArts: ContentPageValue = parsed.data;

  const intro = fineArts.intro.filter((p) => p.trim() !== "");
  const blocks: ContentBlockValue[] = [
    ...(intro.length > 0
      ? [
          {
            type: "text" as const,
            title: "",
            paragraphs: intro,
          },
        ]
      : []),
    ...fineArts.blocks,
  ];
  if (blocks.length === 0 && !fineArts.hero.title && !fineArts.hero.subtitle)
    return empty;

  const description = (fineArts.hero.subtitle || intro[0] || "").slice(
    0,
    DESCRIPTION_MAX,
  );

  return GroupsPageSchema.parse({
    hero: { title: "Clubs & Cells", subtitle: "" },
    intro: [],
    groups: [
      {
        name: fineArts.hero.title.trim() || "Fine Arts Club",
        slug: FINE_ARTS_CLUB_SLUG,
        category: "Cultural Clubs",
        description,
        image: firstImage(fineArts.blocks),
        // The old page's galleries move over as blocks; the sidebar gallery
        // stays empty rather than repeating the same photos.
        gallery: [],
        members: [],
        activities: [],
        blocks: blocks.slice(0, 80),
      },
    ],
  });
}
