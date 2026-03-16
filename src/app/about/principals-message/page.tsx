import type { Metadata } from "next";
import Image from "next/image";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Principal's Message | ${siteConfig.name}`,
  description:
    "Read the Principal's message — Dr. S. Karthikeyan shares his commitment to academic excellence at JCT College of Engineering & Technology.",
  openGraph: {
    title: `Principal's Message | ${siteConfig.name}`,
    description:
      "Read the Principal's message — Dr. S. Karthikeyan shares his commitment to academic excellence at JCT College of Engineering & Technology.",
    type: "website",
  },
};

export default function PrincipalsMessagePage() {
  const { name, designation, image, message } = aboutData.principalsMessage;

  return (
    <ContentPageLayout
      title="Principal's Message"
      subtitle="A Word From Our Principal"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "Principal's Message" },
      ]}
    >
      <div className="space-y-8">
        {/* Profile */}
        <div className="flex items-center gap-5">
          <Image
            src={image}
            alt={name}
            width={80}
            height={80}
            className="border-border rounded-full border object-cover"
          />
          <div>
            <h2 className="text-foreground font-serif text-xl font-bold">
              {name}
            </h2>
            <p className="text-muted-foreground text-sm">{designation}</p>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-5">
          {message.map((paragraph, index) => (
            <p
              key={index}
              className="text-muted-foreground text-base leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </ContentPageLayout>
  );
}
