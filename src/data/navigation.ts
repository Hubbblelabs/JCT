export type NavItem = {
  name: string;
  href: string;
  children?: NavChild[];
};

export type NavChild = {
  name: string;
  href: string;
  desc?: string;
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
    children: [
      { name: "Why Choose JCT", href: "/admissions/why-jct" },
      { name: "Programs Offered", href: "/admissions/programs" },
      { name: "Eligibility Criteria", href: "/admissions/eligibility" },
      { name: "Prospectus Download", href: "/admissions/prospectus" },
      { name: "Available Seats", href: "/admissions/seats" },
      { name: "Scholarships", href: "/admissions/scholarships" },
      { name: "Fee Structure", href: "/admissions/fee-structure" },
      { name: "Admission Process", href: "/admissions/process" },
      { name: "Apply Now", href: "/admissions/apply" },
    ],
  },
  {
    name: "Academics",
    href: "/academics",
    children: [
      { name: "Programs Offered", href: "/academics/programs" },
      { name: "Departments", href: "/academics/departments" },
      { name: "Academic Calendar", href: "/academics/calendar" },
      { name: "Academic Regulations", href: "/academics/regulations" },
      { name: "Curriculum & Syllabus", href: "/academics/curriculum" },
      { name: "Academic Council", href: "/academics/council" },
    ],
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
    children: [
      { name: "Research Policy", href: "/research/policy" },
      { name: "R&D Cell", href: "/research/rnd-cell" },
      { name: "Research Centres", href: "/research/centres" },
      { name: "Publications", href: "/research/publications" },
      { name: "Funded Projects", href: "/research/funded-projects" },
      { name: "Patents", href: "/research/patents" },
      { name: "Innovation Activities", href: "/research/innovation" },
      { name: "Workshops & Conferences", href: "/research/workshops" },
    ],
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
    name: "Examinations",
    href: "/examinations",
    children: [
      { name: "Examination Cell", href: "/examinations/cell" },
      { name: "Result Passing Board", href: "/examinations/passing-board" },
      { name: "Results", href: "/examinations/results" },
      { name: "Exam Notifications", href: "/examinations/notifications" },
    ],
  },
  {
    name: "Governance",
    href: "/governance",
    children: [
      { name: "Anti-Ragging Cell", href: "/governance/anti-ragging" },
      { name: "SC/ST Cell", href: "/governance/sc-st-cell" },
      { name: "Internal Complaints Committee", href: "/governance/icc" },
      { name: "Grievance Redressal Cell", href: "/governance/grievance" },
      { name: "Women Empowerment Cell", href: "/governance/women-empowerment" },
      { name: "Student Welfare Cell", href: "/governance/student-welfare" },
      { name: "Equal Opportunity Cell", href: "/governance/equal-opportunity" },
    ],
  },
  {
    name: "Quality",
    href: "/quality",
    children: [
      {
        name: "Accreditations & Recognitions",
        href: "/quality/accreditations",
      },
      { name: "IQAC", href: "/quality/iqac" },
      { name: "Feedback Systems", href: "/quality/feedback" },
      { name: "Awards & Achievements", href: "/quality/awards" },
    ],
  },
  {
    name: "Mandatory Disclosure",
    href: "/mandatory-disclosure",
    children: [
      {
        name: "Code of Conduct",
        href: "/mandatory-disclosure/code-of-conduct",
      },
      {
        name: "Policies & Regulations",
        href: "/mandatory-disclosure/policies",
      },
      { name: "Professional Ethics", href: "/mandatory-disclosure/ethics" },
      { name: "HR Manual", href: "/mandatory-disclosure/hr-manual" },
      {
        name: "Student Satisfaction Survey",
        href: "/mandatory-disclosure/survey",
      },
      { name: "Privacy Policy", href: "/mandatory-disclosure/privacy" },
      { name: "Terms & Conditions", href: "/mandatory-disclosure/terms" },
      { name: "Disclaimer", href: "/mandatory-disclosure/disclaimer" },
    ],
  },
  {
    name: "Contact",
    href: "/contact",
  },
];
