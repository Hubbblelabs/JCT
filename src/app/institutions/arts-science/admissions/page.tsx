import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function ArtsScienceAdmissionsPage() {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Arts & Science Admissions"
        subtitle="Join JCT College of Arts and Science"
      />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Institutions", href: "/institutions" },
            { label: "Arts & Science", href: "/institutions/arts-science" },
            { label: "Admissions" },
          ]}
        />

        <div className="mt-12 mb-16 max-w-4xl">
          <h2 className="text-primary mb-6 font-serif text-3xl">
            Admission Process
          </h2>
          <div className="space-y-6">
            <p className="text-foreground/80 text-lg">
              Welcome to the admissions portal of JCT College of Arts and
              Science. We offer a wide range of undergraduate and postgraduate
              programs.
            </p>
            <div className="border-secondary/20 rounded-lg border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold">How to Apply</h3>
              <ol className="text-foreground/70 list-inside list-decimal space-y-3">
                <li>Register online through our admissions portal.</li>
                <li>Fill out the application form with required details.</li>
                <li>Upload necessary documents and pay the application fee.</li>
                <li>Await confirmation and counseling dates.</li>
              </ol>
              <div className="mt-8">
                <Link
                  href="/apply-now"
                  className="bg-primary hover:bg-primary/90 rounded-md px-6 py-3 font-medium text-white transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
