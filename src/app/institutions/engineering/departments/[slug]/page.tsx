import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { TabsDepartmentLayout } from "@/components/layout/TabsDepartmentLayout";
import { normalizeTabsContent } from "@/lib/department-tabs";
import { siteConfig } from "@/data/site";
import { connectDB } from "@/lib/mongodb";
import { Program, Department } from "@/lib/models";

type ProgramSlim = {
  name: string;
  abbr: string;
  slug: string;
  image?: string;
  highlight: string;
  degree?: string;
};

async function getAllEngineeringPrograms(): Promise<ProgramSlim[]> {
  try {
    await connectDB();
    const programs = await Program.find({
      institution: "engineering",
      is_active: true,
    })
      .select("name abbr slug image highlight degree")
      .sort({ sort_order: 1, name: 1 });

    return programs.map((p) => ({
      name: p.name,
      abbr: p.abbr,
      slug: p.slug,
      image: p.image,
      highlight: p.highlight,
      degree: p.degree,
    }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const programs = await getAllEngineeringPrograms();
  return programs.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const programs = await getAllEngineeringPrograms();
  const course = programs.find((c) => c.slug === slug);
  if (!course) return {};
  return {
    title: `${course.name} | JCT College of Engineering & Technology`,
    description: course.highlight,
    alternates: {
      canonical: `${siteConfig.url}/institutions/engineering/departments/${course.slug}`,
    },
    openGraph: {
      title: `${course.name} | JCT College of Engineering & Technology`,
      description: course.highlight,
      type: "website",
    },
  };
}

function ProgramFallbackPage({ course }: { course: ProgramSlim }) {
  const degree = (course.degree ?? "").toLowerCase();
  const isPhd =
    degree.includes("ph.d") ||
    degree.includes("phd") ||
    degree.includes("doctoral");
  const isPg =
    isPhd ||
    degree.includes("m.e") ||
    degree.includes("m.tech") ||
    degree.includes("pg");

  return (
    <main className="bg-background text-foreground engineering-theme min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            { label: "Engineering", href: "/institutions/engineering" },
            {
              label: isPg ? "Postgraduate Programs" : "Programs",
              href: "/institutions/engineering",
            },
            { label: course.name },
          ]}
        />
      </div>

      <PageHero title={course.name} subtitle={course.highlight} />

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="mb-8">
            <h2 className="text-navy mb-2 font-serif text-3xl font-bold">
              {course.name}
            </h2>
            <p className="text-lg leading-relaxed text-slate-600">
              {course.highlight}
            </p>
          </div>

          <div className="space-y-8">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-navy mb-3 text-xl font-semibold">
                Program Overview
              </h3>
              <p className="leading-relaxed text-slate-700">
                {course.name}
                {isPg
                  ? " is an advanced postgraduate program designed to equip students with specialized knowledge and research skills."
                  : " is an industry-aligned program designed to deliver hands-on engineering training and career-ready skills."}{" "}
                The curriculum focuses on {course.highlight.toLowerCase()}.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-navy mb-3 text-xl font-semibold">
                Program Details
              </h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="font-semibold text-slate-700">Program Code:</dt>
                  <dd className="text-engineering font-semibold">
                    {course.abbr}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold text-slate-700">Duration:</dt>
                  <dd className="text-slate-600">
                    {isPhd ? "3-5 Years" : isPg ? "2 Years" : "4 Years"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8 rounded-lg bg-engineering/5 p-6 text-center">
              <p className="mb-4 text-slate-600">
                Interested in this program?
              </p>
              <a
                href={`https://wa.me/9194460904?text=I%20am%20interested%20in%20${encodeURIComponent(course.name)}`}
                className="text-engineering hover:text-engineering/80 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold shadow-sm transition-colors"
              >
                Inquire Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

async function getDepartmentContent(slug: string): Promise<unknown | null> {
  try {
    await connectDB();
    const doc = await Department.findOne({ slug }).lean<{
      content?: unknown;
      published_content?: unknown;
      status?: string;
    }>();
    if (!doc) return null;
    if (doc.status === "published" && doc.published_content)
      return doc.published_content;
    return doc.content ?? null;
  } catch {
    return null;
  }
}

export default async function EngineeringDepartmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbContent = await getDepartmentContent(slug);
  const tabsDept = normalizeTabsContent(dbContent);
  if (tabsDept) {
    return (
      <TabsDepartmentLayout
        dept={tabsDept}
        backHref="/institutions/engineering"
        backLabel="Back to Engineering"
      />
    );
  }

  const programs = await getAllEngineeringPrograms();
  const course = programs.find((item) => item.slug === slug);
  if (!course) {
    notFound();
  }
  return <ProgramFallbackPage course={course} />;
}
