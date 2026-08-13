import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogDetailLayout } from "@/components/layout/BlogDetailLayout";
import {
  getPublicBlogBySlug,
  listPublicBlogSlugs,
  listRelatedBlogs,
} from "@/lib/public-blogs";

export const revalidate = 3600;

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listPublicBlogSlugs();
}

export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);
  if (!blog) return { title: "Blog not found" };
  return {
    title: `${blog.title} | JCT Institutions`,
    description: blog.excerpt || undefined,
    openGraph: blog.image ? { images: [{ url: blog.image }] } : undefined,
  };
}

export default async function BlogDetailPage({ params }: PageParams) {
  const { slug } = await params;
  const blog = await getPublicBlogBySlug(slug);
  if (!blog) notFound();

  const related = await listRelatedBlogs({
    slug: blog.slug,
    institution: blog.institution,
  });

  return (
    <main className="bg-surface text-foreground min-h-screen">
      <Navbar forceSolidOnTop />
      {/* Push content below the fixed navbar */}
      <div className="pt-24 md:pt-28" />
      <BlogDetailLayout blog={blog} related={related} />
      <Footer />
    </main>
  );
}
