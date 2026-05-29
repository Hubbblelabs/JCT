import Image from "next/image";
import Link from "next/link";
import type { PageBodySection } from "@/lib/validation";
import { getImageUrl } from "@/lib/utils";

function resolveImage(src: string | undefined): string {
  if (!src) return "";
  return getImageUrl(src) ?? src;
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function Block({ section }: { section: PageBodySection }) {
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
              className="whitespace-pre-line text-base leading-relaxed text-gray-700"
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
            const inner = (
              <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
                {c.image && (
                  <div className="relative aspect-video w-full bg-gray-100">
                    <Image
                      src={resolveImage(c.image)}
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

export function PageBlocksRenderer({
  blocks,
  className,
}: {
  blocks: PageBodySection[];
  className?: string;
}) {
  if (!blocks.length) return null;
  return (
    <div className={`space-y-4 ${className ?? ""}`}>
      {blocks.map((b, i) => (
        <Block key={i} section={b} />
      ))}
    </div>
  );
}
