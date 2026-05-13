export const homeHeroContent = {
  backgroundImages: [
    "/site_assests/banner2.jpeg",
    "/site_assests/future-banner.webp",
    "/site_assests/facility-bg.jpg.jpeg",
  ],
  titleLines: ["One Campus.", "Three Pathways.", "Unlimited Futures."],
  ctas: [
    {
      label: "Apply Now",
      href: "https://admissions.jct.ac.in",
      primary: true,
    },
    {
      label: "Take a Virtual Campus Tour",
      href: "#campus-tour",
      primary: false,
    },
  ],
  trustHighlights: [
    { icon: "laurel", label: "NAAC Accredited" },
    { icon: "users", label: "100+ Recruiters" },
    { icon: "cap", label: "10,000+ Students" },
    { icon: "badge", label: "98% Placement Rate" },
  ],
  cards: [
    {
      title: "Engineering & Technology (Autonomous)",
      description:
        "Cutting-edge curriculum and facilities for future engineers.",
      href: "/institutions/engineering",
      icon: "engineering",
      ctaLabel: "Explore",
      highlights: "200+ Lab Facilities | Top 10 Rankings",
    },
    {
      title: "Arts & Science",
      description:
        "Diverse programs fostering creativity and critical thinking.",
      href: "/institutions/arts-science",
      icon: "arts",
      ctaLabel: "Explore",
      highlights: "Research Excellence | Industry Partnerships",
    },
    {
      title: "Polytechnic",
      description: "Practical, hands-on training for technical excellence.",
      href: "/institutions/polytechnic",
      icon: "polytechnic",
      ctaLabel: "Explore",
      highlights: "Industry-Aligned Skills | 50+ Partner Companies",
    },
  ] satisfies {
    title: string;
    description: string;
    href: string;
    icon: "engineering" | "arts" | "polytechnic";
    ctaLabel: string;
    highlights: string;
  }[],
} as const;
