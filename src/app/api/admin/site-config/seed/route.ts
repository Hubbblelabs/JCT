import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteConfig } from "@/lib/models";
import { requireRole, json, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";
import { revalidateForConfigKey } from "@/lib/revalidate";

type Seed = {
  config_key: string;
  value: Record<string, unknown>;
  /** When true, the seed is also published (value copied to published_value). */
  publish?: boolean;
};

const SEEDS: Seed[] = [
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
        backgroundImage: "/campus-life-assets/jct-life1.webp",
        title: "Life @ JCT",
        subtitle: "A vibrant ecosystem where heritage meets innovation.",
      },
      experience: {
        eyebrow: "The JCT Advantage",
        title: "Experience the",
        titleHighlight: "Extraordinary",
        body: "At JCT Institutions, we believe that education extends far beyond the four walls of a classroom. Our campus is a living laboratory where students evolve into leaders.",
        image: "/campus-life-assets/building1.webp",
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
          { title: "Student Hub", image: "/campus-life-assets/jct-life2.webp" },
          {
            title: "Central Library",
            image: "/campus-life-assets/library1.webp",
          },
          {
            title: "Innovation Lab",
            image: "/campus-life-assets/computer-lab2.webp",
          },
          {
            title: "Sports Complex",
            image: "/campus-life-assets/sports1.webp",
          },
          {
            title: "Smart Classrooms",
            image: "/campus-life-assets/classroom1.webp",
          },
          {
            title: "Research Excellence",
            image: "/campus-life-assets/electronics-lab.webp",
          },
          {
            title: "Student Activities",
            image: "/campus-life-assets/arts-club3.webp",
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
            image: "/campus-life-assets/hostel.webp",
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
            image: "/campus-life-assets/transport.webp",
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
            image: "/campus-life-assets/electronics-lab.webp",
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
          "/campus-life-assets/sports1.webp",
          "/campus-life-assets/sports4.webp",
          "/campus-life-assets/sports3.webp",
          "/campus-life-assets/sports2.webp",
        ],
        highlightTitle: "Annual Sports Meet",
        highlightDesc:
          "A celebration of talent and grit with over 2000+ participants.",
      },
      clubs: {
        eyebrow: "Community & Arts",
        title: "Life in Full Color",
        featuredImage: "/campus-life-assets/arts-club1.webp",
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
          new: true,
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
