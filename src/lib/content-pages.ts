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
  AlertTriangle,
  Award,
  BadgeCheck,
  BookOpen,
  BookUser,
  Camera,
  FileBarChart,
  FileSpreadsheet,
  HeartHandshake,
  HelpCircle,
  History,
  Lock,
  MessageSquare,
  MonitorPlay,
  Palette,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { College } from "@/lib/admin-nav";
import { PLACEMENT_GALLERY_ANCHOR } from "@/lib/page-anchors";
import { TRUST_NAME } from "@/lib/legal";

/**
 * Which site a page belongs to. "main" covers the institution-agnostic pages
 * served from the site root (the footer pages under /disclaimer, /privacy,
 * /terms, /faq) — they have no college, so they are edited from the Global CMS
 * section rather than a college's "Other Pages" group.
 */
export type ContentPageScope = College | "main";

export type ContentPageDef = {
  /** URL segment for the admin editor: /admin/content/<slug> */
  slug: string;
  configKey: string;
  institution: ContentPageScope;
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
};

const ENG = "/institutions/engineering";
const POLY = "/institutions/polytechnic";
const SUFFIX = "JCT College of Engineering & Technology, Coimbatore";
const POLY_SUFFIX = "JCT Polytechnic College, Coimbatore";
const MAIN_SUFFIX = "JCT Institutions";

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
  },
  {
    slug: "naac-best-practices",
    configKey: "engineeringNaacBestPractices",
    institution: "engineering",
    path: `${ENG}/naac`,
    host: { anchor: "best-practices", navLabel: "Best Practices" },
    label: "NAAC — Best Practices",
    description:
      "The institution's documented NAAC best practices — a tab of the NAAC page.",
    seoLabel: "NAAC — Institution Best Practices",
    seoTitle: `Institution Best Practices | ${SUFFIX}`,
    seoDescription:
      "NAAC institutional best practices at JCT — ERP-driven transparent governance and the student mentoring and counselling system.",
    icon: Sparkles,
  },
  {
    slug: "naac-distinctiveness",
    configKey: "engineeringNaacDistinctiveness",
    institution: "engineering",
    path: `${ENG}/naac`,
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
  },
  {
    slug: "naac-aqar",
    configKey: "engineeringNaacAqar",
    institution: "engineering",
    path: `${ENG}/naac`,
    host: { anchor: "aqar-report", navLabel: "AQAR Reports" },
    label: "NAAC — AQAR Reports",
    description:
      "Annual Quality Assurance Reports and criterion evidence — a tab of the NAAC page.",
    seoLabel: "NAAC — AQAR Report",
    seoTitle: `AQAR Report | ${SUFFIX}`,
    seoDescription:
      "Annual Quality Assurance Reports (AQAR) of JCT College of Engineering & Technology with criterion-wise qualitative and quantitative metric evidence.",
    icon: Award,
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
  },
  {
    slug: "mandatory-disclosures",
    configKey: "engineeringMandatoryDisclosures",
    institution: "engineering",
    path: `${ENG}/mandatory-disclosures`,
    label: "Mandatory Disclosures",
    description:
      "Mandatory disclosure filings — moved off the Documents page to a page of their own.",
    seoLabel: "Mandatory Disclosures",
    seoTitle: `Mandatory Disclosures | ${SUFFIX}`,
    seoDescription:
      "Mandatory disclosure filings of JCT College of Engineering & Technology, Coimbatore.",
    icon: ScrollText,
  },
  {
    slug: "hr-manual",
    configKey: "engineeringHrManual",
    institution: "engineering",
    path: `${ENG}/hr-manual`,
    label: "HR Manual",
    description:
      "The human resources manual — moved off the Documents page to a page of its own.",
    seoLabel: "HR Manual",
    seoTitle: `HR Manual | ${SUFFIX}`,
    seoDescription:
      "The human resources manual of JCT College of Engineering & Technology, Coimbatore.",
    icon: BookUser,
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
  },
  // Pages linked from the footer of every page on every site. Their copy is
  // bootstrapped into SiteConfig by `POST /api/admin/site-config/seed` (see
  // `content-page-seeds.ts`) because the text has to be live from the moment
  // the route exists — but it is read from the database like every other page,
  // never from the bundle.
  //
  // Registry order is footer order: Disclaimer, Privacy Policy, Terms &
  // Conditions, FAQ. (The footer's fifth link, Blogs, points at /blogs — the
  // Blog-model listing — so it is not a content page.)
  {
    slug: "disclaimer",
    configKey: "disclaimerPage",
    institution: "main",
    path: "/disclaimer",
    label: "Disclaimer",
    description:
      "Site-wide disclaimer — accuracy of information, liability and third-party links.",
    seoLabel: "Disclaimer",
    seoTitle: `Disclaimer | ${MAIN_SUFFIX}`,
    seoDescription: `The disclaimer governing the information published on jct.ac.in by ${TRUST_NAME} — accuracy, liability and links to external websites.`,
    icon: AlertTriangle,
  },
  {
    slug: "privacy",
    configKey: "privacyPolicyPage",
    institution: "main",
    path: "/privacy",
    label: "Privacy Policy",
    description:
      "Site-wide privacy policy — data collected, cookies, storage and contact.",
    seoLabel: "Privacy Policy",
    seoTitle: `Privacy Policy | ${MAIN_SUFFIX}`,
    seoDescription: `How ${TRUST_NAME} collects, uses, stores and protects the personal information of visitors to jct.ac.in.`,
    icon: Lock,
  },
  {
    slug: "terms",
    configKey: "termsPage",
    institution: "main",
    path: "/terms",
    label: "Terms & Conditions",
    description: "Site-wide terms of use, jurisdiction and copyright notice.",
    seoLabel: "Terms & Conditions",
    seoTitle: `Terms & Conditions | ${MAIN_SUFFIX}`,
    seoDescription: `The terms of use, jurisdiction and copyright notice governing your use of jct.ac.in, operated by ${TRUST_NAME}.`,
    icon: ScrollText,
  },
  {
    slug: "faq",
    configKey: "faqPage",
    institution: "main",
    path: "/faq",
    label: "FAQ",
    description:
      "Frequently asked questions about courses, approvals, admission and placements.",
    seoLabel: "FAQ",
    seoTitle: `Frequently Asked Questions | ${MAIN_SUFFIX}`,
    seoDescription:
      "Answers to the questions asked most often about JCT Institutions — courses offered, AICTE approval and affiliation, admission process, scholarships, placements and location.",
    icon: HelpCircle,
  },
];

/** Pages served from the site root rather than under an institution. */
export function mainContentPages(): ContentPageDef[] {
  return CONTENT_PAGES.filter((p) => p.institution === "main");
}

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
 * A hosted page is edited inside its host's editor, not at a route of its own,
 * so its inspector keys are namespaced by slug. Kept here rather than in an
 * admin component so the public layouts can build the same keys without
 * pulling the inspector into their bundle.
 */
export function hostedSectionKey(slug: string, section: string): string {
  return `hosted:${slug}:${section}`;
}

export function parseHostedSection(
  key: string,
): { slug: string; section: string } | null {
  if (!key.startsWith("hosted:")) return null;
  const rest = key.slice("hosted:".length);
  const i = rest.indexOf(":");
  if (i === -1) return { slug: rest, section: "blocks" };
  return { slug: rest.slice(0, i), section: rest.slice(i + 1) };
}

/**
 * The admin editor that owns a host route. A hosted page has no editor of its
 * own any more, so `/admin/content/<slug>` sends the reader here instead.
 */
const HOST_ADMIN_EDITORS: Record<string, string> = {
  [`${ENG}/about`]: "/admin/about?college=engineering",
  [`${ENG}/documents`]: "/admin/documents",
  [`${ENG}/naac`]: "/admin/naac",
  [`${ENG}/placements`]: "/admin/placements-page?college=engineering",
};

export function hostAdminEditor(def: ContentPageDef): string | undefined {
  return def.host ? HOST_ADMIN_EDITORS[def.path] : undefined;
}
