import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { governanceData } from "@/data/governance";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Anti-Ragging Cell | ${siteConfig.name}`,
  description:
    "JCT Institutions maintains a strict anti-ragging policy with 24/7 helpline, CCTV surveillance, and awareness programs.",
  openGraph: {
    title: `Anti-Ragging Cell | ${siteConfig.name}`,
    description:
      "JCT Institutions maintains a strict anti-ragging policy with 24/7 helpline, CCTV surveillance, and awareness programs.",
    type: "website",
  },
};

export default function AntiRaggingPage() {
  const { title, subtitle, description, measures, committee, helpline } =
    governanceData.antiRagging;

  return (
    <ContentPageLayout
      title={title}
      subtitle={subtitle}
      breadcrumbs={[
        { label: "Governance", href: "/governance" },
        { label: "Anti-Ragging Cell" },
      ]}
    >
      <div className="space-y-12">
        <section>
          <p className="text-muted-foreground text-base leading-relaxed">
            {description}
          </p>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Anti-Ragging Measures
          </h2>
          <ul className="mt-4 space-y-2">
            {measures.map((measure) => (
              <li
                key={measure}
                className="text-muted-foreground flex items-start gap-2 text-sm leading-relaxed"
              >
                <span className="text-gold mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                {measure}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Committee Members
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {committee.map((member) => (
              <div
                key={member.name}
                className="border-border rounded-xl border p-5"
              >
                <h3 className="text-foreground font-sans text-sm font-semibold">
                  {member.name}
                </h3>
                <p className="text-gold mt-1 text-xs font-medium">
                  {member.role}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {member.designation}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-border rounded-xl border p-6">
          <h2 className="text-foreground font-serif text-xl font-bold">
            Anti-Ragging Helpline
          </h2>
          <p className="text-gold mt-2 text-2xl font-bold">{helpline}</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Available 24/7 — Report ragging incidents immediately.
          </p>
        </section>
      </div>
    </ContentPageLayout>
  );
}
