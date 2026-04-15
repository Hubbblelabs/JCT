export type HomeHeroCardIcon = "engineering" | "arts" | "polytechnic";

export type HomeHeroCard = {
  title: string;
  description: string;
  href: string;
  icon: HomeHeroCardIcon;
  ctaLabel: string;
  highlights: string;
};

export const homeHeroContent = {
  backgroundImage: "/site_assests/facility-bg.jpg.jpeg",
  titleLines: ["One Campus.", "Three Pathways.", "Unlimited Futures."],
  ctas: [
    {
      label: "Apply Now",
      href: "/admissions/apply",
      primary: true,
    },
    {
      label: "Enquire Admissions",
      href: "#admissions",
      primary: false,
    },
  ],
  trustHighlights: [
    { icon: "laurel", label: "NAAC Accredited" },
    { icon: "users", label: "100+ Recruiters" },
    { icon: "cap", label: "10,000+ Students" },
    { icon: "growth", label: "95% Placement Rate" },
  ],
  cards: [
    {
      title: "Engineering College",
      description:
        "Cutting-edge curriculum and facilities for future engineers.",
      href: "/institutions/engineering",
      icon: "engineering",
      ctaLabel: "Explore",
      highlights: "200+ Lab Facilities | Top 10 Rankings",
    },
    {
      title: "Arts & Science College",
      description:
        "Diverse programs fostering creativity and critical thinking.",
      href: "/institutions/arts-science",
      icon: "arts",
      ctaLabel: "Explore",
      highlights: "Research Excellence | Industry Partnerships",
    },
    {
      title: "Polytechnic College",
      description: "Practical, hands-on training for technical excellence.",
      href: "/institutions/polytechnic",
      icon: "polytechnic",
      ctaLabel: "Explore",
      highlights: "Industry-Aligned Skills | 50+ Partner Companies",
    },
  ] satisfies HomeHeroCard[],
} as const;
