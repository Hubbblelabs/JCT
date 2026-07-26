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
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { College } from "@/lib/admin-nav";

export type ContentPageDef = {
  /** URL segment for the admin editor: /admin/content/<slug> */
  slug: string;
  configKey: string;
  institution: College;
  /** Public route this page is published at. */
  path: string;
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
const SUFFIX = "JCT College of Engineering & Technology, Coimbatore";

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
    path: `${ENG}/nirf`,
    label: "NIRF",
    description: "NIRF rankings reports and feedback contact.",
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
    path: `${ENG}/timeline`,
    label: "Timeline",
    description: "Year-by-year milestones since the college was founded.",
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
    path: `${ENG}/accreditations/naac/best-practices`,
    label: "NAAC — Best Practices",
    description: "The institution's documented NAAC best practices.",
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
    path: `${ENG}/accreditations/naac/institutional-distinctiveness`,
    label: "NAAC — Distinctiveness",
    description: "What sets the institution apart, as filed with NAAC.",
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
    path: `${ENG}/accreditations/naac/aqar-report`,
    label: "NAAC — AQAR Reports",
    description: "Annual Quality Assurance Reports and criterion evidence.",
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
    path: `${ENG}/financial-statements`,
    label: "Financial Statements",
    description: "Year-wise balance sheets and audited statements.",
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
    path: `${ENG}/ict-content`,
    label: "ICT Content",
    description: "Faculty-authored e-learning material, subject by subject.",
    seoLabel: "ICT Content",
    seoTitle: `ICT Content | ${SUFFIX}`,
    seoDescription:
      "ICT-enabled teaching material authored by JCT faculty — subject-wise presentations and e-content across every department.",
    icon: MonitorPlay,
    group: "Academics",
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
    path: `${ENG}/placements/gallery`,
    label: "Placement Gallery",
    description: "Drive-by-drive placement photographs, grouped by year.",
    seoLabel: "Placement Gallery",
    seoTitle: `Placement Gallery | ${SUFFIX}`,
    seoDescription:
      "Photographs from campus recruitment drives and placement events at JCT College of Engineering & Technology, year by year.",
    icon: Camera,
    group: "Placements",
  },
];

export const CONTENT_PAGE_CONFIG_KEYS = CONTENT_PAGES.map((p) => p.configKey);

export function getContentPage(slug: string): ContentPageDef | undefined {
  return CONTENT_PAGES.find((p) => p.slug === slug);
}

export function contentPagesFor(institution: College): ContentPageDef[] {
  return CONTENT_PAGES.filter((p) => p.institution === institution);
}
