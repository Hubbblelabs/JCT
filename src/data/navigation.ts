export type NavItem = {
  name: string;
  href: string;
  children?: NavChild[];
};

export type NavChild = {
  name: string;
  href: string;
  desc?: string;
  className?: string;
};

export const navigationData: NavItem[] = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Institutions",
    href: "#",
    children: [
      {
        name: "Engineering",
        href: "/institutions/engineering",
        desc: "B.E. / B.Tech programs",
      },
      {
        name: "Arts & Science",
        href: "/institutions/arts-science",
        desc: "UG & PG programs",
      },
      {
        name: "Polytechnic",
        href: "/institutions/polytechnic",
        desc: "Diploma programs",
      },
    ],
  },
  {
    name: "Admissions",
    href: "/admissions",
  },
  {
    name: "Placements",
    href: "/placements",
  },
  {
    name: "Campus Life",
    href: "/campus-life",
  },
  {
    name: "More",
    href: "#",
    children: [
      { name: "About", href: "/about" },
      { name: "Alumni", href: "/alumni" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Governance", href: "/governance" },
      { name: "Leadership", href: "/leadership" },
      { name: "Mandatory Disclosure", href: "/mandatory-disclosure" },
      { name: "Media", href: "/media" },
      { name: "Quality", href: "/quality" },
      { name: "Research", href: "/research" },
    ],
  },
];
