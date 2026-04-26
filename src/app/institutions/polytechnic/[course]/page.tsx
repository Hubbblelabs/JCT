import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const courseData: Record<string, { name: string; degree: string; overview: string; duration: string; eligibility: string; labs: string[]; careers: string[] }> = {
  "computer": {
    name: "Computer Technology",
    degree: "Diploma",
    overview: "Provides a solid foundation in computer software, hardware, and networking. Students learn to build, maintain, and troubleshoot IT systems, preparing them for roles in the booming tech industry.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: ["Computer Center", "Hardware & Networking Lab", "Programming Lab"],
    careers: ["System Administrator", "Software Tester", "Network Technician", "IT Support"]
  },
  "agricultural": {
    name: "Agricultural Engineering",
    degree: "Diploma",
    overview: "This Diploma course on Agricultural Engineering emphasis on agro Industries and Technical Industries in rural area, serving Rural farmers in a big way on Farm technology Transfer and imparting Technical Education.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: ["Farm Machinery Lab", "Soil and Water Conservation Lab", "Agro-Processing Lab"],
    careers: ["Agricultural Supervisor", "Farm Machinery Technician", "Irrigation Technician"]
  },
  "petrochemical": {
    name: "Petrochemical Engineering",
    degree: "Diploma",
    overview: "Department of petrochemical engineering is committed to impart knowledge to students at all levels through a vibrant curriculum focusing on the processing of crude oil and natural gas into useful chemicals.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: ["Petrochemical Analysis Lab", "Process Control Lab", "Fluid Mechanics Lab"],
    careers: ["Plant Operator", "Process Technician", "Quality Control Inspector in Refineries"]
  },
  "mechanical": {
    name: "Mechanical Engineering",
    degree: "Diploma",
    overview: "Started with the objective to create outstanding diploma engineers, with advanced teaching and learning aids. Covers fundamental principles of mechanics, thermodynamics, and manufacturing.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: ["Lathe and Machine Shop", "Thermal Engineering Lab", "CAD/CAM Lab"],
    careers: ["Maintenance Technician", "CNC Operator", "Production Supervisor", "Auto Mechanic"]
  },
  "eee": {
    name: "Electrical and Electronics Engineering",
    degree: "Diploma",
    overview: "The EEE department has been established with the firm commitment of developing and producing quality Electrical and Electronic Engineers with high-technical knowledge and good practical basis.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: ["Electrical Machines Lab", "Wiring and Winding Lab", "Electronics Lab"],
    careers: ["Electrical Supervisor", "Maintenance Engineer", "Panel Board Wiring Technician"]
  },
  "civil": {
    name: "Civil Engineering",
    degree: "Diploma",
    overview: "Started with the objective to create outstanding diploma engineers, with advanced teaching and learning aids. Covers surveying, construction materials, and structural drawing.",
    duration: "3 Years (6 Semesters)",
    eligibility: "Pass in 10th Standard (SSLC) or equivalent.",
    labs: ["Surveying Practice Lab", "Material Testing Lab", "CAD in Civil Engineering Lab"],
    careers: ["Site Supervisor", "Surveyor", "Draftsman", "Quality Estimator"]
  }
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
      <PageHero title={`${course.degree} in ${course.name}`} subtitle="Polytechnic Program Details" />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[
          { label: "Institutions", href: "/institutions" },
          { label: "Polytechnic", href: "/institutions/polytechnic" },
          { label: "Programs", href: "/institutions/polytechnic/programs" },
          { label: course.name }
        ]} />

        <div className="mt-12 grid lg:grid-cols-[2fr_1fr] gap-12">

          <div className="space-y-12">
            {/* 1. Course Overview */}
            <section>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Course Overview</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{course.overview}</p>
            </section>

            {/* 4. Practical Labs */}
            <section>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <span className="w-10 h-10 bg-gold/20 text-gold rounded-xl flex items-center justify-center">🛠️</span>
                Practical Laboratories
              </h2>
              <p className="text-muted-foreground mb-6">Our diploma programs heavily emphasize practical skills. Students spend significant time in our fully equipped workshops and labs.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {course.labs.map((item: string, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold shrink-0"></div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Career Scope & 6. Apprenticeship */}
            <section className="grid sm:grid-cols-2 gap-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gold/20 text-gold rounded-xl flex items-center justify-center">💼</span>
                  Career Scope
                </h2>
                <div className="flex flex-col gap-3">
                  {course.careers.map((career: string, i: number) => (
                    <span key={i} className="px-4 py-3 bg-surface border border-white/10 rounded-lg text-sm font-medium border-l-4 border-l-gold">
                      {career}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-6 rounded-2xl h-fit">
                <h3 className="font-bold text-xl mb-3 text-gold">Apprenticeship & Jobs</h3>
                <p className="text-sm text-muted-foreground mb-4">JCT Polytechnic has strong ties with major industrial players. We assist our diploma graduates in securing apprenticeships and full-time employment immediately after completion.</p>
                <div className="text-xs bg-white/10 px-3 py-2 rounded-md inline-block">100% Placement Assistance Provided</div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            {/* Quick Facts Sidebar */}
            <div className="bg-surface border border-border rounded-3xl p-6 sticky top-32">
              <h3 className="font-bold text-xl mb-6 pb-4 border-b border-white/10">Program Snapshot</h3>

              <div className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Degree</div>
                  <div className="font-bold">{course.degree}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Duration</div>
                  <div className="font-bold">{course.duration}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Eligibility (Regular)</div>
                  <div className="font-medium text-sm leading-snug">{course.eligibility}</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Eligibility (Lateral Entry)</div>
                  <div className="font-medium text-sm leading-snug text-white/80">Pass in 12th Std (HSC) OR ITI. Direct admission to 2nd year.</div>
                </div>
              </div>

              {/* 7. Apply CTA */}
              <Link href="/apply-now" className="w-full block text-center bg-gold text-navy font-bold py-4 rounded-xl hover:bg-[#e8b84a] transition-colors mt-8">
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
