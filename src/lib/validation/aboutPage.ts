import { z } from "zod";
import { SidebarNavItemSchema } from "./sidebarNav";

// ─── Shared sub-schemas ──────────────────────────────────────────────────────

const s = (max: number) => z.string().max(max).default("");

const PersonWithBioSchema = z.object({
  name: s(120),
  role: s(120),
  image: s(500),
  bio: s(2000),
});

const HodMemberSchema = z.object({
  name: s(120),
  designation: s(120),
  dept: s(200),
  abbr: s(20),
  avatar: s(500),
});

const CouncilMemberSchema = z.object({
  name: s(200),
  category: s(200),
});

const ValueItemSchema = z.object({
  title: s(100),
  desc: s(500),
});

const AccreditationSchema = z.object({
  name: s(100),
  desc: s(100),
  logo: s(500),
});

const StatSchema = z.object({
  value: s(30),
  label: s(50),
});

const HighlightSchema = z.object({
  title: s(100),
  desc: s(500),
});

const InstitutionInfoSchema = z.object({
  paragraphs: z.array(s(2000)).default([]),
  stats: z.array(StatSchema).default([]),
});

const VisionMissionSchema = z.object({
  visionText: s(2000),
  missionPoints: z.array(s(500)).default([]),
  qualityPolicy: s(2000),
});

const PrincipalSchema = z.object({
  name: s(120),
  role: s(100),
  institution: s(200),
  image: s(500),
  quote: s(1000),
  messages: z.array(s(2000)).default([]),
});

const ManagementSchema = z.object({
  description: s(1000),
  members: z.array(PersonWithBioSchema).default([]),
});

const HodSchema = z.object({
  description: s(1000),
  members: z.array(HodMemberSchema).default([]),
});

const GoverningCouncilSchema = z.object({
  description: s(1000),
  members: z.array(CouncilMemberSchema).default([]),
});

const QuickFactSchema = z.object({
  label: s(60),
  value: s(120),
});

const AboutSidebarSchema = z.object({
  quickFacts: z.array(QuickFactSchema).default([]),
  counsellingCode: s(20),
  ctaLabel: s(40),
  ctaHref: s(500),
  navItems: z.array(SidebarNavItemSchema).optional(),
});

const ABOUT_SIDEBAR_DEFAULT = {
  quickFacts: [],
  counsellingCode: "",
  ctaLabel: "",
  ctaHref: "",
};

// ─── Engineering About ───────────────────────────────────────────────────────

export const EngineeringAboutSchema = z.object({
  hero: z
    .object({
      title: s(200),
      subtitle: s(500),
    })
    .default({ title: "", subtitle: "" }),
  about: InstitutionInfoSchema.default({ paragraphs: [], stats: [] }),
  visionMission: VisionMissionSchema.default({
    visionText: "",
    missionPoints: [],
    qualityPolicy: "",
  }),
  principal: PrincipalSchema.default({
    name: "",
    role: "",
    institution: "",
    image: "",
    quote: "",
    messages: [],
  }),
  management: ManagementSchema.default({ description: "", members: [] }),
  hod: HodSchema.default({ description: "", members: [] }),
  governingCouncil: GoverningCouncilSchema.default({
    description: "",
    members: [],
  }),
  coreValues: z.array(ValueItemSchema).default([]),
  accreditations: z.array(AccreditationSchema).default([]),
  campusHighlights: z.array(HighlightSchema).default([]),
  whyJct: z.array(s(300)).default([]),
  sidebar: AboutSidebarSchema.default(ABOUT_SIDEBAR_DEFAULT),
});

export type EngineeringAboutValue = z.infer<typeof EngineeringAboutSchema>;

/** Union alias — all three institution About pages share the same schema shape. */
export type AboutPageValue = EngineeringAboutValue;

// ─── Arts & Science About ─────────────────────────────────────────────────────

export const ArtsScienceAboutSchema = z.object({
  hero: z
    .object({
      title: s(200),
      subtitle: s(500),
    })
    .default({ title: "", subtitle: "" }),
  about: InstitutionInfoSchema.default({ paragraphs: [], stats: [] }),
  visionMission: VisionMissionSchema.default({
    visionText: "",
    missionPoints: [],
    qualityPolicy: "",
  }),
  principal: PrincipalSchema.default({
    name: "",
    role: "",
    institution: "",
    image: "",
    quote: "",
    messages: [],
  }),
  management: ManagementSchema.default({ description: "", members: [] }),
  hod: HodSchema.default({ description: "", members: [] }),
  governingCouncil: GoverningCouncilSchema.default({
    description: "",
    members: [],
  }),
  coreValues: z.array(ValueItemSchema).default([]),
  accreditations: z.array(AccreditationSchema).default([]),
  campusHighlights: z.array(HighlightSchema).default([]),
  whyJct: z.array(s(300)).default([]),
  sidebar: AboutSidebarSchema.default(ABOUT_SIDEBAR_DEFAULT),
});

export type ArtsScienceAboutValue = z.infer<typeof ArtsScienceAboutSchema>;

// ─── Polytechnic About ────────────────────────────────────────────────────────

export const PolytechnicAboutSchema = z.object({
  hero: z
    .object({
      title: s(200),
      subtitle: s(500),
    })
    .default({ title: "", subtitle: "" }),
  about: InstitutionInfoSchema.default({ paragraphs: [], stats: [] }),
  visionMission: VisionMissionSchema.default({
    visionText: "",
    missionPoints: [],
    qualityPolicy: "",
  }),
  principal: PrincipalSchema.default({
    name: "",
    role: "",
    institution: "",
    image: "",
    quote: "",
    messages: [],
  }),
  management: ManagementSchema.default({ description: "", members: [] }),
  hod: HodSchema.default({ description: "", members: [] }),
  governingCouncil: GoverningCouncilSchema.default({
    description: "",
    members: [],
  }),
  coreValues: z.array(ValueItemSchema).default([]),
  accreditations: z.array(AccreditationSchema).default([]),
  campusHighlights: z.array(HighlightSchema).default([]),
  whyJct: z.array(s(300)).default([]),
  sidebar: AboutSidebarSchema.default(ABOUT_SIDEBAR_DEFAULT),
});

export type PolytechnicAboutValue = z.infer<typeof PolytechnicAboutSchema>;

// ─── Main (JCT Group) About ──────────────────────────────────────────────────
// Same shape as institution About pages — sections like HOD and Governing
// Council will simply be empty and hidden on the public page.

export const MainAboutSchema = z.object({
  hero: z
    .object({
      title: s(200),
      subtitle: s(500),
    })
    .default({ title: "", subtitle: "" }),
  about: InstitutionInfoSchema.default({ paragraphs: [], stats: [] }),
  visionMission: VisionMissionSchema.default({
    visionText: "",
    missionPoints: [],
    qualityPolicy: "",
  }),
  principal: PrincipalSchema.default({
    name: "",
    role: "",
    institution: "",
    image: "",
    quote: "",
    messages: [],
  }),
  management: ManagementSchema.default({ description: "", members: [] }),
  hod: HodSchema.default({ description: "", members: [] }),
  governingCouncil: GoverningCouncilSchema.default({
    description: "",
    members: [],
  }),
  coreValues: z.array(ValueItemSchema).default([]),
  accreditations: z.array(AccreditationSchema).default([]),
  campusHighlights: z.array(HighlightSchema).default([]),
  whyJct: z.array(s(300)).default([]),
  sidebar: AboutSidebarSchema.default(ABOUT_SIDEBAR_DEFAULT),
});

export type MainAboutValue = z.infer<typeof MainAboutSchema>;

// ─── COE Page ─────────────────────────────────────────────────────────────────

const CoePhaseSchema = z.object({
  name: s(100),
  subtitle: s(100),
  items: z.array(s(500)).default([]),
});

const CoeFormSchema = z.object({
  title: s(200),
  desc: s(1000),
  href: s(500),
});

const CoeGovernanceSchema = z.object({
  title: s(100),
  desc: s(500),
});

export const CoePageSchema = z.object({
  hero: z
    .object({
      title: s(200),
      subtitle: s(500),
    })
    .default({ title: "", subtitle: "" }),
  overview: z
    .object({
      paragraphs: z.array(s(2000)).default([]),
      controller: z
        .object({
          name: s(120),
          title: s(120),
          qual: s(50),
          image: s(500),
          quote: s(1000),
          messages: z.array(s(2000)).default([]),
        })
        .default({
          name: "",
          title: "",
          qual: "",
          image: "",
          quote: "",
          messages: [],
        }),
      governance: z.array(CoeGovernanceSchema).default([]),
    })
    .default({
      paragraphs: [],
      controller: {
        name: "",
        title: "",
        qual: "",
        image: "",
        quote: "",
        messages: [],
      },
      governance: [],
    }),
  responsibilities: z
    .object({
      phases: z.array(CoePhaseSchema).default([]),
    })
    .default({ phases: [] }),
  obe: z
    .object({
      heading: s(200),
      quote: s(1000),
      paragraphs: z.array(s(2000)).default([]),
    })
    .default({ heading: "", quote: "", paragraphs: [] }),
  downloads: z
    .object({
      description: s(1000),
      forms: z.array(CoeFormSchema).default([]),
    })
    .default({ description: "", forms: [] }),
  sidebar: z
    .object({
      quickFacts: z.array(QuickFactSchema).default([]),
      ctaLabel: s(40),
      ctaHref: s(500),
      navItems: z.array(SidebarNavItemSchema).optional(),
    })
    .default({ quickFacts: [], ctaLabel: "", ctaHref: "" }),
});

export type CoePageValue = z.infer<typeof CoePageSchema>;
