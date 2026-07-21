import "server-only";
import { getPublishedConfigValue } from "@/lib/site-config-server";
import { PlacementInfoSchema, type PlacementInfoValue } from "@/lib/validation";

const CONFIG_KEY: Record<string, string> = {
  engineering: "engineeringPlacementInfo",
  "arts-science": "artsSciencePlacementInfo",
  polytechnic: "polytechnicPlacementInfo",
};

// Every branch of PlacementInfoSchema has a default, so parsing `{}` yields a
// fully-shaped empty value — the page renders with those sections hidden.
export const EMPTY_PLACEMENT_INFO: PlacementInfoValue =
  PlacementInfoSchema.parse({});

/**
 * Static (year-independent) placement page content for a college: MoUs, the
 * recruiter pitch, the placement process, and TPO contacts. Published values
 * only; an unset/unpublished key or a stored value that no longer matches the
 * schema degrades to the empty shape instead of breaking the page.
 */
export async function getPlacementInfo(
  institution: string,
): Promise<PlacementInfoValue> {
  const key = CONFIG_KEY[institution];
  if (!key) return EMPTY_PLACEMENT_INFO;
  const raw = await getPublishedConfigValue(key);
  if (!raw) return EMPTY_PLACEMENT_INFO;
  const parsed = PlacementInfoSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn(
      `[public-placement-info] ${key} failed validation; using empty content.`,
    );
    return EMPTY_PLACEMENT_INFO;
  }
  return parsed.data;
}
