import type { Metadata } from "next";
import { FileCheck, Phone, Mail } from "lucide-react";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { ContactForm } from "@/components/ui/ContactForm";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `Apply Now | Admissions | ${siteConfig.name}`,
  description:
    "Apply to JCT Institutions — fill out the enquiry form to begin your admission process for Engineering, Arts & Science, or Polytechnic programs.",
  openGraph: {
    title: `Apply Now | Admissions | ${siteConfig.name}`,
    description:
      "Apply to JCT Institutions — fill out the enquiry form to begin your admission process for Engineering, Arts & Science, or Polytechnic programs.",
    type: "website",
  },
};

const documents = [
  "10th & 12th mark sheets (original + 2 copies)",
  "Transfer Certificate (TC)",
  "Community Certificate",
  "Passport-size photographs (6 nos.)",
  "Aadhaar Card copy",
  "TNEA / DOTE allotment order (if applicable)",
];

export default function ApplyPage() {
  return (
    <ContentPageLayout
      title="Apply Now"
      subtitle="Start your journey at JCT Institutions today."
      breadcrumbs={[
        { label: "Admissions", href: "/admissions" },
        { label: "Apply Now" },
      ]}
    >
      <div className="space-y-10">
        {/* Instructions */}
        <div className="space-y-4">
          <h2 className="text-foreground font-serif text-xl font-bold">
            How to Apply
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Fill out the enquiry form below and our admissions team will contact
            you within 24 hours. You can also visit the admissions office in
            person or reach us directly.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="text-foreground hover:text-gold inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Phone size={16} className="text-gold" />
              {siteConfig.contact.phone}
            </a>
            <a
              href={`mailto:${siteConfig.contact.admissionsEmail}`}
              className="text-foreground hover:text-gold inline-flex items-center gap-2 text-sm transition-colors"
            >
              <Mail size={16} className="text-gold" />
              {siteConfig.contact.admissionsEmail}
            </a>
          </div>
        </div>

        {/* Documents Required */}
        <div>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Documents Required
          </h2>
          <ul className="mt-4 space-y-2">
            {documents.map((doc) => (
              <li key={doc} className="flex items-start gap-3">
                <FileCheck size={16} className="text-gold mt-0.5 shrink-0" />
                <span className="text-muted-foreground text-sm">{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enquiry Form */}
        <div>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Admission Enquiry Form
          </h2>
          <p className="text-muted-foreground mt-1 mb-5 text-sm">
            Fields marked with * are required.
          </p>
          <ContactForm />
        </div>
      </div>
    </ContentPageLayout>
  );
}
