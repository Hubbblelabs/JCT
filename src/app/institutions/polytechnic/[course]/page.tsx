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
    labs: string[];
    careers: string[];
  }
> = {
  computer: {
    name: "Computer Technology",
    degree: "Diploma",
    overview:
      "Provides a solid foundation in computer software, hardware, and networking. Students learn to build, maintain, and troubleshoot IT systems, preparing them for roles in the booming tech industry.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: ["Computer Center", "Hardware & Networking Lab", "Programming Lab"],
    careers: [
      "System Administrator",
      "Software Tester",
      "Network Technician",
      "IT Support",
    ],
  },
  agricultural: {
    name: "Agricultural Engineering",
    degree: "Diploma",
    overview:
      "This Diploma course on Agricultural Engineering emphasis on agro Industries and Technical Industries in rural area, serving Rural farmers in a big way on Farm technology Transfer and imparting Technical Education.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: [
      "Farm Machinery Lab",
      "Soil and Water Conservation Lab",
      "Agro-Processing Lab",
    ],
    careers: [
      "Agricultural Supervisor",
      "Farm Machinery Technician",
      "Irrigation Technician",
    ],
  },
  petrochemical: {
    name: "Petrochemical Engineering",
    degree: "Diploma",
    overview:
      "Department of petrochemical engineering is committed to impart knowledge to students at all levels through a vibrant curriculum focusing on the processing of crude oil and natural gas into useful chemicals.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: [
      "Petrochemical Analysis Lab",
      "Process Control Lab",
      "Fluid Mechanics Lab",
    ],
    careers: [
      "Plant Operator",
      "Process Technician",
      "Quality Control Inspector in Refineries",
    ],
  },
  mechanical: {
    name: "Mechanical Engineering",
    degree: "Diploma",
    overview:
      "Started with the objective to create outstanding diploma engineers, with advanced teaching and learning aids. Covers fundamental principles of mechanics, thermodynamics, and manufacturing.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: ["Lathe and Machine Shop", "Thermal Engineering Lab", "CAD/CAM Lab"],
    careers: [
      "Maintenance Technician",
      "CNC Operator",
      "Production Supervisor",
      "Auto Mechanic",
    ],
  },
  eee: {
    name: "Electrical and Electronics Engineering",
    degree: "Diploma",
    overview:
      "The EEE department has been established with the firm commitment of developing and producing quality Electrical and Electronic Engineers with high-technical knowledge and good practical basis.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: [
      "Electrical Machines Lab",
      "Wiring and Winding Lab",
      "Electronics Lab",
    ],
    careers: [
      "Electrical Supervisor",
      "Maintenance Engineer",
      "Panel Board Wiring Technician",
    ],
  },
  civil: {
    name: "Civil Engineering",
    degree: "Diploma",
    overview:
      "Started with the objective to create outstanding diploma engineers, with advanced teaching and learning aids. Covers surveying, construction materials, and structural drawing.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: [
      "Surveying Practice Lab",
      "Material Testing Lab",
      "CAD in Civil Engineering Lab",
    ],
    careers: ["Site Supervisor", "Surveyor", "Draftsman", "Quality Estimator"],
  },
};

export async function generateStaticParams() {
  return Object.keys(courseData).map((slug) => ({
    course: slug,
  }));
}

export default async function PolyCourseDetailPage({
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
        title={`${course.degree} in ${course.name}`}
        subtitle="Polytechnic Program Details"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Polytechnic", href: "/institutions/polytechnic" },
            { label: "Programs", href: "/institutions/polytechnic/programs" },
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

            {/* 4. Practical Labs */}
            <section>
              <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                  🛠️
                </span>
                Practical Laboratories
              </h2>
              <p className="text-muted-foreground mb-6">
                Our diploma programs heavily emphasize practical skills.
                Students spend significant time in our fully equipped workshops
                and labs.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {course.labs.map((item: string, i: number) => (
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

            {/* 5. Career Scope & 6. Apprenticeship */}
            <section className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold">
                  <span className="bg-gold/20 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
                    💼
                  </span>
                  Career Scope
                </h2>
                <div className="flex flex-col gap-3">
                  {course.careers.map((career: string, i: number) => (
                    <span
                      key={i}
                      className="bg-surface border-l-gold rounded-lg border border-l-4 border-white/10 px-4 py-3 text-sm font-medium"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-fit rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
                <h3 className="text-gold mb-3 text-xl font-bold">
                  Apprenticeship & Jobs
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  JCT Polytechnic has strong ties with major industrial players.
                  We assist our diploma graduates in securing apprenticeships
                  and full-time employment immediately after completion.
                </p>
                <div className="inline-block rounded-md bg-white/10 px-3 py-2 text-xs">
                  100% Placement Assistance Provided
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Quick Facts Sidebar */}
            <div className="bg-surface border-border sticky top-32 rounded-3xl border p-6">
              <h3 className="mb-6 border-b border-white/10 pb-4 text-xl font-bold">
                Program Snapshot
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
                    Eligibility (Regular)
                  </div>
                  <div className="text-sm leading-snug font-medium">
                    {course.eligibility}
                  </div>
                </div>

                <div>
                  <div className="text-muted-foreground mb-1 text-sm">
                    Eligibility (Lateral Entry)
                  </div>
                  <div className="text-muted-foreground text-sm leading-snug font-medium">
                    Pass in 12th Std (HSC) OR ITI. Direct admission to 2nd year.
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
