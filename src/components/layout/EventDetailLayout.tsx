"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Check,
  Expand,
  ExternalLink,
  Link2,
  MapPin,
  School,
  Tag,
} from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { PublicEventCard, PublicEventDetail } from "@/lib/public-events";
import { formatEventDate } from "@/lib/utils";
import { useLightbox, type LightboxImage } from "@/components/ui/Lightbox";

// Column counts per gallery size. Every tile keeps a fixed aspect ratio and
// crops with object-cover, so mixed-shape uploads still line up on a grid.
const GALLERY_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
};

const COLLEGE_LABELS: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

const PROVIDER_LABELS = {
  youtube: "YouTube",
  vimeo: "Vimeo",
  facebook: "Facebook",
} as const;

/**
 * One news or events entry. The article sits in the middle; the left column
 * holds the facts and the share buttons (it stays in view while reading), the
 * right column lists the latest entries and more from the same college. Below
 * the large breakpoint everything stacks under the article.
 */
export function EventDetailLayout({
  event,
  latest = [],
  moreFromCollege = [],
}: {
  event: PublicEventDetail;
  latest?: PublicEventCard[];
  moreFromCollege?: PublicEventCard[];
}) {
  const gallery = event.gallery ?? [];
  const videos = event.videos ?? [];
  const cols = GALLERY_COLS[gallery.length] ?? "grid-cols-2 sm:grid-cols-3";
  // A lone photo reads as a banner; two or more read better as uniform cards.
  const tileAspect = gallery.length === 1 ? "aspect-video" : "aspect-[4/3]";
  const college = COLLEGE_LABELS[event.institution];

  // The cover photo and the gallery are one viewer list, so prev/next walks
  // every image on the page rather than stopping at the section boundary.
  const viewerImages: LightboxImage[] = [
    ...(event.image
      ? [{ src: event.image, alt: event.title, caption: event.title }]
      : []),
    ...gallery.map((src, i) => ({
      src,
      alt: `${event.title} — photo ${i + 1}`,
    })),
  ];
  const galleryOffset = event.image ? 1 : 0;
  const { open, overlay } = useLightbox(viewerImages);

  return (
    <article className="bg-surface pb-12 md:pb-16">
      <div className="container mx-auto max-w-350 px-4 md:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)_300px] xl:gap-10">
          {/* ── Article ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-w-0 lg:col-start-2 lg:row-start-1"
          >
            <Link
              href="/events"
              className="text-accent mb-5 inline-flex items-center gap-1.5 font-sans text-sm font-bold tracking-wide underline-offset-4 hover:underline lg:hidden"
            >
              <ArrowLeft size={15} />
              All news &amp; events
            </Link>

            {event.image && (
              <div className="relative mb-8 h-64 w-full overflow-hidden rounded-3xl md:h-96">
                <button
                  type="button"
                  onClick={() => open(0)}
                  aria-label="View full image"
                  className="group absolute inset-0 h-full w-full cursor-zoom-in"
                >
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    priority
                    sizes="(min-width: 1024px) 760px, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 font-sans text-[11px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Expand size={13} />
                    View full image
                  </span>
                </button>
              </div>
            )}

            <h1 className="text-foreground mb-4 font-serif text-3xl leading-tight italic md:text-4xl">
              {event.title}
            </h1>

            {event.excerpt && (
              <p className="text-foreground/80 mb-6 text-justify font-sans text-lg leading-relaxed">
                {event.excerpt}
              </p>
            )}

            {event.descriptionHtml && (
              <div
                className="text-foreground/90 [&_a]:text-accent [&_blockquote]:border-accent [&_blockquote]:text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_hr]:border-border [&_td]:border-border [&_th]:border-border [&_th]:bg-muted text-justify font-sans text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:italic [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:italic [&_hr]:my-8 [&_li]:mb-1.5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_table]:mb-4 [&_table]:w-full [&_td]:border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
                // Pre-sanitized server-side in getPublicEventBySlug (sanitizeHtml).
                dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
              />
            )}

            {videos.length > 0 && (
              <section className="border-border mt-10 border-t pt-8">
                <h2 className="text-foreground mb-5 font-serif text-2xl italic">
                  {videos.length === 1 ? "Video" : "Videos"}
                </h2>
                <div
                  className={`grid gap-5 ${videos.length > 1 ? "md:grid-cols-2" : ""}`}
                >
                  {videos.map((v, i) =>
                    v.kind === "embed" ? (
                      <div key={`${v.url}-${i}`}>
                        <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
                          <iframe
                            src={v.src}
                            title={`${event.title} — video ${i + 1}`}
                            className="absolute inset-0 h-full w-full border-0"
                            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                          />
                        </div>
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-accent mt-2 inline-flex items-center gap-1 font-sans text-xs"
                        >
                          Watch on {PROVIDER_LABELS[v.provider]}
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    ) : (
                      <a
                        key={`${v.url}-${i}`}
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-border bg-background hover:border-accent flex items-center justify-between gap-3 rounded-2xl border p-5 font-sans text-sm font-bold"
                      >
                        Watch the video
                        <ExternalLink size={16} className="text-accent" />
                      </a>
                    ),
                  )}
                </div>
              </section>
            )}

            {gallery.length > 0 && (
              <section className="border-border mt-10 border-t pt-8">
                <h2 className="text-foreground mb-5 font-serif text-2xl italic">
                  Gallery
                </h2>
                <div className={`grid gap-4 ${cols}`}>
                  {gallery.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => open(galleryOffset + i)}
                      aria-label={`View photo ${i + 1} of ${gallery.length} full size`}
                      className={`bg-muted group relative ${tileAspect} w-full cursor-zoom-in overflow-hidden rounded-2xl`}
                    >
                      <Image
                        src={src}
                        alt={`${event.title} — photo ${i + 1}`}
                        fill
                        sizes="(min-width: 1024px) 250px, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                        <Expand size={22} className="text-white" />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </motion.div>

          {/* ── Left: facts + share, in view while reading ── */}
          <aside className="lg:col-start-1 lg:row-start-1">
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              <Link
                href="/events"
                className="text-accent hidden items-center gap-1.5 font-sans text-sm font-bold tracking-wide underline-offset-4 hover:underline lg:inline-flex"
              >
                <ArrowLeft size={15} />
                All news &amp; events
              </Link>

              <dl className="border-border bg-background space-y-4 rounded-2xl border p-5 font-sans text-sm">
                {event.date && (
                  <Fact icon={<Calendar size={15} />} label="Date">
                    {formatEventDate(event.date)}
                  </Fact>
                )}
                {event.location && (
                  <Fact icon={<MapPin size={15} />} label="Venue">
                    {event.location}
                  </Fact>
                )}
                {event.category && (
                  <Fact icon={<Tag size={15} />} label="Category">
                    {event.category}
                  </Fact>
                )}
                {college && (
                  <Fact icon={<School size={15} />} label="College">
                    {college}
                  </Fact>
                )}
              </dl>

              <ShareButtons title={event.title} />
            </div>
          </aside>

          {/* ── Right: what to read next ── */}
          <aside className="space-y-8 lg:col-start-3 lg:row-start-1">
            {latest.length > 0 && (
              <RelatedList title="Latest news & events" events={latest} />
            )}
            {moreFromCollege.length > 0 && college && (
              <RelatedList
                title={`More from ${college}`}
                events={moreFromCollege}
              />
            )}
          </aside>
        </div>
      </div>
      {overlay}
    </article>
  );
}

function Fact({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-accent mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <dt className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
          {label}
        </dt>
        <dd className="text-foreground mt-0.5 break-words">{children}</dd>
      </div>
    </div>
  );
}

function ShareButtons({ title }: { title: string }) {
  // The page URL is only known in the browser (ISR renders it once for all).
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setUrl(window.location.href), []);

  const enc = encodeURIComponent;
  const links = url
    ? [
        {
          label: "WhatsApp",
          Icon: FaWhatsapp,
          href: `https://wa.me/?text=${enc(`${title} ${url}`)}`,
        },
        {
          label: "Facebook",
          Icon: FaFacebookF,
          href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
        },
        {
          label: "X",
          Icon: FaXTwitter,
          href: `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`,
        },
        {
          label: "LinkedIn",
          Icon: FaLinkedinIn,
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
        },
      ]
    : [];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — the address bar still has the link.
    }
  };

  return (
    <div>
      <p className="text-muted-foreground mb-2 font-sans text-[11px] font-bold tracking-widest uppercase">
        Share
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map(({ label, Icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${label}`}
            title={`Share on ${label}`}
            className="border-border bg-background text-foreground/80 hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          >
            <Icon size={14} />
          </a>
        ))}
        <button
          type="button"
          onClick={copy}
          disabled={!url}
          aria-label="Copy link"
          title={copied ? "Link copied" : "Copy link"}
          className="border-border bg-background text-foreground/80 hover:border-accent hover:text-accent flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
        >
          {copied ? <Check size={15} /> : <Link2 size={15} />}
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  );
}

function RelatedList({
  title,
  events,
}: {
  title: string;
  events: PublicEventCard[];
}) {
  return (
    <section>
      <h2 className="text-foreground border-border mb-4 border-b pb-2 font-serif text-xl italic">
        {title}
      </h2>
      <ul className="space-y-4">
        {events.map((e) => (
          <li key={e._id}>
            <Link href={`/events/${e.slug}`} className="group flex gap-3">
              <div className="bg-muted relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                {e.image ? (
                  <Image
                    src={e.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="from-primary/90 to-primary/60 absolute inset-0 bg-linear-to-br" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-foreground group-hover:text-accent line-clamp-2 font-sans text-sm leading-snug font-semibold">
                  {e.title}
                </p>
                {e.date && (
                  <p className="text-muted-foreground mt-1 font-sans text-xs">
                    {formatEventDate(e.date)}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
