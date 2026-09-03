import type {
  AddOnProgramsValue,
  CareerCentreValue,
} from "@/lib/validation/artsScienceSections";

/**
 * Starting content for the two Arts & Science-only landing sections.
 *
 * One source for both doors into these keys: the admin form uses it as the
 * `defaultValue` an unseeded key opens with, and
 * `POST /api/admin/site-config/seed` writes the same object (insert-only, so
 * re-seeding never reverts edited copy).
 */
export const ARTS_SCIENCE_ADD_ON_PROGRAMS_DEFAULT: AddOnProgramsValue = {
  enabled: true,
  eyebrow: "Add-on Programs",
  title: "Skills that stack onto your",
  titleHighlight: "degree",
  description:
    "Industry-aligned certificate tracks taken alongside the UG program — taught on campus and assessed by practitioners.",
  groups: [
    {
      icon: "Plane",
      title: "Aviation",
      description:
        "Airline and airport operations training for cabin, cargo and ground roles.",
      items: [
        "Air Cargo",
        "Ground Handling",
        "Cabin Crew",
        "Ticketing & Reservation",
      ],
    },
    {
      icon: "Cpu",
      title: "Emerging Technologies & Digital Skills",
      description: "Hands-on tracks in the tools industry hires for today.",
      items: [
        "AI & Data Science",
        "AI & Machine Learning",
        "Cyber Security",
        "Cloud Computing",
        "Hardware & Networking",
      ],
    },
  ],
  ctaLabel: "",
  ctaHref: "",
};

export const ARTS_SCIENCE_CAREER_CENTRE_DEFAULT: CareerCentreValue = {
  enabled: true,
  eyebrow: "Career Development Centre",
  title: "Guidance from first year to",
  titleHighlight: "first job",
  description:
    "The Career Development Centre works with every student on what comes after the degree — higher studies, competitive exams, a venture of their own, or a placement offer.",
  services: [
    {
      icon: "GraduationCap",
      title: "Higher Education – India",
      description:
        "Course, college and entrance guidance for PG admissions across India.",
    },
    {
      icon: "Globe",
      title: "Higher Education – Abroad",
      description:
        "University shortlisting, applications, language tests and visa support.",
    },
    {
      icon: "FileText",
      title: "Competitive Examinations",
      description:
        "Coaching and practice for banking, civil services, TNPSC and UGC-NET.",
    },
    {
      icon: "Rocket",
      title: "Entrepreneurship",
      description:
        "Idea validation, business planning and mentoring for student ventures.",
    },
    {
      icon: "Briefcase",
      title: "Campus Placements",
      description:
        "Recruiter drives, aptitude training and mock interviews via the placement cell.",
    },
    {
      icon: "Compass",
      title: "Career Counselling & Guidance",
      description:
        "One-to-one counselling on aptitude, strengths and career direction.",
    },
    {
      icon: "Building2",
      title: "Internship & Industry Exposure",
      description:
        "Internships, industrial visits and live projects with partner companies.",
    },
    {
      icon: "BadgeCheck",
      title: "Professional Certifications",
      description:
        "Value-added certification courses recognised by industry bodies.",
    },
  ],
  ctaLabel: "",
  ctaHref: "",
};
