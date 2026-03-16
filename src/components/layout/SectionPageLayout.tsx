import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type SubPage = {
  name: string;
  href: string;
  description?: string;
};

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type SectionPageLayoutProps = {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  description?: string;
  subPages: SubPage[];
  children?: React.ReactNode;
};

export function SectionPageLayout({
  title,
  subtitle,
  breadcrumbs,
  description,
  subPages,
  children,
}: SectionPageLayoutProps) {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title={title} subtitle={subtitle} />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={breadcrumbs} />

        {description && (
          <p className="text-muted-foreground mt-6 max-w-3xl text-base leading-relaxed">
            {description}
          </p>
        )}

        {children && <div className="mt-8">{children}</div>}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="border-border bg-surface card-hover-lift group hover:border-gold/30 flex items-center justify-between rounded-xl border p-5 transition-colors"
            >
              <div>
                <h3 className="text-foreground group-hover:text-gold font-sans text-sm font-semibold transition-colors">
                  {page.name}
                </h3>
                {page.description && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {page.description}
                  </p>
                )}
              </div>
              <ArrowRight
                size={16}
                className="text-muted-foreground group-hover:text-gold shrink-0 transition-colors"
              />
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
