export type NavChild = {
  name: string;
  href: string;
  desc?: string;
  className?: string;
};

export type NavItem = {
  name: string;
  href: string;
  className?: string;
  children?: NavChild[];
};

export const mainNavigation: NavItem[] = [
  { name: "Home", href: "/" },
  {
    name: "Institutions",
    href: "#",
    children: [
      {
        name: "Engineering (Autonomous)",
        href: "/institutions/engineering",
        desc: "B.E, B.Tech, M.E, Ph.D programs",
      },
      {
        name: "Arts & Science",
        href: "/institutions/arts-science",
        desc: "B.A, B.Sc, B.Com, BBA programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Diploma programs",
      },
    ],
  },
  { name: "Admissions", href: "/admissions" },
  { name: "Placements", href: "/placements" },
  { name: "Life @ JCT", href: "/campus-life" },
  {
    name: "More",
    href: "#",
    children: [
      { name: "About", href: "/about", desc: "Our story & leadership" },
      { name: "Alumni", href: "/alumni", desc: "Connect with our network" },
      { name: "Careers", href: "/careers", desc: "Join our team" },
      { name: "Contact", href: "/contact", desc: "Get in touch" },
      {
        name: "Governance",
        href: "/governance",
        desc: "Cells & committees",
      },
      {
        name: "Leadership",
        href: "/leadership",
        desc: "Management & council",
      },
      {
        name: "Mandatory Disclosure",
        href: "/mandatory-disclosure",
        desc: "Policies & compliance",
      },
      { name: "Media", href: "/media", desc: "News & gallery" },
      {
        name: "Quality",
        href: "/quality",
        desc: "Accreditations & IQAC",
      },
      {
        name: "Research",
        href: "/research",
        desc: "R&D, CoE & publications",
      },
    ],
  },
];

export const engineeringNavigation: NavItem[] = [
  { name: "Home", href: "/institutions/engineering#top" },
  {
    name: "Institutions",
    href: "#",
    children: [
      {
        name: "Engineering (Autonomous)",
        href: "/institutions/engineering",
        desc: "B.E, B.Tech, M.E, Ph.D programs",
      },
      {
        name: "Arts & Science",
        href: "/institutions/arts-science",
        desc: "B.A, B.Sc, B.Com, BBA programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Diploma programs",
      },
    ],
  },
  {
    name: "Programs",
    href: "/institutions/engineering#programs",
  },
  {
    name: "Admissions",
    href: "/institutions/engineering/admissions",
  },
  {
    name: "Placements",
    href: "/placements",
  },
  {
    name: "Life @ JCT",
    href: "/campus-life",
  },
  {
    name: "More",
    href: "#",
    children: [
      {
        name: "About Us",
        href: "/institutions/engineering/about",
        desc: "Our story & leadership",
      },
      { name: "Alumni", href: "/alumni", desc: "Connect with our network" },
      { name: "Careers", href: "/careers", desc: "Join our team" },
      { name: "Contact", href: "/contact", desc: "Get in touch" },
      { name: "Leadership", href: "/leadership", desc: "Management & council" },
      {
        name: "Mandatory Disclosure",
        href: "/mandatory-disclosure",
        desc: "Policies & compliance",
      },
      { name: "Media", href: "/media", desc: "News & gallery" },
      { name: "Quality", href: "/quality", desc: "Accreditations & IQAC" },
      { name: "Research", href: "/research", desc: "R&D, CoE & publications" },
    ],
  },
];

export const artsNavigation: NavItem[] = [
  { name: "Home", href: "/institutions/arts-science#top" },
  {
    name: "Institutions",
    href: "#",
    children: [
      {
        name: "Engineering (Autonomous)",
        href: "/institutions/engineering",
        desc: "B.E, B.Tech, M.E, Ph.D programs",
      },
      {
        name: "Arts & Science",
        href: "/institutions/arts-science",
        desc: "B.A, B.Sc, B.Com, BBA programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Diploma programs",
      },
    ],
  },
  {
    name: "Programs",
    href: "/institutions/arts-science#programs",
  },
  {
    name: "Admissions",
    href: "/institutions/arts-science/admissions",
  },
  {
    name: "Placements",
    href: "/placements",
  },
  {
    name: "Life @ JCT",
    href: "/campus-life",
  },
  {
    name: "More",
    href: "#",
    children: [
      {
        name: "About Us",
        href: "/institutions/arts-science#about-institution",
        desc: "Our story & leadership",
      },
      { name: "Alumni", href: "/alumni", desc: "Connect with our network" },
      { name: "Careers", href: "/careers", desc: "Join our team" },
      { name: "Contact", href: "/contact", desc: "Get in touch" },
      { name: "Leadership", href: "/leadership", desc: "Management & council" },
      {
        name: "Mandatory Disclosure",
        href: "/mandatory-disclosure",
        desc: "Policies & compliance",
      },
      { name: "Media", href: "/media", desc: "News & gallery" },
      { name: "Quality", href: "/quality", desc: "Accreditations & IQAC" },
      { name: "Research", href: "/research", desc: "R&D, CoE & publications" },
    ],
  },
];

export const polytechnicNavigation: NavItem[] = [
  { name: "Home", href: "/institutions/polytechnic#top" },
  {
    name: "Institutions",
    href: "#",
    children: [
      {
        name: "Engineering (Autonomous)",
        href: "/institutions/engineering",
        desc: "B.E, B.Tech, M.E, Ph.D programs",
      },
      {
        name: "Arts & Science",
        href: "/institutions/arts-science",
        desc: "B.A, B.Sc, B.Com, BBA",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Diploma programs",
      },
    ],
  },
  {
    name: "Programs",
    href: "/institutions/polytechnic#programs",
  },
  {
    name: "Admissions",
    href: "/institutions/polytechnic/admissions",
  },
  {
    name: "Placements",
    href: "/placements",
  },
  {
    name: "Life @ JCT",
    href: "/campus-life",
  },
  {
    name: "More",
    href: "#",
    children: [
      {
        name: "About Us",
        href: "/institutions/polytechnic#about-institution",
        desc: "Our story & leadership",
      },
      { name: "Alumni", href: "/alumni", desc: "Connect with our network" },
      { name: "Careers", href: "/careers", desc: "Join our team" },
      { name: "Contact", href: "/contact", desc: "Get in touch" },
      { name: "Leadership", href: "/leadership", desc: "Management & council" },
      {
        name: "Mandatory Disclosure",
        href: "/mandatory-disclosure",
        desc: "Policies & compliance",
      },
      { name: "Media", href: "/media", desc: "News & gallery" },
      { name: "Quality", href: "/quality", desc: "Accreditations & IQAC" },
      { name: "Research", href: "/research", desc: "R&D, CoE & publications" },
    ],
  },
];
