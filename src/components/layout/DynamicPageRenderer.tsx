import Image from "next/image";
import Link from "next/link";
import type {
  PageContent,
  PageBodySection,
  PageTemplate,
} from "@/lib/validation";
import { getImageUrl } from "@/lib/utils";

function resolveImage(src: string | undefined): string {
  if (!src) return "";
  return getImageUrl(src) ?? src;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function BodySection({ section }: { section: PageBodySection }) {
  switch (section.type) {
    case "heading": {
      const level = section.level ?? 2;
      const Tag = (
        level === 4 ? "h4" : level === 3 ? "h3" : "h2"
      ) as "h2" | "h3" | "h4";
      const cls =
        level === 4
          ? "text-lg font-semibold mt-4"
          : level === 3
            ? "text-xl font-bold mt-5"
            : "text-2xl font-bold mt-6";
      return <Tag className={cls}>{section.text}</Tag>;
    }
    case "text":
      return (
        <div className="space-y-3">
          {section.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-base leading-relaxed whitespace-pre-line text-gray-700"
            >
              {p}
            </p>
          ))}
        </div>
      );
    case "image":
      return section.src ? (
        <figure className="my-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={resolveImage(section.src)}
              alt={section.alt ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
            />
          </div>
          {section.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500">
              {section.caption}
            </figcaption>
          )}
        </figure>
      ) : null;
    case "list": {
      const ListTag = section.ordered ? "ol" : "ul";
      const cls = section.ordered
        ? "list-decimal pl-6 space-y-1"
        : "list-disc pl-6 space-y-1";
      return (
        <ListTag className={cls}>
          {section.items.map((it, i) => (
            <li key={i} className="text-gray-700">
              {it}
            </li>
          ))}
        </ListTag>
      );
    }
    case "cards": {
      const cols = section.columns ?? 3;
      const grid =
        cols === 2
          ? "md:grid-cols-2"
          : cols === 4
            ? "md:grid-cols-2 lg:grid-cols-4"
            : "md:grid-cols-3";
      return (
        <div className={`my-6 grid grid-cols-1 gap-4 ${grid}`}>
          {section.items.map((c, i) => {
            const resolvedImage = c.image ? resolveImage(c.image) : "";
            const inner = (
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                {resolvedImage && (
                  <div className="relative aspect-video w-full bg-gray-100">
                    <Image
                      src={resolvedImage}
                      alt={c.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-4">
                  {c.title && (
                    <h3 className="font-semibold text-gray-900">{c.title}</h3>
                  )}
                  {c.desc && (
                    <p className="mt-1 text-sm text-gray-600">{c.desc}</p>
                  )}
                </div>
              </div>
            );
            if (c.href) {
              const external = isExternal(c.href);
              return (
                <Link
                  key={i}
                  href={c.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="block"
                >
                  {inner}
                </Link>
              );
            }
            return <div key={i}>{inner}</div>;
          })}
        </div>
      );
    }
    case "cta": {
      const variant = section.variant ?? "primary";
      const cls =
        variant === "primary"
          ? "bg-gold text-navy hover:bg-[#e8b84a]"
          : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50";
      const external = section.href ? isExternal(section.href) : false;
      return (
        <div className="my-6">
          <Link
            href={section.href || "#"}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className={`inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all ${cls}`}
          >
            {section.label}
          </Link>
        </div>
      );
    }
  }
}

function HeroBlock({ content }: { content: PageContent }) {
  const hero = content.hero;
  if (!hero?.title && !hero?.subtitle && !hero?.image) return null;
  return (
    <header className="bg-navy text-white">
      <div className="container mx-auto grid items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-20">
        <div>
          {hero?.title && (
            <h1 className="text-3xl font-bold md:text-5xl">{hero.title}</h1>
          )}
          {hero?.subtitle && (
            <p className="mt-3 text-base text-white/80 md:text-lg">
              {hero.subtitle}
            </p>
          )}
          {hero?.ctaLabel && hero?.ctaHref && (
            <Link
              href={hero.ctaHref}
              target={isExternal(hero.ctaHref) ? "_blank" : undefined}
              rel={
                isExternal(hero.ctaHref) ? "noopener noreferrer" : undefined
              }
              className="bg-gold text-navy mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold hover:bg-[#e8b84a]"
            >
              {hero.ctaLabel}
            </Link>
          )}
        </div>
        {hero?.image && resolveImage(hero.image) && (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/10">
            <Image
              src={resolveImage(hero.image)}
              alt={hero.title ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </header>
  );
}

function StandardLayout({ content }: { content: PageContent }) {
  const sections = content.sections ?? [];
  return (
    <article className="container mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      <div className="space-y-4">
        {sections.map((s, i) => (
          <BodySection key={i} section={s} />
        ))}
      </div>
    </article>
  );
}

function HeroContentLayout({ content }: { content: PageContent }) {
  return (
    <>
      <HeroBlock content={content} />
      <StandardLayout content={content} />
    </>
  );
}

function SidebarLayout({ content }: { content: PageContent }) {
  const items = (content.sidebar?.items ?? []).filter(
    (i) => i.visible !== false && i.label,
  );
  return (
    <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[280px_1fr] md:px-6 md:py-14">
      <aside className="bg-surface border-border rounded-3xl border p-6">
        <h3 className="mb-5 border-b border-white/10 pb-4 text-sm font-bold tracking-wider uppercase">
          On This Page
        </h3>
        <nav className="space-y-1">
          {items.map((it, i) => {
            const external = it.href ? isExternal(it.href) : false;
            return (
              <Link
                key={i}
                href={it.href || "#"}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
        {content.sidebar?.ctaLabel && content.sidebar?.ctaHref && (
          <Link
            href={content.sidebar.ctaHref}
            target={isExternal(content.sidebar.ctaHref) ? "_blank" : undefined}
            rel={
              isExternal(content.sidebar.ctaHref)
                ? "noopener noreferrer"
                : undefined
            }
            className="bg-gold text-navy mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold hover:bg-[#e8b84a]"
          >
            {content.sidebar.ctaLabel}
          </Link>
        )}
      </aside>
      <article className="min-w-0">
        <div className="space-y-4">
          {(content.sections ?? []).map((s, i) => (
            <BodySection key={i} section={s} />
          ))}
        </div>
      </article>
    </div>
  );
}

function GalleryLayout({ content }: { content: PageContent }) {
  const images = content.gallery?.images ?? [];
  return (
    <article className="container mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      {content.gallery?.description && (
        <p className="mb-6 text-base text-gray-600">
          {content.gallery.description}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images
          .map((img) => ({
            ...img,
            resolvedSrc: resolveImage(img.src),
          }))
          .filter((img) => img.resolvedSrc)
          .map((img, i) => (
            <figure
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            >
              <div className="relative aspect-square w-full bg-gray-100">
                <Image
                  src={img.resolvedSrc}
                  alt={img.alt ?? ""}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
              {img.caption && (
                <figcaption className="border-t border-gray-100 p-2 text-center text-xs text-gray-500">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
      </div>
    </article>
  );
}

function ContactLayout({ content }: { content: PageContent }) {
  const c = content.contact;
  return (
    <article className="container mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
      {c?.intro && (
        <p className="mb-6 text-base leading-relaxed text-gray-700">
          {c.intro}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(c?.phone || c?.email || (c?.addressLines && c.addressLines.length > 0)) && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-bold tracking-wide uppercase">
              Contact
            </h3>
            <dl className="space-y-2 text-sm text-gray-700">
              {c?.phone && (
                <div>
                  <dt className="font-medium text-gray-500">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${c.phone.replace(/\s/g, "")}`}
                      className="hover:underline"
                    >
                      {c.phone}
                    </a>
                  </dd>
                </div>
              )}
              {c?.email && (
                <div>
                  <dt className="font-medium text-gray-500">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${c.email}`}
                      className="hover:underline"
                    >
                      {c.email}
                    </a>
                  </dd>
                </div>
              )}
              {c?.addressLines && c.addressLines.length > 0 && (
                <div>
                  <dt className="font-medium text-gray-500">Address</dt>
                  <dd>
                    {c.addressLines.map((line, i) => (
                      <div key={i}>{line}</div>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
        {c?.mapEmbedUrl && (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <iframe
              src={c.mapEmbedUrl}
              loading="lazy"
              className="h-72 w-full border-none"
              title="Location map"
            />
          </div>
        )}
      </div>
    </article>
  );
}

export function DynamicPageRenderer({
  template,
  content,
}: {
  template: PageTemplate;
  content: PageContent;
}) {
  switch (template) {
    case "hero-content":
      return <HeroContentLayout content={content} />;
    case "sidebar":
      return <SidebarLayout content={content} />;
    case "gallery":
      return <GalleryLayout content={content} />;
    case "contact":
      return <ContactLayout content={content} />;
    default:
      return <StandardLayout content={content} />;
  }
}
