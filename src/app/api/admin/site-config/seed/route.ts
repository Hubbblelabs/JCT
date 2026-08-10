import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateForConfigKey } from "@/lib/revalidate";

// Image values below are object-storage keys ("images/…"), resolved at render
// time by getImageUrl() against NEXT_PUBLIC_STORAGE_PUBLIC_URL. They used to be
// site-relative paths under /public/campus-life-assets, a directory that no
// longer exists — so every seeded section rendered a broken image. Keys keep
// working across a CDN change; absolute URLs would not.
type Seed = {
  config_key: string;
  value: Record<string, unknown>;
  /** When true, the seed is also published (value copied to published_value). */
  publish?: boolean;
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

const SEEDS: Seed[] = [
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
        backgroundImage: "images/1779681845079-jct-life1.webp",
        title: "Life @ JCT",
        subtitle: "A vibrant ecosystem where heritage meets innovation.",
      },
      experience: {
        eyebrow: "The JCT Advantage",
        title: "Experience the",
        titleHighlight: "Extraordinary",
        body: "At JCT Institutions, we believe that education extends far beyond the four walls of a classroom. Our campus is a living laboratory where students evolve into leaders.",
        image: "images/1779681845424-building1.webp",
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
            image: "images/1779690712543-jct-life2.webp",
          },
          {
            title: "Central Library",
            image: "images/1779702354155-library2.webp",
          },
          {
            title: "Innovation Lab",
            image: "images/1779690766578-computer-lab2.webp",
          },
          {
            title: "Sports Complex",
            image: "images/1779681521509-sports1.webp",
          },
          {
            title: "Smart Classrooms",
            image: "images/1779702353982-classroom2.webp",
          },
          {
            title: "Research Excellence",
            image: "images/1779680996501-electronics-lab.webp",
          },
          {
            title: "Student Activities",
            image: "images/1779702353753-arts-club3.webp",
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
            image: "images/1779681522847-campus2.webp",
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
            image: "images/1779702736524-transport.webp",
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
            image: "images/1779680996501-electronics-lab.webp",
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
        images: [
          "images/1779681521509-sports1.webp",
          "images/1779681524285-sports4.webp",
          "images/1779681524381-sports3.webp",
          "images/1779681520313-sports2.webp",
        ],
        highlightTitle: "Annual Sports Meet",
        highlightDesc:
          "A celebration of talent and grit with over 2000+ participants.",
      },
      clubs: {
        eyebrow: "Community & Arts",
        title: "Life in Full Color",
        featuredImage: "images/1779703072113-arts-club1.webp",
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

    // Migration: the old single global `recruitersSection` copy is now split
    // into 4 per-scope keys. Clone its value into any new key that doesn't yet
    // exist so no edited copy is lost. Published so it shows immediately.
    const legacy = await SiteConfig.findOne({
      config_key: "recruitersSection",
    }).lean<{ value?: unknown; published_value?: unknown } | null>();
    const legacyValue = legacy?.published_value ?? legacy?.value;
    if (legacyValue) {
      for (const key of PLACEMENT_HIGHLIGHTS_KEYS) {
        const exists = await SiteConfig.exists({ config_key: key });
        if (exists) continue;
        await SiteConfig.create({
          config_key: key,
          value: legacyValue,
          published_value: legacyValue,
          status: "published",
          version: 1,
          updated_by: session!.user?.email ?? "",
        });
        revalidateForConfigKey(key);
      }
    }

    for (const seed of SEEDS) {
      const fields: Record<string, unknown> = {
        value: seed.value,
        updated_by: session!.user?.email ?? "",
        status: seed.publish ? "published" : "draft",
      };
      if (seed.publish) fields.published_value = seed.value;

      // publish:true  → always overwrite (admin is explicitly re-seeding live content)
      // publish:false → only insert if the doc is missing; never clobber published content
      const update = seed.publish
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
      "Seeded site config keys (homeStats, About pages, COE page, Campus Life page)",
    );

    return json({ message: "Default content seeded successfully." });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
