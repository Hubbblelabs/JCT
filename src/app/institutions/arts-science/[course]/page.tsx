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
    syllabus: string[];
    placements: string[];
  }
> = {
  "bsc-computer-science": {
    name: "Computer Science",
    degree: "B.Sc.",
    overview:
      "Bachelor of Computer Science (B.Sc. CS) is the foundation technology for building a rich and fulfilling information society. At the department, students are not simply taught how to program in multiple languages, but they are also given the practical training to acquire a deeper understanding of computation and software constructions.",
    duration: "3 Years (6 Semesters)",
    eligibility:
      "Pass in HSC/12th standard with Mathematics / Computer Science / Statistics / Business Mathematics.",
    syllabus: [
      "Data Structures in C",
      "Object Oriented Programming in C++",
      "Java Programming",
      "Web Technology",
      "Software Engineering",
    ],
    placements: [
      "Software developer",
      "Website developer",
      "Mobile app developer",
      "UI/UX developer",
      "Web designer",
      "Web administrator",
      "Software tester",
      "System administrator",
      "Information system manager",
    ],
  },
  "bsc-ai-ml": {
    name: "Artificial Intelligence and Machine Learning",
    degree: "B.Sc.",
    overview:
      "B.Sc. Artificial Intelligence & Machine learning programme prepare students with the skills to perform intelligent data analysis which is a key component in numerous real-world applications. During the past ten years, data science has emerged as one of the most high-growth, dynamic and lucrative careers.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in HSC/12th standard with Mathematics or Computer Science as one of the subjects.",
    syllabus: [
      "Python Programming",
      "Machine Learning Algorithms",
      "Deep Learning",
      "Natural Language Processing",
      "Data Visualization",
    ],
    placements: [
      "Machine learning engineer",
      "Artificial intelligence engineer",
      "Business intelligence analyst",
      "Big data engineer",
      "Cloud architect",
      "Technical writer",
      "Data specialist",
      "AI researcher",
      "Software product engineer",
    ],
  },
  bca: {
    name: "Computer Applications",
    degree: "BCA",
    overview:
      "BCA is a three-year undergraduate degree program for candidates wishing to start a career in computers and its applications. This department aims to provide the graduates the required skills from fundamentals to current technologies for them to create efficient solution for industrial and real-life problems.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in HSC/12th standard with Mathematics / Computer Science / Statistics / Business Mathematics.",
    syllabus: [
      "Fundamentals of Computing",
      "Programming in C",
      "Database Management Systems",
      "Computer Networks",
      "Mobile Application Development",
    ],
    placements: [
      "Data analyst",
      "Data scientist",
      "Software developer",
      "Data base administrator",
      "Information systems manager",
      "Cyber security analyst",
      "Robotics engineer",
      "Business intelligence analyst",
      "Artificial intelligence developer",
    ],
  },
  "bcom-logistics-supply-chain": {
    name: "Logistics and Supply Chain Management",
    degree: "B.Com.",
    overview:
      "The focus of the department is to build a wide range of knowledge in the areas of accounting concepts and techniques to meet the current and future requirement of the industry. This programme offers the students value-based education specifically in areas of Logistics and Supply Chain Management.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in HSC/12th standard in any stream from a recognised board.",
    syllabus: [
      "Principles of Management",
      "Financial Accounting",
      "Supply Chain Management",
      "International Trade",
      "Inventory Management",
    ],
    placements: [
      "Customer service agent",
      "Inventory control manager",
      "International logistics manager",
      "Materials manager",
      "Production manager",
      "Supply chain manager",
      "Warehouse operation manager",
      "Logistic manager",
      "Supply chain designer",
    ],
  },
  "bcom-logistics": {
    name: "Logistics and Supply Chain Management (Legacy Path)",
    degree: "B.Com.",
    overview:
      "The focus of the department is to build a wide range of knowledge in the areas of accounting concepts and techniques to meet the current and future requirement of the industry. This programme offers the students value-based education specifically in areas of Logistics and Supply Chain Management.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in HSC/12th standard in any stream from a recognised board.",
    syllabus: [
      "Principles of Management",
      "Financial Accounting",
      "Supply Chain Management",
      "International Trade",
      "Inventory Management",
    ],
    placements: [
      "Customer service agent",
      "Inventory control manager",
      "International logistics manager",
      "Materials manager",
      "Production manager",
      "Supply chain manager",
      "Warehouse operation manager",
      "Logistic manager",
      "Supply chain designer",
    ],
  },
  "bba-logistics": {
    name: "Logistics",
    degree: "BBA",
    overview:
      "BBA Logistics, a three-year full time degree program essentially covering the concepts and process involved in logistics. Logistic management includes the designing and administration to control the flow of materials to all business units.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in HSC/12th standard in any stream from a recognised board.",
    syllabus: [
      "Fundamentals of Business",
      "Transport Economics",
      "Port Agency",
      "Customs Procedures",
      "Warehouse Management",
    ],
    placements: [
      "Production manager",
      "Export executive",
      "Operations manager",
      "Logistics coordinator",
      "Distribution center officer",
      "Warehouse supervisor",
      "Global logistic manager",
      "Business development manager",
      "Logistic analyst",
    ],
  },
  "bsc-digital-cyber-forensic-science": {
    name: "Digital and Cyber Forensic Science",
    degree: "B.Sc.",
    overview:
      "The Department of B.Sc. Digital & Cyber Forensic Science is dedicated to providing quality education and training in the field of cyber security, digital investigation, and forensic analysis using modern tools and techniques.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in HSC/12th standard with Mathematics / Computer Science / Statistics / Business Mathematics / Physics / Chemistry.",
    syllabus: [
      "Computer Forensics",
      "Cyber Security & Laws",
      "Network Security",
      "Digital Evidence Analysis",
      "Ethical Hacking",
    ],
    placements: [
      "Digital Forensic Analyst",
      "SOC Analyst",
      "Cyber Crime Investigator",
      "Digital Evidence Examiner",
      "Information Security Analyst",
      "Cyber Security Analyst",
      "Incident Response analyst",
      "Ethical Hacker",
      "Malware analyst",
      "Cyber Forensic Scientist",
      "Cloud Security Engineer",
    ],
  },
  "bcom-computer-applications": {
    name: "Computer Applications",
    degree: "B.Com.",
    overview:
      "The Department of B. Com Computer Applications focuses on building a strong foundation in commerce along with practical knowledge of computer applications, database systems, and enterprise tools.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in HSC/12th standard in any stream from a recognised board.",
    syllabus: [
      "Financial Accounting",
      "Tally Prime & Zoho Books",
      "E-Commerce & Digital Marketing",
      "Business Data Analytics",
      "Database Management Systems",
    ],
    placements: [
      "Cloud Accounting Specialist",
      "Business Intelligence Analyst",
      "Financial Analyst",
      "ERP Consultant",
      "Tally & GST Executive",
      "Banking Services Executive",
      "Digital Marketing Specialist",
      "Online Business Manager",
      "FinTech Associate",
      "MIS Executive",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(courseData).map((slug) => ({
    course: slug,
  }));
}

export default async function ArtsCourseDetailPage({
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
        subtitle="Course Details & Opportunities"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Arts & Science", href: "/institutions/arts-science" },
            { label: "Programs", href: "/institutions/arts-science/programs" },
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

            {/* 4. Syllabus Highlights */}
            <section>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  📚
                </span>
                Syllabus Highlights
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {course.syllabus.map((item: string, i: number) => (
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

            {/* 5. Career Opportunities & 6. Placements */}
            <section>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  💼
                </span>
                Career Opportunities
              </h2>
              <p className="text-muted-foreground mb-6">
                Graduates of the {course.degree} {course.name} program have
                excellent placement prospects in top companies. Typical roles
                include:
              </p>
              <div className="flex flex-wrap gap-3">
                {course.placements.map((career: string, i: number) => (
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
              </div>

              {/* 7. Apply CTA */}
              <Link
                href="https://admissions.jct.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
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
