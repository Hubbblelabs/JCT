import type { MetadataRoute } from "next";
import { listPublishedProgramSlugs } from "@/lib/public-programs";
import { listPublishedPageSlugs } from "@/lib/public-pages";
import { listPublicEventSlugs } from "@/lib/public-events";
import { CONTENT_PAGES } from "@/lib/content-pages";

const BASE_URL = "https://jct.ac.in";

// This route reads live slugs from Mongo. Without an ISR window it is
// prerendered once at build and never regenerated, so every program, page and
// event published after the last image build would be missing from the
// sitemap. Admin writes also revalidate it explicitly (see FEED_PATHS in
// src/lib/revalidate.ts); this is the backstop.
export const revalidate = 3600;

const INSTITUTIONS = ["engineering", "arts-science", "polytechnic"] as const;

function toEntry(
  route: string,
  {
    changeFrequency,
    priority,
  }: Pick<MetadataRoute.Sitemap[number], "changeFrequency" | "priority">,
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // A hosted content page shares its host's `path`, so the list is deduped —
  // one URL per route, never a repeat of the page that absorbed it.
  const staticRoutes = [
    ...new Set([
      "/",
      "/about-us",
      "/campus-life",
      "/events",
      "/accreditations",
      "/institutions/engineering",
      "/institutions/engineering/about",
      "/institutions/engineering/courses",
      "/institutions/engineering/coe",
      "/institutions/engineering/accreditations",
      "/institutions/engineering/naac",
      "/institutions/engineering/placements",
      "/institutions/arts-science",
      "/institutions/arts-science/about",
      "/institutions/arts-science/courses",
      "/institutions/arts-science/accreditations",
      "/institutions/arts-science/placements",
      "/institutions/polytechnic",
      "/institutions/polytechnic/about",
      "/institutions/polytechnic/courses",
      "/institutions/polytechnic/accreditations",
      "/institutions/polytechnic/placements",
      "/institutions/polytechnic/committees",
      ...CONTENT_PAGES.map((p) => p.path),
    ]),
  ];

  const staticEntries = staticRoutes.map((route) => {
    const isHome = route === "/";
    const isMainSection = route.split("/").length <= 2;
    const priority = isHome ? 1 : isMainSection ? 0.8 : 0.6;
    return toEntry(route, {
      changeFrequency: isHome ? "weekly" : "monthly",
      priority,
    });
  });

  const [programSlugsByInstitution, pageSlugsByInstitution, eventSlugs] =
    await Promise.all([
      Promise.all(
        INSTITUTIONS.map((institution) =>
          listPublishedProgramSlugs(institution),
        ),
      ),
      Promise.all(
        (["main", ...INSTITUTIONS] as const).map((institution) =>
          listPublishedPageSlugs(institution),
        ),
      ),
      listPublicEventSlugs(),
    ]);

  const programEntries = INSTITUTIONS.flatMap((institution, i) =>
    programSlugsByInstitution[i].map(({ slug }) =>
      toEntry(`/institutions/${institution}/programs/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.7,
      }),
    ),
  );

  const [mainPageSlugs, ...institutionPageSlugs] = pageSlugsByInstitution;

  const mainPageEntries = mainPageSlugs.map(({ slug }) =>
    toEntry(`/p/${slug}`, { changeFrequency: "monthly", priority: 0.5 }),
  );

  const institutionPageEntries = INSTITUTIONS.flatMap((institution, i) =>
    institutionPageSlugs[i].map(({ slug }) =>
      toEntry(`/institutions/${institution}/p/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.5,
      }),
    ),
  );

  const eventEntries = eventSlugs.map(({ slug }) =>
    toEntry(`/events/${slug}`, { changeFrequency: "monthly", priority: 0.5 }),
  );

  return [
    ...staticEntries,
    ...programEntries,
    ...mainPageEntries,
    ...institutionPageEntries,
    ...eventEntries,
  ];
}
