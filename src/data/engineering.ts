import {
  Cpu,
  Cog,
  Zap,
  Building2,
  Wrench,
  Beaker,
  GraduationCap,
  BrainCircuit,
  Globe,
  Utensils,
  Droplets,
  FlaskConical,
} from "lucide-react";

export const ugCourses = [
  {
    name: "Computer Science & Engineering",
    abbr: "CSE",
    slug: "cse",
    icon: Cpu,
    image: "/programs/engineering/cse.webp",
    seats: 120,
    highlight: "AI/ML, Software Engineering, Cloud Computing",
    nbaAccredited: true,
  },
  {
    name: "Artificial Intelligence & Data Science",
    abbr: "AI&DS",
    slug: "aids",
    icon: BrainCircuit,
    image: "/programs/engineering/aids.webp",
    seats: 60,
    highlight: "B.Tech. program in AI, Data Science, and Intelligent Systems",
  },
  {
    name: "Computer Science & Business Systems",
    abbr: "CSBS",
    slug: "csbs",
    icon: Cpu,
    image: "/programs/engineering/csbs.webp",
    seats: 60,
    highlight: "B.E. program blending computing with business systems",
  },
  {
    name: "Electronics & Communication Engineering",
    abbr: "ECE",
    slug: "ece",
    icon: Globe,
    image: "/programs/engineering/ece.webp",
    seats: 60,
    highlight: "Communication Systems, VLSI, Signal Processing, and IoT",
    nbaAccredited: true,
  },
  {
    name: "Electrical & Electronics Engineering",
    abbr: "EEE",
    slug: "eee",
    icon: Zap,
    image: "/programs/engineering/eee.webp",
    seats: 60,
    highlight:
      "Power Systems, Drives, Control Systems, and Energy Applications",
    nbaAccredited: true,
  },
  {
    name: "Mechanical Engineering",
    abbr: "MECH",
    slug: "mech",
    icon: Cog,
    image: "/programs/engineering/mech.webp",
    seats: 60,
    highlight: "Design, Manufacturing, Thermal Systems, and Automation",
    nbaAccredited: true,
  },
  {
    name: "Civil Engineering",
    abbr: "CE",
    slug: "ce",
    icon: Building2,
    image: "/programs/engineering/civil.webp",
    seats: 60,
    highlight: "Structural, Construction, and Environmental Engineering",
  },
  {
    name: "Bio-Technology and Bio-Chemical Engineering",
    abbr: "BT",
    slug: "bt",
    icon: Beaker,
    image: "/programs/engineering/bt.webp",
    seats: 60,
    highlight: "Bioprocess Engineering, Biotechnology, and Biochemical Systems",
  },
  {
    name: "Food Technology",
    abbr: "FT",
    slug: "ft",
    icon: Utensils,
    image: "/programs/engineering/ft.webp",
    seats: 60,
    highlight:
      "Food Processing, Safety, Quality Assurance, and Product Development",
  },
  {
    name: "Petroleum Engineering",
    abbr: "PE",
    slug: "pe",
    icon: Droplets,
    image: "/programs/engineering/pe.webp",
    seats: 60,
    highlight:
      "Reservoir Studies, Drilling Technology, and Hydrocarbon Production",
  },
  {
    name: "Petrochemical Technology",
    abbr: "PCT",
    slug: "pct",
    icon: FlaskConical,
    image: "/programs/engineering/pct.webp",
    seats: 60,
    highlight:
      "Petrochemical Processing, Industrial Chemistry, and Process Safety",
  },
];

export const pgCourses = [
  {
    name: "Structural Engineering",
    abbr: "M.E.",
    slug: "structural-engineering",
    icon: Building2,
    image: "/programs/engineering/structural.webp",
    highlight:
      "Advanced Structural Design, Analysis, and Earthquake Engineering",
  },
  {
    name: "Power Electronics & Drives",
    abbr: "M.E.",
    slug: "power-electronics",
    icon: Zap,
    image: "/programs/engineering/power-electronics.webp",
    highlight: "Power Converters, Drives, and Advanced Electrical Applications",
  },
  {
    name: "CSE (Artificial Intelligence & Machine Learning)",
    abbr: "M.E.",
    slug: "cse-aiml",
    icon: BrainCircuit,
    image: "/programs/engineering/cse-aiml.webp",
    highlight: "Advanced AI, Machine Learning, and Intelligent Computing",
  },
];

export const researchCourses = [
  {
    name: "Electrical and Electronics Engineering (Doctoral Programme)",
    abbr: "Ph.D.",
    slug: "eee-doctoral",
    icon: GraduationCap,
    image: "/programs/engineering/eee-phd.webp",
    highlight:
      "Doctoral research in advanced Electrical and Electronics domains",
  },
];

export const metrics = [
  { value: "98%", label: "Placement Rate", sub: "2023-24 Batch" },
  { value: "₹70L", label: "Highest Package", sub: "On-campus" },
  { value: "45+", label: "Recruiters", sub: "Annual visits" },
  { value: "500+", label: "Offers Made", sub: "Last 3 years" },
  { value: "100%", label: "Lab Access", sub: "Industry-grade" },
  { value: "25+", label: "Patents Filed", sub: "Faculty & Students" },
];

export const facilities = [
  {
    title: "High-Performance Computing Lab",
    desc: "GPU clusters for machine learning, simulation, and computational engineering projects.",
    icon: Cpu,
  },
  {
    title: "Advanced Manufacturing Workshop",
    desc: "CNC machines, 3D printers, welding stations, and a materials testing facility.",
    icon: Wrench,
  },
  {
    title: "Electronics Prototyping Center",
    desc: "PCB fabrication, oscilloscopes, spectrum analyzers, and embedded systems test benches.",
    icon: Zap,
  },
  {
    title: "Research & Innovation Cell",
    desc: "A cross-disciplinary space for faculty-guided research, patent applications, and prototype development.",
    icon: Beaker,
  },
];

export const testimonials = [
  {
    quote:
      "Our final-year project was reviewed by industry mentors, and that experience changed how I approached problem-solving in real engineering teams.",
    name: "Harish V.",
    role: "Software Engineer at Infosys",
    image: "/avatars/male_avatar.png",
    tag: "Alumni",
  },
  {
    quote:
      "The placement training and mock interviews made a huge difference. I stepped into campus recruitment with confidence and secured my offer early.",
    name: "Keerthana M.",
    role: "Graduate Engineer Trainee at Caterpillar",
    image: "/avatars/female_avatar.png",
    tag: "Student",
  },
  {
    quote:
      "JCT students stand out for practical clarity. They arrive ready for production environments, not just textbook discussions.",
    name: "R. Suresh",
    role: "Senior Manager, Industry Partner",
    image: "/avatars/male_avatar.png",
    tag: "INDUSTRY",
  },
  {
    quote:
      "Faculty encouraged us to build beyond syllabus requirements. That project depth helped me during technical interviews and onboarding.",
    name: "Vikram N.",
    role: "Design Engineer at L&T",
    image: "/avatars/male_avatar.png",
    tag: "Alumni",
  },
  {
    quote:
      "The coding and aptitude sessions were consistent and practical. I improved every month and was ready by placement season.",
    name: "Janani P.",
    role: "Final Year ECE Student",
    image: "/avatars/female_avatar.png",
    tag: "Student",
  },
  {
    quote:
      "The graduates we recruit from JCT show strong fundamentals and discipline in execution, especially in quality and documentation workflows.",
    name: "Mohan Raj",
    role: "Plant Operations Lead, Caterpillar",
    image: "/avatars/male_avatar.png",
    tag: "INDUSTRY",
  },
];
