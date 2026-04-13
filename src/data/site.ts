export const siteConfig = {
  name: "JCT Institutions",
  shortName: "JCT",
  tagline: "Three Colleges, One Commitment to Excellence",
  established: 2009,
  url: "https://jct.ac.in",

  contact: {
    phone: "+91 93614 88801",
    phoneAlt: "+91 422 264 5566",
    email: "info@jct.ac.in",
    admissionsEmail: "admissions@jct.ac.in",
    whatsapp: "919361444408",
  },

  address: {
    line1: "Shri Jagannath Educational Health and Charitable Trust",
    line2: "Velandhavalam Main Road, Pichanur",
    city: "Coimbatore",
    pincode: "641105",
    state: "TamilNadu",
    country: "India",
    full: "Shri Jagannath Educational Health and Charitable Trust, Velandhavalam Main Road, Pichanur, Coimbatore - 641105, TamilNadu, India",
    mapEmbedUrl:
      "https://www.google.com/maps?q=JCT+Institutions+Knowledge+Park+Pichanur+Coimbatore+641105&output=embed",
    mapUrl:
      "https://maps.google.com/?q=JCT+Institutions+Knowledge+Park+Pichanur+Coimbatore+641105",
  },

  counsellingCode: "2769",

  social: {
    facebook: "https://facebook.com/jctinstitutions",
    instagram: "https://instagram.com/jctinstitutions",
    twitter: "https://x.com/jctinstitutions",
    linkedin: "https://linkedin.com/school/jctinstitutions",
    youtube: "https://youtube.com/@jctinstitutions",
  },

  stats: {
    yearsOfExcellence: 15,
    students: 5000,
    faculty: 300,
    recruiters: 200,
    alumni: 12000,
    programs: 50,
    placementRate: 96,
    highestPackage: "12 LPA",
    averagePackage: "4.5 LPA",
  },

  accreditations: [
    {
      name: "NAAC",
      logo: "/naac.png",
      description: "National Assessment and Accreditation Council",
    },
    {
      name: "NBA",
      logo: "/nba.png",
      description: "National Board of Accreditation",
    },
    {
      name: "AICTE",
      logo: "/aicte.png",
      description: "All India Council for Technical Education",
    },
    { name: "ISO", logo: "/iso.png", description: "ISO 9001:2015 Certified" },
    {
      name: "Anna University",
      logo: "/anna.png",
      description: "Affiliated to Anna University",
    },
    {
      name: "Bharathiar University",
      logo: "/bharathiar_university.png",
      description: "Affiliated to Bharathiar University",
    },
    {
      name: "UGC",
      logo: "/ugc.png",
      description: "University Grants Commission",
    },
    {
      name: "DOTE",
      logo: "/dote.png",
      description: "Directorate of Technical Education",
    },
  ],

  institutions: [
    {
      name: "JCT College of Engineering & Technology",
      short: "Engineering",
      href: "/institutions/engineering",
      logo: "/site_assests/engineering.jpeg",
      desc: "B.E. / B.Tech programs in CS, ECE, Mech, Civil, EEE & IT",
    },
    {
      name: "JCT College of Arts & Science",
      short: "Arts & Science",
      href: "/institutions/arts-science",
      logo: "/site_assests/arts.jpeg",
      desc: "B.Sc, B.Com, BBA programs with placement-focused training",
    },
    {
      name: "JCT Polytechnic College",
      short: "Polytechnic",
      href: "/institutions/polytechnic",
      logo: "/site_assests/polytechnic.jpeg",
      desc: "3-year diploma programs with hands-on lab training",
    },
  ],
} as const;
