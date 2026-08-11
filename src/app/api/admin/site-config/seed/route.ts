import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateForConfigKey } from "@/lib/revalidate";
import { CONTENT_PAGE_SEEDS } from "@/lib/content-page-seeds";
import { getContentPage } from "@/lib/content-pages";
import { ContentPageSchema } from "@/lib/validation";

// Image values below are deliberately empty. They used to be hardcoded
// /campus-life-assets/*.webp paths under a /public directory that no longer
// exists in the repo, so every seeded section rendered a broken image.
//
// Seed data does not pin assets at all now. Pictures are chosen in the CMS,
// which stores an object-storage key resolved at render time by getImageUrl()
// against NEXT_PUBLIC_STORAGE_PUBLIC_URL. Every image field here is optional
// (`zUrl.default("")`), so an unset one renders nothing rather than a broken
// frame, and an editor filling it in is the normal path — not an override of a
// baked-in default.
type Seed = {
  config_key: string;
  value: Record<string, unknown>;
  /** When true, the seed is also published (value copied to published_value). */
  publish?: boolean;
  /**
   * Insert only — never overwrite an existing document, even when published.
   *
   * `publish` alone is not enough for the statutory footer pages: they must be
   * live the moment the key exists (so `published_value` has to be set), and
   * they must never be reverted by someone re-running the seed after an editor
   * has rewritten them. Those two requirements are independent, so they are two
   * flags.
   */
  insertOnly?: boolean;
};

const PLACEMENT_HIGHLIGHTS_DEFAULT = {
  show_section: true,
  eyebrow: "Career Outcomes",
  title: "Our Students Work At",
  titleHighlight: "World-Class Companies",
  description:
    "Top recruiters visit our campus every year, offering our graduates rewarding careers across industries.",
  stats: [
    { icon: "Briefcase", value: "500+", label: "Recruiters" },
    { icon: "TrendingUp", value: "45 LPA", label: "Highest Package" },
    { icon: "Users", value: "95%", label: "Placement Rate" },
    { icon: "Award", value: "8.5 LPA", label: "Average Package" },
  ],
};

const PLACEMENT_HIGHLIGHTS_KEYS = [
  "mainPlacementHighlights",
  "engineeringPlacementHighlights",
  "artsSciencePlacementHighlights",
  "polytechnicPlacementHighlights",
] as const;

/**
 * The four footer pages (`/disclaimer`, `/privacy`, `/terms`, `/faq`).
 *
 * Published on insert because a statutory page must not be live-but-blank, and
 * `insertOnly` because re-running the seed must never revert edited legal copy.
 * The slug → config key mapping comes from the page registry rather than being
 * repeated here, so adding a footer page in one place cannot miss the other.
 */
const CONTENT_PAGE_SEED_ENTRIES: Seed[] = Object.entries(
  CONTENT_PAGE_SEEDS,
).flatMap(([slug, value]) => {
  const def = getContentPage(slug);
  if (!def) return [];
  return [
    {
      config_key: def.configKey,
      value: ContentPageSchema.parse(value) as Record<string, unknown>,
      publish: true,
      insertOnly: true,
    },
  ];
});

const SEEDS: Seed[] = [
  ...CONTENT_PAGE_SEED_ENTRIES,
  // Placement Highlights section copy — one per scope. publish:false so an
  // existing (or migrated) value is never clobbered when re-seeding.
  ...PLACEMENT_HIGHLIGHTS_KEYS.map((config_key) => ({
    config_key,
    value: PLACEMENT_HIGHLIGHTS_DEFAULT,
    publish: false,
  })),
  {
    config_key: "homeStats",
    value: {
      yearsOfExcellence: "60+",
      alumni: "15,000+",
      studentsPlaced: "98%",
      industryAwards: "50+",
    },
  },
  // About pages — empty placeholders, to be filled in via the admin CMS
  {
    config_key: "engineeringAbout",
    value: {},
    publish: false,
  },
  {
    config_key: "artsScienceAbout",
    value: {},
    publish: false,
  },
  {
    config_key: "polytechnicAbout",
    value: {},
    publish: false,
  },
  // COE page — empty placeholder
  {
    config_key: "engineeringCoe",
    value: {},
    publish: false,
  },
  // Campus Life page — seeded with default content matching the original design
  {
    config_key: "campusLifePage",
    value: {
      hero: {
        backgroundImage: "",
        title: "Life @ JCT",
        subtitle: "A vibrant ecosystem where heritage meets innovation.",
      },
      experience: {
        eyebrow: "The JCT Advantage",
        title: "Experience the",
        titleHighlight: "Extraordinary",
        body: "At JCT Institutions, we believe that education extends far beyond the four walls of a classroom. Our campus is a living laboratory where students evolve into leaders.",
        image: "",
        features: [
          {
            icon: "Users",
            title: "Cultural Melting Pot",
            desc: "Students from across India and beyond.",
          },
          {
            icon: "Star",
            title: "Western Ghats Views",
            desc: "Serene foothills of Pichanur.",
          },
          {
            icon: "Zap",
            title: "Holistic Development",
            desc: "Equal focus on EQ and IQ.",
          },
          {
            icon: "ShieldCheck",
            title: "Safe & Secure",
            desc: "24/7 campus-wide monitoring.",
          },
        ],
      },
      highlights: {
        items: [
          {
            title: "Student Hub",
            image: "",
          },
          {
            title: "Central Library",
            image: "",
          },
          {
            title: "Innovation Lab",
            image: "",
          },
          {
            title: "Sports Complex",
            image: "",
          },
          {
            title: "Smart Classrooms",
            image: "",
          },
          {
            title: "Research Excellence",
            image: "",
          },
          {
            title: "Student Activities",
            image: "",
          },
        ],
      },
      services: {
        eyebrow: "Premium Facilities",
        title: "Essential Support",
        subtitle:
          "Premium facilities designed for the comfort and efficiency of our students.",
        items: [
          {
            title: "Hostel Facilities",
            desc: "A home away from home with multi-cuisine dining, Wi-Fi, and 24/7 care.",
            image: "",
            icon: "Home",
            points: [
              "Separate Boys/Girls Hostels",
              "Gym & Recreation Rooms",
              "Medical Assistance 24/7",
            ],
          },
          {
            title: "Transport Network",
            desc: "Extensive fleet connecting Coimbatore and Palakkad with real-time GPS tracking.",
            image: "",
            icon: "Bus",
            points: [
              "CCTV & GPS Enabled",
              "Experienced Drivers",
              "Punctual Route Management",
            ],
          },
          {
            title: "Industry-Ready Labs",
            desc: "Specialized research spaces equipped with the latest technology.",
            image: "",
            icon: "Microscope",
            points: [
              "NABL Standards",
              "Technical Support Team",
              "Advanced Computing Center",
            ],
          },
        ],
      },
      sports: {
        eyebrow: "Athletics & Fitness",
        title: "Unleash Your",
        titleHighlight: "Spirit",
        body: "A healthy body fuels a sharp mind. Our campus is built to push boundaries, fostering character and teamwork through every game.",
        stats: [
          { label: "Cricket & Football", val: "5+ Grounds" },
          { label: "Indoor Games", val: "10+ Disciplines" },
          { label: "Annual Trophies", val: "150+" },
          { label: "Fitness Training", val: "NCA Certified" },
        ],
        images: [],
        highlightTitle: "Annual Sports Meet",
        highlightDesc:
          "A celebration of talent and grit with over 2000+ participants.",
      },
      clubs: {
        eyebrow: "Community & Arts",
        title: "Life in Full Color",
        featuredImage: "",
        featuredTitle: "The Arts & Music Club",
        featuredDesc:
          "Where creativity knows no bounds. Our members jam, perform, and collaborate across disciplines, making every day a performance.",
        tags: ["Music", "Dance", "Fine Arts", "Drama"],
        events: [
          {
            icon: "Zap",
            title: "JCTantra",
            description:
              "National level technical symposium showcasing the convergence of technical brilliance and innovation.",
          },
          {
            icon: "Music",
            title: "Dhwani",
            description:
              "The heart of JCT culture. A two-day carnival celebrating music, dance, and theatrical arts.",
          },
        ],
      },
      cta: {
        title: "Ready to Start Your Journey?",
        description:
          "Join a community of visionaries and leaders. Admissions are now open for the upcoming academic year.",
        ctaLabel: "Apply Now",
        ctaHref: "https://admissions.jct.ac.in/",
      },
    },
    publish: true,
  },
];

export async function POST(req: NextRequest) {
  // Admin-only: this route overwrites a fixed set of config keys with `$set`,
  // including global keys (campusLifePage, homeStats) and other colleges'
  // About pages. An institution-scoped editor must not be able to reset
  // content outside their own college — gate it the same as the other seeds.
  const { session, error } = await requireRole(req, "admin");
  if (error) return error;

  try {
    await connectDB();

    // The one-shot migration that cloned the old global `recruitersSection`
    // into the four per-scope PlacementHighlights keys lived here. All four
    // exist and are published, so it could only ever skip them, and the key it
    // read has been retired (see RETIRED_CONFIG_KEYS in src/lib/restore.ts).

    for (const seed of SEEDS) {
      const fields: Record<string, unknown> = {
        value: seed.value,
        updated_by: session!.user?.email ?? "",
        status: seed.publish ? "published" : "draft",
      };
      if (seed.publish) fields.published_value = seed.value;

      // publish:true                   → always overwrite (admin is explicitly re-seeding live content)
      // publish:false or insertOnly    → only insert if the doc is missing; never clobber stored content
      const update =
        seed.publish && !seed.insertOnly
          ? { $set: fields, $inc: { version: 1 } }
          : {
              $setOnInsert: {
                config_key: seed.config_key,
                version: 1,
                ...fields,
              },
            };

      await SiteConfig.findOneAndUpdate(
        { config_key: seed.config_key },
        update,
        {
          upsert: true,
          returnDocument: "after",
        },
      );
      revalidateForConfigKey(seed.config_key);
    }

    await logAudit(
      "site-config",
      "seeded",
      session!.user?.email ?? "",
      "Seeded site config keys (footer content pages, homeStats, About pages, COE page, Campus Life page)",
    );

    return json({ message: "Default content seeded successfully." });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
