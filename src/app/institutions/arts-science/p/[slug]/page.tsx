import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { DynamicPageRenderer } from "@/components/layout/DynamicPageRenderer";
import {
  getPublishedPageBySlug,
  listPublishedPageSlugs,
} from "@/lib/public-pages";

export const revalidate = 3600;

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listPublishedPageSlugs("arts-science");
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug({
    institution: "arts-science",
    slug,
  });
  if (!page) return { title: "Page not found" };
  const seo = page.content.seo;
  return {
    title: seo?.metaTitle || page.title,
    description: seo?.metaDescription || undefined,
    keywords: seo?.keywords?.length ? seo.keywords : undefined,
    openGraph: seo?.ogImage ? { images: [{ url: seo.ogImage }] } : undefined,
    robots: seo?.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function ArtsScienceDynamicPage({ params }: PageParams) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug({
    institution: "arts-science",
    slug,
  });
  if (!page) notFound();
  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      {page.template !== "hero-content" && (
        <PageHero
          title={page.title}
          subtitle={page.content.seo?.metaDescription}
        />
      )}
      <DynamicPageRenderer template={page.template} content={page.content} />
      <Footer />
    </main>
  );
}
