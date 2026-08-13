import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { BlogsPageLayout } from "@/components/layout/BlogsPageLayout";
import { listPublicBlogs, type PublicBlogCard } from "@/lib/public-blogs";

export const revalidate = 3600;

async function getBlogs(): Promise<PublicBlogCard[]> {
  // Degrade to the layout's empty state instead of failing the whole page
  // when the DB is unreachable (e.g. during `next build` without a DB) —
  // ISR retries on the next revalidation.
  try {
    return await listPublicBlogs();
  } catch (err) {
    console.warn("[blogs] listPublicBlogs failed; rendering empty:", err);
    return [];
  }
}

const SEO_FALLBACK: Metadata = {
  title: "Blogs | JCT Institutions, Coimbatore",
  description:
    "Course guides, career advice and campus stories from JCT College of Engineering, Arts & Science, and Polytechnic, Coimbatore.",
};

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      <PageHero
        title="Blogs"
        subtitle="Course guides, career advice and campus stories from JCT."
      />
      <BlogsPageLayout blogs={blogs} />
      <Footer />
    </main>
  );
}

// Admin-managed meta tags win; the fallback above stands when no
// override is set in the CMS.
export async function generateMetadata(): Promise<Metadata> {
  const seo = await seoMetadata({ scope: "main", path: "/blogs" });
  return { ...SEO_FALLBACK, ...seo };
}
