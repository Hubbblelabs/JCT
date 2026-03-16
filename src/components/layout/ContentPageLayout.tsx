import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type ContentPageLayoutProps = {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
  children: React.ReactNode;
};

export function ContentPageLayout({
  title,
  subtitle,
  breadcrumbs,
  children,
}: ContentPageLayoutProps) {
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar />
      <PageHero title={title} subtitle={subtitle} />

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb items={breadcrumbs} />

        <div className="mt-8 max-w-4xl">{children}</div>
      </div>

      <Footer />
    </main>
  );
}
