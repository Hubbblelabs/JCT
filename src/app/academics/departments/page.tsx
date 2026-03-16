import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { academicsData } from "@/data/academics";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Departments | ${siteConfig.name}`,
  description:
    "Explore departments across JCT Engineering, Arts & Science, and Polytechnic colleges — each dedicated to academic excellence.",
  openGraph: {
    title: `Departments | ${siteConfig.name}`,
    description:
      "Explore departments across JCT Engineering, Arts & Science, and Polytechnic colleges — each dedicated to academic excellence.",
    type: "website",
  },
};

const colleges = [
  {
    name: "Engineering & Technology",
    href: "/engineering",
    description: "Departments of CSE, ECE, EEE, Mechanical, Civil, and more.",
  },
  {
    name: "Arts & Science",
    href: "/arts-science",
    description:
      "Departments of Computer Science, Commerce, Business Administration, Mathematics, and more.",
  },
  {
    name: "Polytechnic",
    href: "/polytechnic",
    description:
      "Departments of Computer Engineering, Mechanical, Electrical, and more.",
  },
];

export default function DepartmentsPage() {
  const { title, subtitle } = academicsData.departments;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Academics", href: "/academics" },
        { label: "Departments" },
      ]}
    >
      <p className="text-muted-foreground text-sm leading-relaxed">
        Our departments span three institutions, each offering specialized
        programs with experienced faculty and modern facilities.
      </p>

      <div className="mt-8 space-y-4">
        {colleges.map((college) => (
          <Link
            key={college.href}
            href={college.href}
            className="border-border bg-surface hover:border-gold/30 group flex items-center justify-between rounded-xl border p-5 transition-colors"
          >
            <div>
              <h3 className="text-foreground group-hover:text-gold font-serif text-base font-semibold transition-colors">
                {college.name}
              </h3>
              <p className="text-muted-foreground mt-1 text-sm">
                {college.description}
              </p>
            </div>
            <ArrowRight
              size={18}
              className="text-muted-foreground group-hover:text-gold shrink-0 transition-colors"
            />
          </Link>
        ))}
      </div>
    </ContentPageLayout>
  );
}
