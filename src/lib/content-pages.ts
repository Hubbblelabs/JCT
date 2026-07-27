/**
 * Registry of the block-based content pages (see
 * `src/lib/validation/contentPage.ts`).
 *
 * One entry drives everything about a page: its SiteConfig key, its public
 * route, the admin editor at /admin/content/<slug>, the hub card, the SEO
 * fallback meta tags and the sitemap/revalidate entries. Adding a page here
 * plus a `page.tsx` that renders `<ContentPage slug="…" />` is the whole job —
 * there is no per-page schema, layout or inspector.
 *
 * A page with a `host` has no route of its own: it is published as one panel of
 * the sidebar on `path` (e.g. the NAAC sub-pages live inside the NAAC page).
 * Those entries carry no `page.tsx` and no SEO row — the host route owns the
 * URL and the meta tags. Use `contentPageUrl()` for a link to one.
 *
 * `configKey` must also be registered in `SITE_CONFIG_SCHEMAS`
 * (src/lib/validation/siteConfig.ts) — the API rejects unknown keys.
 */
import {
  Award,
  BadgeCheck,
  BookOpen,
  Camera,
  FileBarChart,
  FileSpreadsheet,
  HeartHandshake,
  History,
  MessageSquare,
  MonitorPlay,
  Palette,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { College } from "@/lib/admin-nav";
import { PLACEMENT_GALLERY_ANCHOR } from "@/lib/page-anchors";

export type ContentPageDef = {
  /** URL segment for the admin editor: /admin/content/<slug> */
  slug: string;
  configKey: string;
  institution: College;
  /**
   * Public route this page is published at. For a hosted page (see `host`)
   * this is the host's route — several entries then share one `path`.
   */
  path: string;
  /**
   * Set when the page renders as a sidebar panel of `path` rather than at a
   * route of its own. `anchor` is the URL fragment that deep-links to it and
   * `navLabel` is what the host's sidebar shows.
   */
  host?: { anchor: string; navLabel: string };
  /** Admin editor heading + hub card label. */
  label: string;
  /** Hub card + editor subtitle. */
  description: string;
  /** Label used in the per-scope SEO editor. */
  seoLabel: string;
  seoTitle: string;
  seoDescription: string;
  icon: LucideIcon;
  /** Which admin hub group the card belongs to. */
  group: "Institution" | "Academics" | "Campus & Community" | "Placements";
};

const ENG = "/institutions/engineering";
const POLY = "/institutions/polytechnic";
const SUFFIX = "JCT College of Engineering & Technology, Coimbatore";
const POLY_SUFFIX = "JCT Polytechnic College, Coimbatore";

export const CONTENT_PAGES: ContentPageDef[] = [
  {
    slug: "library",
    configKey: "engineeringLibrary",
    institution: "engineering",
    path: `${ENG}/library`,
    label: "Library",
    description: "Learning resource centre — collections, journals, services.",
    seoLabel: "Library",
    seoTitle: `Library | ${SUFFIX}`,
    seoDescription:
      "The JCT Learning Resource Centre — collections, subscribed e-journals, open sources, borrowing rules and library services for students and faculty.",
    icon: BookOpen,
    group: "Academics",
  },
  {
    slug: "nirf",
    configKey: "engineeringNirf",
    institution: "engineering",
    path: `${ENG}/documents`,
    host: { anchor: "nirf", navLabel: "NIRF" },
    label: "NIRF",
    description:
      "NIRF rankings reports and feedback contact — a tab of the Documents page.",
    seoLabel: "NIRF",
    seoTitle: `NIRF | ${SUFFIX}`,
    seoDescription:
      "National Institutional Ranking Framework (NIRF) submissions of JCT College of Engineering & Technology — overall, engineering and innovation reports.",
    icon: FileBarChart,
    group: "Institution",
  },
  {
    slug: "timeline",
    configKey: "engineeringTimeline",
    institution: "engineering",
    path: `${ENG}/about`,
    host: { anchor: "timeline", navLabel: "Timeline" },
    label: "Timeline",
    description:
      "Year-by-year milestones since the college was founded — a tab of the About page.",
    seoLabel: "Timeline",
    seoTitle: `Timeline | ${SUFFIX}`,
    seoDescription:
      "Milestones of JCT College of Engineering & Technology year by year — new programmes, accreditations, conferences and campus achievements.",
    icon: History,
    group: "Institution",
  },
  {
    slug: "professional-bodies",
    configKey: "engineeringProfessionalBodies",
    institution: "engineering",
    path: `${ENG}/professional-bodies`,
    label: "Professional Bodies",
    description: "Student chapters and professional body memberships.",
    seoLabel: "Professional Bodies",
    seoTitle: `Professional Bodies | ${SUFFIX}`,
    seoDescription:
      "Professional body memberships and student chapters at JCT — CSI, ISTE, ICT Academy, Oracle Academy, IEI, IChemE, IAENG and more.",
    icon: Users,
    group: "Academics",
  },
  {
    slug: "cyber-safety",
    configKey: "engineeringCyberSafety",
    institution: "engineering",
    path: `${ENG}/national-cyber-safety-and-security-standards`,
    label: "Cyber Safety & Security",
    description: "NCSSS chapter, handbooks and cyber-safety resources.",
    seoLabel: "National Cyber Safety & Security Standards",
    seoTitle: `National Cyber Safety and Security Standards | ${SUFFIX}`,
    seoDescription:
      "National Cyber Safety and Security Standards at JCT — cyber crime and cyber defence reference handbooks and online safety resources.",
    icon: ShieldCheck,
    group: "Academics",
  },
  {
    slug: "naac-best-practices",
    configKey: "engineeringNaacBestPractices",
    institution: "engineering",
    path: `${ENG}/accreditations/naac`,
    host: { anchor: "best-practices", navLabel: "Best Practices" },
    label: "NAAC — Best Practices",
    description:
      "The institution's documented NAAC best practices — a tab of the NAAC page.",
    seoLabel: "NAAC — Institution Best Practices",
    seoTitle: `Institution Best Practices | ${SUFFIX}`,
    seoDescription:
      "NAAC institutional best practices at JCT — ERP-driven transparent governance and the student mentoring and counselling system.",
    icon: Sparkles,
    group: "Institution",
  },
  {
    slug: "naac-distinctiveness",
    configKey: "engineeringNaacDistinctiveness",
    institution: "engineering",
    path: `${ENG}/accreditations/naac`,
    host: {
      anchor: "institutional-distinctiveness",
      navLabel: "Institutional Distinctiveness",
    },
    label: "NAAC — Distinctiveness",
    description:
      "What sets the institution apart, as filed with NAAC — a tab of the NAAC page.",
    seoLabel: "NAAC — Institutional Distinctiveness",
    seoTitle: `Institutional Distinctiveness | ${SUFFIX}`,
    seoDescription:
      "Institutional distinctiveness of JCT College of Engineering & Technology as submitted to NAAC — programmes, accreditation, scholarships and governance.",
    icon: BadgeCheck,
    group: "Institution",
  },
  {
    slug: "naac-aqar",
    configKey: "engineeringNaacAqar",
    institution: "engineering",
    path: `${ENG}/accreditations/naac`,
    host: { anchor: "aqar-report", navLabel: "AQAR Reports" },
    label: "NAAC — AQAR Reports",
    description:
      "Annual Quality Assurance Reports and criterion evidence — a tab of the NAAC page.",
    seoLabel: "NAAC — AQAR Report",
    seoTitle: `AQAR Report | ${SUFFIX}`,
    seoDescription:
      "Annual Quality Assurance Reports (AQAR) of JCT College of Engineering & Technology with criterion-wise qualitative and quantitative metric evidence.",
    icon: Award,
    group: "Institution",
  },
  {
    slug: "financial-statements",
    configKey: "engineeringFinancialStatements",
    institution: "engineering",
    path: `${ENG}/documents`,
    host: { anchor: "financial-statements", navLabel: "Financial Statements" },
    label: "Financial Statements",
    description:
      "Year-wise balance sheets and audited statements — a tab of the Documents page.",
    seoLabel: "Financial Statements",
    seoTitle: `Financial Statements | ${SUFFIX}`,
    seoDescription:
      "Audited financial statements and year-wise balance sheets of JCT College of Engineering & Technology.",
    icon: FileSpreadsheet,
    group: "Institution",
  },
  {
    slug: "ict-content",
    configKey: "engineeringIctContent",
    institution: "engineering",
    path: `${ENG}/documents`,
    host: { anchor: "ict-content", navLabel: "ICT Content" },
    label: "ICT Content",
    description:
      "Faculty-authored e-learning material — a tab of the Documents page.",
    seoLabel: "ICT Content",
    seoTitle: `ICT Content | ${SUFFIX}`,
    seoDescription:
      "ICT-enabled teaching material authored by JCT faculty — subject-wise presentations and e-content across every department.",
    icon: MonitorPlay,
    // Hosted by the Documents page, so its card sits with Documents rather
    // than in Academics where the standalone page used to live.
    group: "Institution",
  },
  {
    slug: "nss",
    configKey: "engineeringNss",
    institution: "engineering",
    path: `${ENG}/nss`,
    label: "National Service Scheme",
    description: "NSS, Red Ribbon Club and Youth Red Cross activities.",
    seoLabel: "National Service Scheme (NSS)",
    seoTitle: `National Service Scheme (NSS) | ${SUFFIX}`,
    seoDescription:
      "The National Service Scheme unit at JCT along with the Red Ribbon Club and Youth Red Cross — objectives, activities and faculty in charge.",
    icon: HeartHandshake,
    group: "Campus & Community",
  },
  {
    slug: "feedback-system",
    configKey: "engineeringFeedbackSystem",
    institution: "engineering",
    path: `${ENG}/feedback-system`,
    label: "Feedback System",
    description: "Links to the student and staff ERP feedback portals.",
    seoLabel: "Feedback System",
    seoTitle: `Feedback System | ${SUFFIX}`,
    seoDescription:
      "Student and staff feedback portals of JCT College of Engineering & Technology, accessed through the institution's ERP.",
    icon: MessageSquare,
    group: "Institution",
  },
  {
    slug: "placement-gallery",
    configKey: "engineeringPlacementGallery",
    institution: "engineering",
    path: `${ENG}/placements`,
    host: { anchor: PLACEMENT_GALLERY_ANCHOR, navLabel: "Placement Gallery" },
    label: "Placement Gallery",
    description:
      "Drive-by-drive placement photographs — a section of the Placements page.",
    seoLabel: "Placement Gallery",
    seoTitle: `Placement Gallery | ${SUFFIX}`,
    seoDescription:
      "Photographs from campus recruitment drives and placement events at JCT College of Engineering & Technology, year by year.",
    icon: Camera,
    group: "Placements",
  },
  {
    slug: "fine-arts-club",
    configKey: "polytechnicFineArtsClub",
    institution: "polytechnic",
    path: `${POLY}/fine-arts-club`,
    label: "Fine Arts Club",
    description:
      "Movie, cultural, arts and photography clubs and their gallery.",
    seoLabel: "Fine Arts Club",
    seoTitle: `Fine Arts Club | ${POLY_SUFFIX}`,
    seoDescription:
      "The Fine Arts Club at JCT Polytechnic College — its movie, cultural, arts and photography wings, objectives and event gallery.",
    icon: Palette,
    group: "Campus & Community",
  },
];

export const CONTENT_PAGE_CONFIG_KEYS = CONTENT_PAGES.map((p) => p.configKey);

// `slug` keys the admin editor route and `configKey` keys the SiteConfig doc,
// so a duplicate of either would silently route two pages to one record. Slugs
// are global, not per-institution — two colleges can't both use "library".
for (const field of ["slug", "configKey"] as const) {
  const values = CONTENT_PAGES.map((p) => p[field]);
  const dupes = values.filter((v, i) => values.indexOf(v) !== i);
  if (dupes.length)
    throw new Error(
      `[content-pages] duplicate ${field}: ${[...new Set(dupes)].join(", ")}`,
    );
}

// A hosted page's anchor keys its panel inside the host, so two panels of the
// same host may not share one — the second would be unreachable.
{
  const byHost = new Map<string, Set<string>>();
  for (const p of CONTENT_PAGES) {
    if (!p.host) continue;
    const anchors = byHost.get(p.path) ?? new Set<string>();
    if (anchors.has(p.host.anchor))
      throw new Error(
        `[content-pages] duplicate host anchor "${p.host.anchor}" on ${p.path}`,
      );
    anchors.add(p.host.anchor);
    byHost.set(p.path, anchors);
  }
}

export function getContentPage(slug: string): ContentPageDef | undefined {
  return CONTENT_PAGES.find((p) => p.slug === slug);
}

export function contentPagesFor(institution: College): ContentPageDef[] {
  return CONTENT_PAGES.filter((p) => p.institution === institution);
}

/** Public link to a page — the host route plus its fragment when hosted. */
export function contentPageUrl(def: ContentPageDef): string {
  return def.host ? `${def.path}#${def.host.anchor}` : def.path;
}

/** The pages published as sidebar panels of `path`, in registry order. */
export function hostedContentPages(path: string): ContentPageDef[] {
  return CONTENT_PAGES.filter((p) => p.host && p.path === path);
}

/**
 * The same sidebar entries a host renders publicly, but pointing at each
 * hosted page's own editor. The admin preview shows the real sidebar this way
 * without having to load four site-config keys into one editor.
 */
export function hostedContentEditorLinks(path: string): {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}[] {
  return hostedContentPages(path).map((p) => ({
    id: p.host!.anchor,
    label: p.host!.navLabel,
    icon: p.icon,
    href: `/admin/content/${p.slug}`,
  }));
}
