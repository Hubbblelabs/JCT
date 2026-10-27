import type { MetadataRoute } from "next";
import { listPublishedProgramEntries } from "@/lib/public-programs";
import { listPublishedPageEntries } from "@/lib/public-pages";
import { listPublicEventEntries } from "@/lib/public-events";
import { listPublicBlogEntries } from "@/lib/public-blogs";
import { CONTENT_PAGES } from "@/lib/content-pages";
import {
  getConfigPublishedAt,
  getPublishedConfig,
} from "@/lib/site-config-server";
import { getPublishedPolytechnicClubs } from "@/lib/polytechnic-clubs-server";
import {
  FINE_ARTS_CLUB_KEY,
  POLYTECHNIC_CLUBS_KEY,
} from "@/lib/polytechnic-clubs";
import { listGroupSlugs } from "@/lib/group-slugs";
import { GroupsPageSchema, type GroupsPageValue } from "@/lib/validation";

const BASE_URL = "https://jct.ac.in";

// This route reads live slugs from Mongo. Without an ISR window it is
// prerendered once at build and never regenerated, so every program, page and
// event published after the last image build would be missing from the
// sitemap. Admin writes also revalidate it explicitly (see FEED_PATHS in
// src/lib/revalidate.ts); this is the backstop.
export const revalidate = 3600;

const INSTITUTIONS = ["engineering", "arts-science", "polytechnic"] as const;

const EMPTY_GROUPS: GroupsPageValue = GroupsPageSchema.parse({});

/**
 * Clubs & Cells / Committees: each index page plus one detail page per public
 * group. `keys` are every SiteConfig key the page can render from — Polytechnic
 * Clubs falls back to the old Fine Arts Club key until it is first published.
 */
const GROUP_PAGES: {
  path: string;
  keys: string[];
  load: () => Promise<GroupsPageValue>;
}[] = [
  {
    path: "/institutions/engineering/clubs-and-cells",
    keys: ["engineeringClubs"],
    load: () =>
      getPublishedConfig("engineeringClubs", GroupsPageSchema, EMPTY_GROUPS),
  },
  {
    path: "/institutions/engineering/committees",
    keys: ["engineeringCommittees"],
    load: () =>
      getPublishedConfig(
        "engineeringCommittees",
        GroupsPageSchema,
        EMPTY_GROUPS,
      ),
  },
  {
    path: "/institutions/polytechnic/clubs-and-cells",
    keys: [POLYTECHNIC_CLUBS_KEY, FINE_ARTS_CLUB_KEY],
    load: getPublishedPolytechnicClubs,
  },
  {
    path: "/institutions/polytechnic/committees",
    keys: ["polytechnicCommittees"],
    load: () =>
      getPublishedConfig(
        "polytechnicCommittees",
        GroupsPageSchema,
        EMPTY_GROUPS,
      ),
  },
];

/**
 * Static routes whose whole body comes from one SiteConfig key, so that key's
 * publish time is an honest `lastmod`. Hosted content pages are left out: their
 * route also renders the host's own key, and the newest panel alone could
 * understate when the page last changed.
 */
const STATIC_ROUTE_KEYS: Record<string, string[]> = {
  "/institutions/engineering/research": ["engineeringResearch"],
  ...Object.fromEntries(
    CONTENT_PAGES.filter(
      (p) =>
        !p.host &&
        !CONTENT_PAGES.some((other) => other !== p && other.path === p.path),
    ).map((p) => [p.path, [p.configKey]]),
  ),
  ...Object.fromEntries(GROUP_PAGES.map((g) => [g.path, g.keys])),
};

function newest(dates: (Date | undefined)[]): Date | undefined {
  let out: Date | undefined;
  for (const d of dates) {
    if (d && (!out || d > out)) out = d;
  }
  return out;
}

function toEntry(
  route: string,
  {
    changeFrequency,
    priority,
    lastModified,
  }: Pick<
    MetadataRoute.Sitemap[number],
    "changeFrequency" | "priority" | "lastModified"
  >,
): MetadataRoute.Sitemap[number] {
  // `lastModified` is omitted rather than defaulted to now: a stamp that is
  // always the generation time tells crawlers nothing, and they learn to
  // ignore the sitemap's lastmod altogether.
  return {
    url: `${BASE_URL}${route}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    programsByInstitution,
    pagesByInstitution,
    events,
    blogs,
    groupsByPage,
    publishedAt,
  ] = await Promise.all([
    Promise.all(
      INSTITUTIONS.map((institution) =>
        listPublishedProgramEntries(institution),
      ),
    ),
    Promise.all(
      (["main", ...INSTITUTIONS] as const).map((institution) =>
        listPublishedPageEntries(institution),
      ),
    ),
    listPublicEventEntries(),
    listPublicBlogEntries(),
    Promise.all(GROUP_PAGES.map((g) => g.load())),
    getConfigPublishedAt([...new Set(Object.values(STATIC_ROUTE_KEYS).flat())]),
  ]);

  const newestEvent = newest(events.map((e) => e.lastModified));
  const newestBlog = newest(blogs.map((b) => b.lastModified));

  function routeLastModified(route: string): Date | undefined {
    if (route === "/events") return newestEvent;
    if (route === "/blogs") return newestBlog;
    const collegeEvents = route.match(/^\/institutions\/([^/]+)\/events$/);
    if (collegeEvents) {
      return newest(
        events
          .filter((e) => e.institution === collegeEvents[1])
          .map((e) => e.lastModified),
      );
    }
    const keys = STATIC_ROUTE_KEYS[route];
    return keys ? newest(keys.map((k) => publishedAt[k])) : undefined;
  }

  // A hosted content page shares its host's `path`, so the list is deduped —
  // one URL per route, never a repeat of the page that absorbed it.
  // /institutions/polytechnic/fine-arts-club is deliberately absent: it is a
  // permanent redirect into Clubs & Cells now.
  const staticRoutes = [
    ...new Set([
      "/",
      "/about-us",
      "/campus-life",
      "/events",
      "/blogs",
      "/accreditations",
      "/institutions/engineering",
      "/institutions/engineering/about",
      "/institutions/engineering/courses",
      "/institutions/engineering/coe",
      "/institutions/engineering/accreditations",
      "/institutions/engineering/naac",
      "/institutions/engineering/placements",
      "/institutions/engineering/research",
      "/institutions/engineering/events",
      "/institutions/arts-science",
      "/institutions/arts-science/about",
      "/institutions/arts-science/courses",
      "/institutions/arts-science/accreditations",
      "/institutions/arts-science/placements",
      "/institutions/arts-science/events",
      "/institutions/polytechnic",
      "/institutions/polytechnic/about",
      "/institutions/polytechnic/courses",
      "/institutions/polytechnic/accreditations",
      "/institutions/polytechnic/placements",
      "/institutions/polytechnic/events",
      ...GROUP_PAGES.map((g) => g.path),
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
      lastModified: routeLastModified(route),
    });
  });

  const groupEntries = GROUP_PAGES.flatMap((page, i) => {
    const lastModified = routeLastModified(page.path);
    return listGroupSlugs(groupsByPage[i].groups).map((slug) =>
      toEntry(`${page.path}/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.5,
        lastModified,
      }),
    );
  });

  const programEntries = INSTITUTIONS.flatMap((institution, i) =>
    programsByInstitution[i].map(({ slug, lastModified }) =>
      toEntry(`/institutions/${institution}/programs/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified,
      }),
    ),
  );

  const [mainPages, ...institutionPages] = pagesByInstitution;

  const mainPageEntries = mainPages.map(({ slug, lastModified }) =>
    toEntry(`/p/${slug}`, {
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified,
    }),
  );

  const institutionPageEntries = INSTITUTIONS.flatMap((institution, i) =>
    institutionPages[i].map(({ slug, lastModified }) =>
      toEntry(`/institutions/${institution}/p/${slug}`, {
        changeFrequency: "monthly",
        priority: 0.5,
        lastModified,
      }),
    ),
  );

  const eventEntries = events.map(({ slug, lastModified }) =>
    toEntry(`/events/${slug}`, {
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified,
    }),
  );

  const blogEntries = blogs.map(({ slug, lastModified }) =>
    toEntry(`/blogs/${slug}`, {
      changeFrequency: "monthly",
      priority: 0.5,
      lastModified,
    }),
  );

  return [
    ...staticEntries,
    ...groupEntries,
    ...programEntries,
    ...mainPageEntries,
    ...institutionPageEntries,
    ...eventEntries,
    ...blogEntries,
  ];
}
