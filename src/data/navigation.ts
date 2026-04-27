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
    name: "About JCT",
    href: "/about",
    children: [
      { name: "About the Institution", href: "/about/institution" },
      { name: "Vision & Mission", href: "/about/vision-mission" },
      { name: "Chairman's Message", href: "/about/chairmans-message" },
      { name: "Principal's Message", href: "/about/principals-message" },
      { name: "History", href: "/about/history" },
      { name: "Leadership / Management", href: "/about/leadership" },
      {
        name: "Organizational Structure",
        href: "/about/organizational-structure",
      },
      { name: "Governing Council", href: "/about/governing-council" },
      { name: "Strategic Plan", href: "/about/strategic-plan" },
    ],
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
    children: [
      { name: "Placement Overview", href: "/placements" },
      { name: "Placement Statistics", href: "/placements/statistics" },
      { name: "Top Recruiters", href: "/placements/recruiters" },
      { name: "Internship Programs", href: "/placements/internships" },
      { name: "Career Development", href: "/placements/career-development" },
      { name: "Industry MoUs", href: "/placements/industry-mous" },
      { name: "Alumni Success Stories", href: "/placements/alumni-stories" },
    ],
  },
  {
    name: "Research",
    href: "/research",
  },
  {
    name: "Campus Life",
    href: "/campus-life",
    children: [
      { name: "Campus Facilities", href: "/campus-life/facilities" },
      { name: "Hostel", href: "/campus-life/hostel" },
      { name: "Library", href: "/campus-life/library" },
      { name: "Laboratories", href: "/campus-life/laboratories" },
      { name: "Sports & Recreation", href: "/campus-life/sports" },
      { name: "Clubs & Societies", href: "/campus-life/clubs" },
      { name: "Student Activities", href: "/campus-life/activities" },
      { name: "Campus Gallery", href: "/campus-life/gallery" },
      { name: "News & Events", href: "/campus-life/news-events" },
    ],
  },
  {
    name: "Governance",
    href: "/governance",
  },
  {
    name: "Quality",
    href: "/quality",
  },
  {
    name: "Mandatory Disclosure",
    href: "/mandatory-disclosure",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];
