import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventDetailLayout } from "@/components/layout/EventDetailLayout";
import {
  getPublicEventBySlug,
  listPublicEventSlugs,
} from "@/lib/public-events";

export const revalidate = 3600;

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listPublicEventSlugs();
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) return { title: "Event not found" };
  return {
    title: `${event.title} | JCT Institutions`,
    description: event.excerpt || undefined,
    openGraph: event.image ? { images: [{ url: event.image }] } : undefined,
  };
}

export default async function EventDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug);
  if (!event) notFound();

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      {/* Push content below the fixed navbar */}
      <div className="pt-24 md:pt-28" />
      <EventDetailLayout event={event} />
      <Footer />
    </main>
  );
}
