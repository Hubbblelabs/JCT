import { permanentRedirect } from "next/navigation";
import { findGroupBySlug } from "@/lib/group-slugs";
import { FINE_ARTS_CLUB_SLUG } from "@/lib/polytechnic-clubs";
import { getPublishedPolytechnicClubs } from "@/lib/polytechnic-clubs-server";

export const revalidate = 3600;

const CLUBS_PATH = "/institutions/polytechnic/clubs-and-cells";

/**
 * The Fine Arts Club used to be a page of its own. It is now one club on the
 * Polytechnic Clubs & Cells page, so this address forwards there — to the
 * club itself while it is listed, otherwise to the clubs page.
 */
export default async function FineArtsClubRedirect() {
  const data = await getPublishedPolytechnicClubs();
  const found = findGroupBySlug(data.groups, FINE_ARTS_CLUB_SLUG);
  permanentRedirect(
    found ? `${CLUBS_PATH}/${FINE_ARTS_CLUB_SLUG}` : CLUBS_PATH,
  );
}
