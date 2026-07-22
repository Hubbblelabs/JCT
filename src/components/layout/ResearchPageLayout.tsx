"use client";

import Image from "next/image";
import {
  FlaskConical,
  Lightbulb,
  Building2,
  BookMarked,
  ExternalLink,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import type { ResearchPageValue } from "@/lib/validation";

export type ResearchEditableSection =
  | "hero"
  | "intro"
  | "stats"
  | "areas"
  | "centres"
  | "publications";

export const RESEARCH_SECTION_LABELS: Record<ResearchEditableSection, string> = {
  hero: "Hero",
  intro: "Introduction",
  stats: "Research at a Glance",
  areas: "Focus Areas",
  centres: "Research Centres",
  publications: "Publications",
};

export const RESEARCH_SECTION_ORDER: ResearchEditableSection[] = [
  "hero",
  "intro",
  "stats",
  "areas",
  "centres",
  "publications",
];

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <h2 className="text-foreground mb-6 flex items-center gap-3 font-serif text-2xl font-bold md:text-3xl">
      <span className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
        <Icon size={20} />
      </span>
      {title}
    </h2>
  );
}

function EmptyHint({ children }: { children: string }) {
  return (
    <div className="text-muted-foreground rounded-xl border-2 border-dashed border-white/10 py-8 text-center text-sm">
      {children}
    </div>
  );
}

export function ResearchPageLayout({
  data,
  editable = false,
  onEditSection,
}: {
  data: ResearchPageValue;
  editable?: boolean;
  onEditSection?: (section: ResearchEditableSection) => void;
}) {
  const intro = data.intro.filter((p) => p.trim() !== "");
  const show = (n: number) => editable || n > 0;

  return (
    <main className="bg-surface text-foreground min-h-screen">
      {!editable && <Navbar forceSolidOnTop />}

      <EditableRegion
        as="div"
        section="hero"
        label={RESEARCH_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEditSection}
      >
        <PageHero
          title={data.hero.title || "Research & Innovation"}
          subtitle={data.hero.subtitle}
        />
      </EditableRegion>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Research" },
          ]}
        />

        <div className="mt-8 space-y-16">
          {/* Introduction */}
          {show(intro.length) && (
            <EditableRegion
              as="section"
              section="intro"
              label={RESEARCH_SECTION_LABELS.intro}
              editable={editable}
              onEditSection={onEditSection}
              className="max-w-3xl"
            >
              {intro.length > 0 ? (
                <div className="space-y-4">
                  {intro.map((p, i) => (
                    <p
                      key={i}
                      className="text-muted-foreground text-base leading-relaxed md:text-lg"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              ) : (
                <EmptyHint>Click to add an introduction</EmptyHint>
              )}
            </EditableRegion>
          )}

          {/* Research at a glance */}
          {show(data.stats.length) && (
            <EditableRegion
              as="section"
              section="stats"
              label={RESEARCH_SECTION_LABELS.stats}
              editable={editable}
              onEditSection={onEditSection}
            >
              {data.stats.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {data.stats.map((stat, i) => (
                    <div
                      key={i}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                    >
                      <p className="text-gold font-serif text-3xl font-bold md:text-4xl">
                        {stat.value}
                      </p>
                      <p className="text-muted-foreground mt-1.5 text-xs font-medium tracking-wide uppercase">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyHint>Click to add research statistics</EmptyHint>
              )}
            </EditableRegion>
          )}

          {/* Focus areas */}
          {show(data.areas.length) && (
            <EditableRegion
              as="section"
              section="areas"
              label={RESEARCH_SECTION_LABELS.areas}
              editable={editable}
              onEditSection={onEditSection}
              className="scroll-mt-28"
            >
              <SectionHeading icon={Lightbulb} title="Research Focus Areas" />
              {data.areas.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.areas.map((area, i) => (
                    <div
                      key={i}
                      className="hover:border-gold/30 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
                    >
                      <div className="bg-gold/15 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                        <FlaskConical size={18} />
                      </div>
                      <h3 className="text-foreground text-sm leading-tight font-bold">
                        {area.title}
                      </h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {area.desc}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyHint>Click to add research focus areas</EmptyHint>
              )}
            </EditableRegion>
          )}

          {/* Research centres */}
          {show(data.centres.length) && (
            <EditableRegion
              as="section"
              section="centres"
              label={RESEARCH_SECTION_LABELS.centres}
              editable={editable}
              onEditSection={onEditSection}
              className="scroll-mt-28"
            >
              <SectionHeading icon={Building2} title="Research Centres" />
              {data.centres.length > 0 ? (
                <div className="space-y-6">
                  {data.centres.map((centre, i) => {
                    const img = getImageUrl(centre.image) || "";
                    return (
                      <div
                        key={i}
                        className="overflow-hidden rounded-3xl border border-white/10 bg-white/5"
                      >
                        <div className="flex flex-col gap-6 p-5 sm:flex-row md:p-8">
                          <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-40 sm:w-56">
                            {img && (
                              <Image
                                src={img}
                                alt={centre.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 100vw, 224px"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-foreground font-serif text-lg font-bold md:text-xl">
                              {centre.name}
                            </h3>
                            {centre.head && (
                              <p className="text-gold mt-1 flex items-center gap-1.5 text-xs font-semibold">
                                <UserRound size={13} />
                                {centre.head}
                              </p>
                            )}
                            {centre.description && (
                              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                                {centre.description}
                              </p>
                            )}
                            {centre.focus.length > 0 && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                {centre.focus.map((f, j) => (
                                  <span
                                    key={j}
                                    className="border-gold/30 text-gold rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
                                  >
                                    {f}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyHint>Click to add research centres</EmptyHint>
              )}
            </EditableRegion>
          )}

          {/* Publications */}
          {show(data.publications.length) && (
            <EditableRegion
              as="section"
              section="publications"
              label={RESEARCH_SECTION_LABELS.publications}
              editable={editable}
              onEditSection={onEditSection}
              className="scroll-mt-28"
            >
              <SectionHeading icon={BookMarked} title="Recent Publications" />
              {data.publications.length > 0 ? (
                <div className="space-y-3">
                  {data.publications.map((pub, i) => (
                    <div
                      key={i}
                      className="hover:border-gold/30 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:bg-white/10 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
                    >
                      <div className="min-w-0">
                        <h4 className="text-foreground text-sm font-bold md:text-base">
                          {pub.title}
                        </h4>
                        {pub.authors && (
                          <p className="text-muted-foreground mt-1 text-xs">
                            {pub.authors}
                          </p>
                        )}
                        {(pub.journal || pub.year) && (
                          <p className="text-muted-foreground mt-1 text-xs italic">
                            {[pub.journal, pub.year]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                      </div>
                      {pub.link && (
                        <a
                          href={pub.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={
                            editable ? (e) => e.preventDefault() : undefined
                          }
                          className="text-gold flex shrink-0 items-center gap-1.5 text-xs font-bold hover:underline"
                        >
                          <ExternalLink size={14} />
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyHint>Click to add publications</EmptyHint>
              )}
            </EditableRegion>
          )}
        </div>
      </div>

      {!editable && <Footer />}
    </main>
  );
}
