"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import type { PublicBlogCard, PublicBlogDetail } from "@/lib/public-blogs";
import { formatEventDate } from "@/lib/utils";

const INSTITUTION_LABELS: Record<string, string> = {
  engineering: "JCT College of Engineering and Technology",
  "arts-science": "JCT College of Arts and Science",
  polytechnic: "JCT Polytechnic College",
};

export function BlogDetailLayout({
  blog,
  related = [],
}: {
  blog: PublicBlogDetail;
  related?: PublicBlogCard[];
}) {
  const college = INSTITUTION_LABELS[blog.institution];

  return (
    <article className="bg-surface py-10 md:py-14">
      <div className="container mx-auto max-w-4xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/blogs"
            className="text-accent mb-6 inline-flex items-center gap-1.5 font-sans text-sm font-bold tracking-wide underline-offset-4 hover:underline"
          >
            <ArrowLeft size={15} />
            All blogs
          </Link>

          {blog.image && (
            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-3xl md:h-96">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                priority
                sizes="(min-width: 896px) 896px, 100vw"
                className="object-cover"
              />
              {blog.category && (
                <span className="bg-accent text-accent-foreground absolute top-5 left-5 rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                  {blog.category}
                </span>
              )}
            </div>
          )}

          {!blog.image && blog.category && (
            <span className="bg-accent text-accent-foreground mb-4 inline-block rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
              {blog.category}
            </span>
          )}

          <h1 className="text-foreground mb-4 font-serif text-3xl leading-tight italic md:text-4xl">
            {blog.title}
          </h1>

          <div className="text-muted-foreground border-border mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b pb-6 font-sans text-sm">
            {blog.date && (
              <span className="inline-flex items-center gap-2">
                <Calendar size={15} className="text-accent" />
                {formatEventDate(blog.date)}
              </span>
            )}
            {blog.author && (
              <span className="inline-flex items-center gap-2">
                <User size={15} className="text-accent" />
                {blog.author}
              </span>
            )}
            {college && <span className="text-xs">{college}</span>}
          </div>

          {blog.excerpt && (
            <p className="text-foreground/80 mb-6 text-justify font-sans text-lg leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          {blog.contentHtml && (
            <div
              className="text-foreground/90 [&_a]:text-accent [&_blockquote]:border-accent [&_blockquote]:text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_hr]:border-border [&_td]:border-border [&_th]:border-border [&_th]:bg-muted text-justify font-sans text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:italic [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:italic [&_hr]:my-8 [&_li]:mb-1.5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_table]:mb-4 [&_table]:w-full [&_td]:border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
              // Pre-sanitized server-side in getPublicBlogBySlug (sanitizeHtml).
              dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
            />
          )}

          {related.length > 0 && (
            <section className="border-border mt-12 border-t pt-8">
              <h2 className="text-foreground mb-5 font-serif text-2xl italic">
                Read next
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((post) => (
                  <Link
                    key={post._id}
                    href={`/blogs/${post.slug}`}
                    className="group border-border bg-background hover:shadow-card flex flex-col overflow-hidden rounded-2xl border transition-shadow"
                  >
                    <div className="bg-muted relative h-32 w-full overflow-hidden">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(min-width: 640px) 30vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="from-primary/90 to-primary/60 absolute inset-0 bg-linear-to-br" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="text-foreground mb-2 line-clamp-3 font-serif text-base leading-snug italic">
                        {post.title}
                      </h3>
                      <span className="text-accent mt-auto inline-flex items-center gap-1.5 font-sans text-xs font-bold tracking-wide">
                        Read
                        <ArrowRight
                          size={13}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </article>
  );
}
