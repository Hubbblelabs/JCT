import "server-only";

import { getPublishedConfigValue } from "@/lib/site-config-server";
import { GroupsPageSchema, type GroupsPageValue } from "@/lib/validation";
import {
  FINE_ARTS_CLUB_KEY,
  POLYTECHNIC_CLUBS_KEY,
  polytechnicClubsStart,
} from "@/lib/polytechnic-clubs";

/**
 * The published Polytechnic Clubs & Cells page. Until it has been published
 * once, the old Fine Arts Club page stands in as its one club — see
 * src/lib/polytechnic-clubs.ts.
 */
export async function getPublishedPolytechnicClubs(): Promise<GroupsPageValue> {
  const stored = await getPublishedConfigValue(POLYTECHNIC_CLUBS_KEY);
  if (stored !== null) {
    const parsed = GroupsPageSchema.safeParse(stored);
    if (parsed.success) return parsed.data;
    console.error(
      "[polytechnic-clubs] published value failed validation; serving defaults:",
      parsed.error.issues.slice(0, 5),
    );
    return GroupsPageSchema.parse({});
  }
  return polytechnicClubsStart(
    await getPublishedConfigValue(FINE_ARTS_CLUB_KEY),
  );
}
