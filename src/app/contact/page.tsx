import type { Metadata } from "next";
import { ContentPageLayout } from "@/components/layout/ContentPageLayout";
import { ContactForm } from "@/components/ui/ContactForm";
import { siteConfig } from "@/data/site";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: `Contact Us | ${siteConfig.name}`,
  description:
    "Get in touch with JCT Institutions — visit our campus, call us, or send an enquiry. Located at Knowledge Park, Pichanur, Coimbatore.",
  openGraph: {
    title: `Contact Us | ${siteConfig.name}`,
    description:
      "Get in touch with JCT Institutions — visit our campus, call us, or send an enquiry. Located at Knowledge Park, Pichanur, Coimbatore.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <ContentPageLayout
      title="Contact Us"
      subtitle="We'd Love to Hear From You"
      breadcrumbs={[{ label: "Contact" }]}
    >
      <div className="space-y-12">
        {/* Contact Info Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border-border rounded-xl border p-5">
            <MapPin size={20} className="text-gold" />
            <h3 className="text-foreground mt-3 font-sans text-sm font-semibold">
              Visit Us
            </h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
              {siteConfig.address.full}
            </p>
            <a
              href={siteConfig.address.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold mt-2 inline-block text-xs font-medium hover:underline"
            >
              Get Directions →
            </a>
          </div>

          <div className="border-border rounded-xl border p-5">
            <Phone size={20} className="text-gold" />
            <h3 className="text-foreground mt-3 font-sans text-sm font-semibold">
              Call Us
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {siteConfig.contact.phone}
            </p>
            <p className="text-muted-foreground text-sm">
              {siteConfig.contact.phoneAlt}
            </p>
          </div>

          <div className="border-border rounded-xl border p-5">
            <Mail size={20} className="text-gold" />
            <h3 className="text-foreground mt-3 font-sans text-sm font-semibold">
              Email Us
            </h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {siteConfig.contact.email}
            </p>
            <p className="text-muted-foreground text-sm">
              {siteConfig.contact.admissionsEmail}
            </p>
          </div>
        </section>

        {/* Google Maps Embed */}
        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Our Location
          </h2>
          <div className="border-border mt-4 overflow-hidden rounded-xl border">
            <iframe
              src={siteConfig.address.mapEmbedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="JCT Institutions Location"
            />
          </div>
        </section>

        {/* Enquiry Form */}
        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Send an Enquiry
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Fill out the form below and our admissions team will get back to you
            shortly.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

        {/* Social Media */}
        <section>
          <h2 className="text-foreground font-serif text-xl font-bold">
            Follow Us
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(siteConfig.social).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border hover:border-gold/30 hover:text-gold text-muted-foreground rounded-lg border px-4 py-2 text-sm capitalize transition-colors"
              >
                {platform}
              </a>
            ))}
          </div>
        </section>
      </div>
    </ContentPageLayout>
  );
}
