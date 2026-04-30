import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const courseData: Record<
  string,
  {
    name: string;
    degree: string;
    overview: string;
    duration: string;
    eligibility: string;
    highlights: string[];
    labs: string[];
    careers: string[];
  }
> = {
  "ai-ds": {
    name: "Artificial Intelligence and Data Science",
    degree: "B.Tech",
    overview:
      "B.Tech. Artificial Intelligence and Data Science is an undergraduate course. During the past ten years, data science has emerged as one of the most high-growth, dynamic, and lucrative careers in technology.",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "10+2 with Physics, Chemistry, and Mathematics with minimum 50% marks.",
    highlights: [
      "Machine Learning & Deep Learning",
      "Big Data Analytics",
      "Natural Language Processing",
      "Cloud Computing & IoT",
    ],
    labs: [
      "Data Analytics Lab",
      "AI & ML Lab",
      "High Performance Computing Lab",
    ],
    careers: [
      "Data Scientist",
      "Machine Learning Engineer",
      "AI Consultant",
      "Business Intelligence Analyst",
    ],
  },
  cse: {
    name: "Computer Science & Engineering",
    degree: "B.E.",
    overview:
      "Computer Science Engineering involves the design and understanding of computational process and programming languages. It provides a solid foundation in both hardware and software concepts.",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "10+2 with Physics, Chemistry, and Mathematics with minimum 50% marks.",
    highlights: [
      "Data Structures & Algorithms",
      "Software Engineering",
      "Cyber Security",
      "Web Technologies",
    ],
    labs: [
      "Programming Lab",
      "Networks Lab",
      "Operating Systems Lab",
      "Software Engineering Lab",
    ],
    careers: [
      "Software Developer",
      "System Analyst",
      "Network Engineer",
      "Database Administrator",
    ],
  },
  mech: {
    name: "Mechanical Engineering",
    degree: "B.E.",
    overview:
      "Mechanical Engineering is a diverse subject that derives its breadth from the need to design and manufacture everything from small individual parts and devices to large systems.",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "10+2 with Physics, Chemistry, and Mathematics with minimum 50% marks.",
    highlights: [
      "Thermal Engineering",
      "Design of Machine Elements",
      "Manufacturing Technology",
      "Robotics and Automation",
    ],
    labs: [
      "CAD/CAM Lab",
      "Thermal Engineering Lab",
      "Fluid Mechanics Lab",
      "Dynamics Lab",
    ],
    careers: [
      "Design Engineer",
      "Production Engineer",
      "Quality Control Inspector",
      "Automotive Engineer",
    ],
  },
  civil: {
    name: "Civil Engineering",
    degree: "B.E.",
    overview:
      "Civil Engineering is a professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment.",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "10+2 with Physics, Chemistry, and Mathematics with minimum 50% marks.",
    highlights: [
      "Structural Engineering",
      "Geotechnical Engineering",
      "Transportation Engineering",
      "Environmental Engineering",
    ],
    labs: [
      "Surveying Lab",
      "Strength of Materials Lab",
      "Soil Mechanics Lab",
      "Concrete and Highway Lab",
    ],
    careers: [
      "Structural Engineer",
      "Site Engineer",
      "Construction Manager",
      "Urban Planner",
    ],
  },
  ece: {
    name: "Electronics and Communication Engineering",
    degree: "B.E.",
    overview:
      "Electronics and Communication Engineering deals with electronic devices, circuits, communication equipment like transmitter, receiver, integrated circuits (IC).",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "10+2 with Physics, Chemistry, and Mathematics with minimum 50% marks.",
    highlights: [
      "Digital Signal Processing",
      "VLSI Design",
      "Embedded Systems",
      "Optical Communication",
    ],
    labs: [
      "Electronics Lab",
      "Microprocessor Lab",
      "VLSI Lab",
      "Communication Systems Lab",
    ],
    careers: [
      "Telecom Engineer",
      "Electronics Design Engineer",
      "Network Planning Engineer",
      "R&D Engineer",
    ],
  },
  eee: {
    name: "Electrical and Electronics Engineering",
    degree: "B.E.",
    overview:
      "Electrical and Electronics Engineering is a growing and one of the most sought disciplines in the field of engineering study. It comprises of electrical engineering and electronics engineering.",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "10+2 with Physics, Chemistry, and Mathematics with minimum 50% marks.",
    highlights: [
      "Power Systems",
      "Electrical Machines",
      "Control Systems",
      "Renewable Energy Sources",
    ],
    labs: [
      "Machines Lab",
      "Power Electronics Lab",
      "Control Systems Lab",
      "Measurements Lab",
    ],
    careers: [
      "Electrical Engineer",
      "Power Systems Engineer",
      "Control Systems Engineer",
      "Energy Manager",
    ],
  },
  csbs: {
    name: "Computer Science & Business Systems",
    degree: "B.Tech",
    overview:
      "Designed by TCS, this course aims to ensure that the students graduating from the program not only know the core topics of Computer Science but also develop an equal appreciation of humanities, management sciences and human values.",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "10+2 with Physics, Chemistry, and Mathematics with minimum 50% marks.",
    highlights: [
      "Design Thinking",
      "Business Strategy",
      "Data Analytics",
      "Financial Management",
    ],
    labs: [
      "Business Analytics Lab",
      "Software Design Lab",
      "Communication Skills Lab",
    ],
    careers: [
      "Business Analyst",
      "Technology Consultant",
      "Product Manager",
      "Software Engineer",
    ],
  },
  btbce: {
    name: "Biotechnology and Biochemical Engineering",
    degree: "B.Tech",
    overview:
      "A multi-disciplinary field that combines biological sciences with engineering technologies to develop products and processes for various industries including healthcare, agriculture, and environment.",
    duration: "4 Years (8 Semesters)",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics/Biology.",
    highlights: [
      "Molecular Biology",
      "Bioprocess Engineering",
      "Genetic Engineering",
      "Bioinformatics",
    ],
    labs: [
      "Biochemistry Lab",
      "Microbiology Lab",
      "Bioprocess Lab",
      "Molecular Biology Lab",
    ],
    careers: [
      "Biotechnologist",
      "Process Engineer",
      "Research Scientist",
      "Quality Assurance Officer",
    ],
  },
  ft: {
    name: "Food Technology",
    degree: "B.Tech",
    overview:
      "Food Technology is a branch of food science that deals with the production processes that make foods. Early scientific research into food technology concentrated on food preservation.",
    duration: "4 Years (8 Semesters)",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics/Biology.",
    highlights: [
      "Food Processing",
      "Food Packaging Technology",
      "Food Safety and Quality",
      "Food Microbiology",
    ],
    labs: ["Food Microbiology Lab", "Food Analysis Lab", "Food Processing Lab"],
    careers: [
      "Food Technologist",
      "Production Manager",
      "Quality Manager",
      "R&D Scientist",
    ],
  },
  pe: {
    name: "Petroleum Engineering",
    degree: "B.Tech",
    overview:
      "Petroleum engineering is a field of engineering concerned with the activities related to the production of hydrocarbons, which can be either crude oil or natural gas.",
    duration: "4 Years (8 Semesters)",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics.",
    highlights: [
      "Drilling Engineering",
      "Reservoir Engineering",
      "Production Engineering",
      "Petroleum Geology",
    ],
    labs: [
      "Drilling Fluids Lab",
      "Reservoir Engineering Lab",
      "Petroleum Testing Lab",
    ],
    careers: [
      "Drilling Engineer",
      "Reservoir Engineer",
      "Production Engineer",
      "Petrophysicist",
    ],
  },
  pct: {
    name: "Petrochemical Technology",
    degree: "B.Tech",
    overview:
      "Focuses on the transformation of crude oil and natural gas into useful products or raw materials. This branch is central to the chemical industry.",
    duration: "4 Years (8 Semesters)",
    eligibility: "10+2 with Physics, Chemistry, and Mathematics.",
    highlights: [
      "Petroleum Refining",
      "Heat Transfer",
      "Mass Transfer",
      "Chemical Reaction Engineering",
    ],
    labs: ["Petrochemical Lab", "Heat Transfer Lab", "Mass Transfer Lab"],
    careers: [
      "Process Engineer",
      "Plant Engineer",
      "Petrochemical Consultant",
      "Safety Engineer",
    ],
  },
  structural: {
    name: "Structural Engineering",
    degree: "M.E.",
    overview:
      "Advanced study of structural design, analysis, and stability under various loads. Prepares students for complex engineering challenges in construction.",
    duration: "2 Years (4 Semesters)",
    eligibility: "B.E. / B.Tech in Civil Engineering.",
    highlights: [
      "Advanced Concrete Structures",
      "Earthquake Engineering",
      "Finite Element Analysis",
    ],
    labs: ["Advanced Structural Engineering Lab", "Computer Aided Design Lab"],
    careers: [
      "Structural Design Engineer",
      "Project Manager",
      "Consulting Engineer",
    ],
  },
  "power-electronics": {
    name: "Power Electronics and Drives",
    degree: "M.E.",
    overview:
      "Focuses on the control and conversion of electric power. It plays a crucial role in modern industrial drives and renewable energy systems.",
    duration: "2 Years (4 Semesters)",
    eligibility: "B.E. / B.Tech in EEE or related fields.",
    highlights: [
      "Power Converters",
      "Electric Drives",
      "Smart Grids",
      "Power Quality",
    ],
    labs: ["Power Electronics Lab", "Electric Drives Lab"],
    careers: ["Power Systems Engineer", "R&D Engineer", "Design Engineer"],
  },
  "cse-aiml": {
    name: "CSE (AI & Machine Learning)",
    degree: "M.E.",
    overview:
      "Advanced study combining core computer science with deep learning, neural networks, and AI applications.",
    duration: "2 Years (4 Semesters)",
    eligibility: "B.E. / B.Tech in CSE / IT.",
    highlights: [
      "Advanced Machine Learning",
      "Computer Vision",
      "Deep Learning",
      "AI Ethics",
    ],
    labs: ["Advanced AI Lab", "Data Analytics Lab"],
    careers: ["AI Scientist", "Machine Learning Architect", "Data Engineer"],
  },
};

export async function generateStaticParams() {
  return Object.keys(courseData).map((slug) => ({
    course: slug,
  }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const resolvedParams = await params;
  const courseSlug = resolvedParams.course;
  const course = courseData[courseSlug];

  if (!course) {
    notFound();
  }

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title={`${course.degree} ${course.name}`}
        subtitle="Department Overview & Details"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Programs", href: "/institutions/engineering/programs" },
            { label: course.name },
          ]}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-12">
            {/* 1. Course Overview */}
            <section>
              <h2 className="text-foreground mb-4 font-serif text-3xl font-bold">
                Course Overview
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {course.overview}
              </p>
            </section>

            {/* 4. Curriculum Highlights */}
            <section>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  🎯
                </span>
                Curriculum Highlights
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {course.highlights.map((item: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="bg-gold h-2 w-2 shrink-0 rounded-full"></div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Labs */}
            <section>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  🔬
                </span>
                State-of-the-Art Laboratories
              </h2>
              <ul className="text-muted-foreground list-inside list-disc space-y-2">
                {course.labs.map((lab: string, i: number) => (
                  <li key={i} className="text-lg">
                    {lab}
                  </li>
                ))}
              </ul>
            </section>

            {/* 6. Placement & 7. Career Scope */}
            <section>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  💼
                </span>
                Career Scope & Placements
              </h2>
              <p className="text-muted-foreground mb-6">
                Our dedicated placement cell ensures that graduates from the{" "}
                {course.name} department secure positions in top-tier companies.
                Potential career roles include:
              </p>
              <div className="flex flex-wrap gap-3">
                {course.careers.map((career: string, i: number) => (
                  <span
                    key={i}
                    className="bg-surface rounded-full border border-white/10 px-4 py-2 text-sm font-medium"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Quick Facts Sidebar */}
            <div className="bg-surface border-border sticky top-32 rounded-3xl border p-6">
              <h3 className="mb-6 border-b border-white/10 pb-4 text-xl font-bold">
                Quick Facts
              </h3>

              <div className="space-y-6">
                <div>
                  <div className="text-muted-foreground mb-1 text-sm">
                    Degree
                  </div>
                  <div className="font-bold">{course.degree}</div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1 text-sm">
                    Duration
                  </div>
                  <div className="font-bold">{course.duration}</div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1 text-sm">
                    Eligibility
                  </div>
                  <div className="text-sm leading-snug font-medium">
                    {course.eligibility}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1 text-sm">
                    Counselling Code
                  </div>
                  <div className="text-gold text-2xl font-bold">2769</div>
                </div>
              </div>

              {/* 8. Apply CTA */}
              <Link
                href="/apply-now"
                className="bg-gold text-navy mt-8 block w-full rounded-xl py-4 text-center font-bold transition-colors hover:bg-[#e8b84a]"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
