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
        desc: "B.Sc, B.Com, BBA programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Mech, Agri, PetriChemical, CT programs",
      },
      {
        name: "JCT Institutions",
        href: "/",
        desc: "Explore the Excellence",
      },
    ],
  },
  { name: "Admissions", href: "/#admissions" },
  { name: "Placements", href: "/#placements" },
  { name: "Life @ JCT", href: "/#campus-life" },
 
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
        desc: "B.Sc, B.Com, BBA programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Mech, Agri, PetriChemical, CT programs",
      },
      {
        name: "JCT Institutions",
        href: "/",
        desc: "Explore the Excellence",
      },
    ],
  },
  {
    name: "About Us",
    href: "/institutions/engineering/about",
  },
  {
    name: "Admissions",
    href: "/institutions/engineering#admissions",
  },
  {
    name: "Courses",
    href: "/institutions/engineering#programs",
  },
  {
    name: "Placements",
    href: "/institutions/engineering#placements",
  },
  {
    name: "COE",
    href: "/research",
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
        desc: "B.Sc, B.Com, BBA programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Mech, Agri, PetriChemical, CT programs",
      },
      {
        name: "JCT Institutions",
        href: "/",
        desc: "Explore the Excellence",
      },
    ],
  },
  {
    name: "About Us",
    href: "/institutions/arts-science/about",
  },
  {
    name: "Admissions",
    href: "/institutions/arts-science#admissions",
  },
  {
    name: "Courses",
    href: "/institutions/arts-science#programs",
  },
  {
    name: "Placements",
    href: "/institutions/arts-science#placements",
  },
];

export const polytechnicNavigation: NavItem[] = [
  { name: "Home",
     href: "/institutions/polytechnic#top" },
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
        desc: "B.Sc, B.Com, BBA programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Mech, Agri, PetriChemical, CT programs",
      },
      {
        name: "JCT Institutions",
        href: "/",
        desc: "Explore the Excellence",
      },
    ],
  },
  {
    name: "About Us",
    href: "/institutions/polytechnic/about",
  },
  {
    name: "Admissions",
    href: "/institutions/polytechnic#admissions",
  },
  {
    name: "Courses",
    href: "/institutions/polytechnic#programs",
  },
  {
    name: "Placements",
    href: "/institutions/polytechnic#placements",
  },
];
