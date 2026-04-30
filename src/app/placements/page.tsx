import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const recruiterLogos = [
  { name: "Google", src: "/company_logo/google-color.svg" },
  { name: "Microsoft", src: "/company_logo/microsoft.png" },
  { name: "Apple", src: "/company_logo/apple.png" },
  { name: "Amazon", src: "/company_logo/AMZN_BIG.svg" },
  { name: "TCS", src: "/company_logo/TCS.NS_BIG.svg" },
  { name: "IBM", src: "/company_logo/IBM.svg" },
  { name: "Intel", src: "/company_logo/INTC.svg" },
  { name: "Cisco", src: "/company_logo/CSCO.svg" },
  { name: "Adobe", src: "/company_logo/ADBE_BIG.svg" },
  { name: "Dell", src: "/company_logo/DELL_BIG.svg" },
  { name: "Oracle", src: "/company_logo/ORCL_BIG.svg" },
  { name: "Meta", src: "/company_logo/META_BIG.svg" },
  { name: "Netflix", src: "/company_logo/NFLX_BIG.svg" },
  { name: "NVIDIA", src: "/company_logo/NVDA_BIG.svg" },
  { name: "Ford", src: "/company_logo/F_BIG.svg" },
  { name: "Visa", src: "/company_logo/V.svg" },
  { name: "Mastercard", src: "/company_logo/MA.svg" },
  { name: "Walmart", src: "/company_logo/WMT_BIG.svg" },
];

export default function PlacementsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero
        title="Placements"
        subtitle="Empowering Careers, Shaping Futures"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={[{ label: "Placements" }]} />

        <div className="mt-12 space-y-20">
          {/* 1. Placement Overview */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Placement Overview
            </h2>
            <div className="text-muted-foreground mt-4 leading-relaxed">
              <p>
                The Training and Placement Cell at JCT Institutions acts as a
                bridge between students and the corporate world. We are
                dedicated to providing comprehensive training and placement
                assistance to ensure our students land their dream jobs.
              </p>
              <p className="mt-2">
                Our strong industry-academia linkage helps in organizing campus
                recruitment drives, bringing top-tier companies to our campus
                every year.
              </p>
            </div>
          </section>

          {/* 2. Placement Statistics */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Placement Statistics
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Placement Rate", value: "96%" },
                { label: "Top Recruiters", value: "250+" },
                { label: "Total Offers", value: "1500+" },
                { label: "Highest Package", value: "12 LPA" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-surface border-border rounded-xl border p-6 text-center shadow-sm"
                >
                  <div className="text-gold mb-2 text-4xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Top Recruiters */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Top Recruiters
            </h2>
            <div className="border-border bg-surface mt-6 rounded-3xl border p-8 text-center shadow-sm">
              <p className="text-muted-foreground mb-10">
                We are proud to partner with some of the world&apos;s leading
                companies.
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {recruiterLogos.map((company) => (
                  <div
                    key={company.name}
                    className="group relative flex items-center justify-center px-4"
                  >
                    <div className="relative h-12 w-full transition-all duration-300 group-hover:scale-110">
                      <Image
                        src={company.src}
                        alt={company.name}
                        fill
                        className="object-contain transition-all duration-300"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Highest Packages */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Highest Packages
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {[
                {
                  package: "12 LPA",
                  company: "Leading Product MNC",
                  role: "Software Development Engineer",
                },
                {
                  package: "10 LPA",
                  company: "Global Tech Giant",
                  role: "Data Scientist",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-border bg-surface flex items-center gap-6 rounded-2xl border p-6 shadow-sm"
                >
                  <div className="bg-gold/10 border-gold/20 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border">
                    <span className="text-gold text-xl font-bold">🏆</span>
                  </div>
                  <div>
                    <div className="text-foreground text-2xl font-bold">
                      {item.package}
                    </div>
                    <div className="mt-1 font-medium">{item.role}</div>
                    <div className="text-muted-foreground mt-1 text-sm">
                      {item.company}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Training Process */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Our Training Process
            </h2>
            <div className="border-border relative mt-8 ml-4 space-y-8 border-l-2 pl-8">
              {[
                {
                  title: "Aptitude & Soft Skills",
                  desc: "Continuous training from the first year focusing on quantitative aptitude, logical reasoning, and communication skills.",
                },
                {
                  title: "Technical Training",
                  desc: "Specialized bootcamps on emerging technologies like AI, Full Stack Development, and Core Engineering subjects.",
                },
                {
                  title: "Mock Interviews",
                  desc: "Rigorous mock interview sessions conducted by industry experts to build confidence.",
                },
                {
                  title: "Company Specific Training",
                  desc: "Tailored preparation modules based on the recruitment patterns of visiting companies.",
                },
              ].map((step, i) => (
                <div key={i} className="relative">
                  <div className="bg-gold border-background absolute top-1 -left-[41px] h-5 w-5 rounded-full border-4" />
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground mt-2">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Student Success Stories */}
          <section>
            <h2 className="text-foreground font-serif text-3xl font-bold">
              Student Success Stories
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface border-border rounded-xl border p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded-full text-[10px]">
                      Photo
                    </div>
                    <div>
                      <h4 className="font-bold">Student Name {i}</h4>
                      <p className="text-gold text-xs">Placed at Top MNC</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm italic">
                    &quot;The placement cell provided immense support and
                    guidance throughout my journey. The technical and soft skill
                    training was instrumental in securing my dream job.&quot;
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
