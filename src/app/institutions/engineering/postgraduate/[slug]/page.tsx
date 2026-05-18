import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  pgCourses as fallbackPg,
  researchCourses as fallbackResearch,
} from "@/data/engineering";
import { siteConfig } from "@/data/site";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";

type PostgraduateCourse = {
  name: string;
  abbr: string;
  slug: string;
  image?: string;
  highlight: string;
};

const fallbackCourses: PostgraduateCourse[] = [
  ...fallbackPg,
  ...fallbackResearch,
].map((c) => ({
  name: c.name,
  abbr: c.abbr,
  slug: c.slug,
  image: c.image,
  highlight: c.highlight,
}));

async function getPostgraduateCourses(): Promise<PostgraduateCourse[]> {
  try {
    await connectDB();
    const programs = await Program.find({
      institution: "engineering",
      is_active: true,
    })
      .select("name abbr slug image highlight degree")
      .sort({ sort_order: 1, name: 1 });

    const pgList = programs
      .filter((p) => {
        const degree = (p.degree || "").toLowerCase();
        return (
          degree.includes("m.e") ||
          degree.includes("m.tech") ||
          degree.includes("ph.d") ||
          degree.includes("phd") ||
          degree.includes("doctoral") ||
          degree.includes("pg")
        );
      })
      .map((p) => ({
        name: p.name,
        abbr: p.abbr,
        slug: p.slug,
        image: p.image,
        highlight: p.highlight,
      }));

    if (pgList.length === 0) return fallbackCourses;
    return pgList;
  } catch {
    return fallbackCourses;
  }
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const courses = await getPostgraduateCourses();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const courses = await getPostgraduateCourses();
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    return {};
  }

  return {
    title: `${course.name} | JCT College of Engineering & Technology`,
    description: course.highlight,
    alternates: {
      canonical: `${siteConfig.url}/institutions/engineering/postgraduate/${course.slug}`,
    },
    openGraph: {
      title: `${course.name} | JCT College of Engineering & Technology`,
      description: course.highlight,
      type: "website",
    },
  };
}

export default async function PostgraduateProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const courses = await getPostgraduateCourses();
  const course = courses.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="bg-background text-foreground engineering-theme min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="container mx-auto px-4 py-4">
        <Breadcrumb
          items={[
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Postgraduate Programs", href: "/institutions/engineering" },
            { label: course.name },
          ]}
        />
      </div>

      <PageHero
        title={course.name}
        subtitle={course.highlight}
      />

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
                {course.name} is an advanced postgraduate program designed to
                equip students with specialized knowledge and research skills.
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
                  <dd className="text-engineering font-semibold">{course.abbr}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold text-slate-700">Duration:</dt>
                  <dd className="text-slate-600">
                    {course.abbr === "Ph.D." ? "3-5 Years" : "2 Years"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-navy mb-3 text-xl font-semibold">
                Learning Outcomes
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-3 text-slate-700">
                  <span className="text-engineering mt-1 block h-2 w-2 shrink-0 rounded-full"></span>
                  Advanced knowledge in {course.highlight.toLowerCase()}
                </li>
                <li className="flex gap-3 text-slate-700">
                  <span className="text-engineering mt-1 block h-2 w-2 shrink-0 rounded-full"></span>
                  Research and analytical skills
                </li>
                <li className="flex gap-3 text-slate-700">
                  <span className="text-engineering mt-1 block h-2 w-2 shrink-0 rounded-full"></span>
                  Industry-relevant specialization
                </li>
                <li className="flex gap-3 text-slate-700">
                  <span className="text-engineering mt-1 block h-2 w-2 shrink-0 rounded-full"></span>
                  Professional competency development
                </li>
              </ul>
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
