"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { PublicBlogCard } from "@/lib/public-blogs";
import { formatEventDate } from "@/lib/utils";
import { Pagination } from "@/components/ui/Pagination";

/** Cards per page — a multiple of the 3-column grid so rows stay full. */
const PAGE_SIZE = 9;

const ALL = "All";

export function BlogsPageLayout({ blogs }: { blogs: PublicBlogCard[] }) {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>(ALL);
  const gridRef = useRef<HTMLDivElement>(null);
  // Only scroll back to the grid on a real page change, never on first paint.
  const paged = useRef(false);

  // Categories are free text in the CMS, so the filter row is derived from
  // what is actually published rather than from a fixed list.
  const categories = useMemo(() => {
    const seen: string[] = [];
    for (const blog of blogs) {
      if (blog.category && !seen.includes(blog.category))
        seen.push(blog.category);
    }
    return seen.sort((a, b) => a.localeCompare(b));
  }, [blogs]);

  const filtered = useMemo(
    () =>
      category === ALL ? blogs : blogs.filter((b) => b.category === category),
    [blogs, category],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Publishing or unpublishing a post can shrink the list under the current
  // page while this component stays mounted; so can changing the filter.
  const current = Math.min(page, pageCount);
  const visible = filtered.slice(
    (current - 1) * PAGE_SIZE,
    current * PAGE_SIZE,
  );

  useEffect(() => {
    if (!paged.current) return;
    const top =
      (gridRef.current?.getBoundingClientRect().top ?? 0) +
      window.scrollY -
      120;
    window.scrollTo({ top, behavior: "smooth" });
  }, [current]);

  const goTo = (next: number) => {
    paged.current = true;
    setPage(next);
  };

  const pickCategory = (next: string) => {
    setCategory(next);
    setPage(1);
  };

  return (
    <section className="bg-surface py-12 md:py-16">
      <div ref={gridRef} className="container mx-auto max-w-350 px-4 md:px-8">
        {categories.length > 1 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {[ALL, ...categories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => pickCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-1.5 font-sans text-xs font-bold tracking-wide uppercase transition-colors ${
                  category === c
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="border-border bg-background rounded-2xl border py-20 text-center">
            <p className="text-muted-foreground font-sans text-base">
              No blog posts have been published yet. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((blog, i) => (
              <motion.article
                key={blog._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i % 3, 2) * 0.08 }}
                className="group border-border bg-background shadow-card hover:shadow-elevated flex flex-col overflow-hidden rounded-2xl border transition-shadow"
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="flex h-full flex-col"
                >
                  <div className="bg-muted relative h-52 w-full overflow-hidden">
                    {blog.image ? (
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="from-primary/90 to-primary/60 absolute inset-0 bg-linear-to-br" />
                    )}
                    {blog.category && (
                      <span className="bg-accent text-accent-foreground absolute top-4 left-4 rounded px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase">
                        {blog.category}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-xs">
                      {blog.date && (
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} className="text-accent" />
                          {formatEventDate(blog.date)}
                        </span>
                      )}
                      {blog.author && (
                        <span className="inline-flex items-center gap-1.5">
                          <User size={13} className="text-accent" />
                          {blog.author}
                        </span>
                      )}
                    </div>

                    <h3 className="text-foreground mb-2 font-serif text-xl leading-snug italic">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-muted-foreground mb-4 line-clamp-3 font-sans text-sm leading-relaxed">
                        {blog.excerpt}
                      </p>
                    )}

                    <span className="text-accent mt-auto inline-flex items-center gap-1.5 font-sans text-sm font-bold tracking-wide">
                      Read more
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <>
            <Pagination
              page={current}
              pageCount={pageCount}
              onChange={goTo}
              label="Blogs pagination"
            />
            {pageCount > 1 && (
              <p className="text-muted-foreground mt-4 text-center font-sans text-xs">
                Showing {(current - 1) * PAGE_SIZE + 1}–
                {(current - 1) * PAGE_SIZE + visible.length} of{" "}
                {filtered.length} posts
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
