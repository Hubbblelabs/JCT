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
      "Bachelor of Computer Science (B.Sc. CS) is the foundational technology for building a rich and fulfilling information society. At the department, students are not simply taught how to program in multiple languages, but are provided a deep understanding of computational theory.",
    duration: "3 Years (6 Semesters)",
    eligibility:
      "Pass in 10+2 (or equivalent) with Computer Science / Mathematics / Statistics / Business Mathematics.",
    syllabus: [
      "Data Structures in C",
      "Object Oriented Programming in C++",
      "Java Programming",
      "Web Technology",
      "Software Engineering",
    ],
    placements: [
      "Software Developer",
      "Web Designer",
      "Database Administrator",
      "System Analyst",
    ],
  },
  "bsc-ai-ml": {
    name: "Artificial Intelligence and Machine Learning",
    degree: "B.Sc.",
    overview:
      "B.Sc Artificial Intelligence and Machine Learning Programme prepares students with the skills to perform intelligent data analysis which is a key component in numerous real-world applications. This course focuses on building models that can learn and adapt.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10+2 (or equivalent) from a recognized board.",
    syllabus: [
      "Python Programming",
      "Machine Learning Algorithms",
      "Deep Learning",
      "Natural Language Processing",
      "Data Visualization",
    ],
    placements: [
      "AI Engineer",
      "Machine Learning Engineer",
      "Data Scientist",
      "Business Intelligence Developer",
    ],
  },
  bca: {
    name: "Computer Applications",
    degree: "BCA",
    overview:
      "BCA is a three-year undergraduate degree program for candidates wishing to start a career in computers and its applications. This course aims to provide the graduates the required skills from fundamentals to current technologies.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10+2 (or equivalent) from a recognized board.",
    syllabus: [
      "Fundamentals of Computing",
      "Programming in C",
      "Database Management Systems",
      "Computer Networks",
      "Mobile Application Development",
    ],
    placements: [
      "Software Developer",
      "System Engineer",
      "Network Administrator",
      "Tech Support",
    ],
  },
  "bcom-logistics": {
    name: "Logistics and Supply Chain Management",
    degree: "B.Com",
    overview:
      "Bachelor of Commerce Logistics and Supply chain Management is a three-year Undergraduate programme focusing on quality education in Commerce by imparting conceptual and practical knowledge through a well-structured curriculum.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10+2 (or equivalent) in Commerce / Accountancy.",
    syllabus: [
      "Principles of Management",
      "Financial Accounting",
      "Supply Chain Management",
      "International Trade",
      "Inventory Management",
    ],
    placements: [
      "Logistics Manager",
      "Supply Chain Analyst",
      "Export/Import Manager",
      "Operations Manager",
    ],
  },
  "bba-logistics": {
    name: "Logistics",
    degree: "BBA",
    overview:
      "BBA Logistics is a three-year full-time degree program essentially covering the concepts and processes involved in logistics and shipping related domains to specialize students in the area of Shipping and Logistics.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10+2 (or equivalent) from a recognized board.",
    syllabus: [
      "Fundamentals of Business",
      "Transport Economics",
      "Port Agency",
      "Customs Procedures",
      "Warehouse Management",
    ],
    placements: [
      "Shipping Coordinator",
      "Fleet Manager",
      "Procurement Manager",
      "Logistics Analyst",
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
