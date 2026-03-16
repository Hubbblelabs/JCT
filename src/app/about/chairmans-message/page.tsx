import type { Metadata } from "next";
import Image from "next/image";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { aboutData } from "@/data/about";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Chairman's Message | ${siteConfig.name}`,
  description:
    "Read the Chairman's message — Dr. R. Jayaraman shares his vision for JCT Institutions and the future of education.",
  openGraph: {
    title: `Chairman's Message | ${siteConfig.name}`,
    description:
      "Read the Chairman's message — Dr. R. Jayaraman shares his vision for JCT Institutions and the future of education.",
    type: "website",
  },
};

export default function ChairmansMessagePage() {
  const { name, designation, image, message } = aboutData.chairmansMessage;

  return (
    <ContentPageLayout
      title="Chairman's Message"
      subtitle="A Word From Our Chairman"
      breadcrumbs={[
        { label: "About JCT", href: "/about" },
        { label: "Chairman's Message" },
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
