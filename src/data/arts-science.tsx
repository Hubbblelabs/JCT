import {
  Calculator,
  Atom,
  BarChart3,
  Briefcase,
  BookOpen,
  Feather,
  Lightbulb,
  MessageSquare,
  Palette,
  Users,
} from "lucide-react";

export const heroStats = [
  { value: "2,500+", label: "Students", accent: true },
  { value: "5", label: "Programs", accent: false },
  { value: "60+", label: "Faculty Members", accent: false },
  { value: "15+", label: "Years of Excellence", accent: true },
];

export const philosophyStats = [
  { value: "6", label: "Departments" },
  { value: "30:1", label: "Student-Faculty Ratio" },
  { value: "UGC", label: "Recognized" },
];

export const ugPrograms = [
  {
    name: "B.Sc Computer Science",
    slug: "bsc-computer-science",
    duration: "3 Years",
    icon: Atom,
    desc: "Bachelor of Computer Science (B.Sc. CS) is the foundational technology for building a rich and fulfilling information society.",
  },
  {
    name: "B.Sc Artificial Intelligence and Machine Learning",
    slug: "bsc-ai-ml",
    duration: "3 Years",
    icon: Lightbulb,
    desc: "Programme prepares students with the skills to perform intelligent data analysis which is a key component in numerous real-world applications.",
  },
  {
    name: "BCA (Bachelor of Computer Applications)",
    slug: "bca",
    duration: "3 Years",
    icon: Calculator,
    desc: "A three-year undergraduate degree program for candidates wishing to start a career in computers and its applications.",
  },
  {
    name: "B.Com Logistics and Supply Chain Management",
    slug: "bcom-logistics-supply-chain",
    duration: "3 Years",
    icon: BarChart3,
    desc: "Undergraduate programme focusing on quality education in commerce with conceptual and practical knowledge.",
  },
  {
    name: "BBA Logistics",
    slug: "bba-logistics",
    duration: "3 Years",
    icon: Briefcase,
    desc: "Three-year full-time degree program covering concepts and processes involved in logistics and shipping.",
  },
];

export const academicLife = [
  {
    icon: BookOpen,
    title: "Departmental Seminars",
    desc: "Each department hosts monthly seminars where students present papers, discuss ideas, and engage with faculty-led research topics.",
  },
  {
    icon: Feather,
    title: "Literary & Debate Society",
    desc: "The college has an active literary club that organizes essay competitions, poetry readings, and inter-college debate tournaments.",
  },
  {
    icon: Lightbulb,
    title: "Undergraduate Research",
    desc: "Final-year students in science programs undertake guided research projects. Several have been presented at state-level conferences.",
  },
  {
    icon: MessageSquare,
    title: "Guest Lecture Series",
    desc: "Industry professionals, academics, and alumni visit regularly for talks that connect classroom theory to real-world practice.",
  },
  {
    icon: Palette,
    title: "Cultural Festivals",
    desc: "An annual arts festival brings together drama, music, dance, and visual arts — organized and run entirely by students.",
  },
  {
    icon: Users,
    title: "Community Outreach",
    desc: "NSS and extension activities connect students with local communities — from literacy drives to environmental cleanup campaigns.",
  },
];

export const admissionsCriteria = [
  {
    title: "UG Eligibility",
    items: [
      "Passed 12th (HSC) from a recognized board",
      "Relevant subject combination",
      "Minimum aggregate per university norms",
    ],
  },
  {
    title: "PG Eligibility",
    items: [
      "Relevant bachelor's degree",
      "Minimum percentage as prescribed",
      "Interview for select programs",
    ],
  },
  {
    title: "How to Apply",
    items: [
      "Fill out the online application",
      "Attend counseling with original documents",
      "Confirm enrollment with fee payment",
    ],
  },
];

export const testimonials = [
  {
    quote:
      "The education here prepared me for real challenges. I walked into my first job feeling confident and capable, all thanks to the rigorous curriculum and supportive faculty.",
    name: "Rajesh Kumar",
    role: "Engineering at TCS",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "I came here uncertain about my direction. The diverse environment and the mentorship I received helped me discover my true passion and shape my career path.",
    name: "Priya Sharma",
    role: "Management at Accenture",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    quote:
      "The faculty understood that we needed more than theory. The hands-on projects and industry connections gave me the exact experience I needed to stand out.",
    name: "Arjun Patel",
    role: "Computer Science at Google",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
];

export const newsUpdates = [
  {
    date: "Thu 15 Feb 2024",
    title:
      "Annual Science Exhibition showcases student innovations capable of global impact.",
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop",
  },
  {
    date: "Mon 20 Mar 2024",
    title:
      "National Commerce Conference hosted on campus, drawing industry leaders.",
    image:
      "https://images.unsplash.com/photo-1475721028070-96695bce1356?q=80&w=600&auto=format&fit=crop",
  },
  {
    date: "Wed 05 Apr 2024",
    title:
      "New AI and Machine Learning lab inaugurated to boost advanced research capabilities.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
  },
];

export const campusEvents = [
  {
    title: "Industry leaders speak",
    category: "Seminar",
    location: "Main auditorium",
    date: "10:00 AM",
  },
  {
    title: "Coding bootcamp begins",
    category: "Workshop",
    location: "Tech lab",
    date: "02:00 PM",
  },
  {
    title: "Campus recruitment drive",
    category: "Placement",
    location: "Placement office",
    date: "09:00 AM",
  },
];
