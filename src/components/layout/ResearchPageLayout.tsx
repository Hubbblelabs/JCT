"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  Building2,
  BookMarked,
  ExternalLink,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { lookupSidebarIcon } from "@/lib/sidebar-nav";
import type {
  ResearchPageValue,
  ResearchTabValue,
  ResearchTabSectionValue,
} from "@/lib/validation";

export type ResearchEditableSection =
  "hero" | "tabs" | "intro" | "stats" | "areas" | "centres" | "publications";

export const RESEARCH_SECTION_LABELS: Record<ResearchEditableSection, string> =
  {
    hero: "Hero",
    tabs: "Sidebar tabs",
    intro: "Introduction",
    stats: "Research at a Glance",
    areas: "Focus Areas",
    centres: "Research Centres",
    publications: "Publications",
  };

export const RESEARCH_SECTION_ORDER: ResearchEditableSection[] = [
  "hero",
  "tabs",
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

// ─── Sidebar tabs ────────────────────────────────────────────────────────────
// Same structure as the program page's sidebar tabs, restyled to this page's
// palette rather than the program page's slate-on-white, so Research still
// reads as part of the Engineering section.

function TabSectionRenderer({ section }: { section: ResearchTabSectionValue }) {
  if (section.kind === "richText") {
    // Authenticated-but-untrusted CMS HTML — sanitize before injecting.
    return (
      <div
        className="text-muted-foreground text-justify [&_a]:text-gold [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_td]:border-border [&_th]:border-border [&_th]:text-foreground text-base leading-relaxed [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-bold [&_li]:mb-1.5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.html) }}
      />
    );
  }

  if (section.kind === "stats") {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center"
          >
            <div className="text-gold font-serif text-2xl font-bold md:text-3xl">
              {item.value}
            </div>
            <div className="text-foreground mt-1 text-sm font-medium">
              {item.label}
            </div>
            {item.sub && (
              <div className="text-muted-foreground mt-1 text-xs">
                {item.sub}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section.kind === "list") {
    return (
      <div>
        {section.title && (
          <h3 className="text-foreground mb-3 font-serif text-xl font-bold">
            {section.title}
          </h3>
        )}
        <ul className="space-y-3">
          {section.items.map((item, i) => (
            <li
              key={i}
              className="text-muted-foreground flex items-start gap-3 text-sm leading-relaxed md:text-base"
            >
              <CheckCircle2 size={15} className="text-gold mt-1 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section.kind === "cards") {
    return (
      <div>
        {section.title && (
          <h3 className="text-foreground mb-4 font-serif text-xl font-bold">
            {section.title}
          </h3>
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {section.items.map((item, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              {item.image && (
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={getImageUrl(item.image) ?? item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <h4 className="text-foreground mb-1 font-semibold">
                  {item.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.kind === "image") {
    if (!section.src) return null;
    return (
      <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={getImageUrl(section.src) ?? section.src}
            alt={section.caption ?? ""}
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
        </div>
        {section.caption && (
          <figcaption className="text-muted-foreground px-4 py-2 text-sm">
            {section.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (section.kind === "people") {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {section.items.map((item, i) => (
          <div
            key={i}
            className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white/10">
              {item.image ? (
                <Image
                  src={getImageUrl(item.image) ?? item.image}
                  alt={item.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              ) : (
                <span className="text-gold flex h-full w-full items-center justify-center">
                  <UserRound size={22} />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-foreground font-semibold">{item.name}</h4>
              <p className="text-gold text-sm">{item.title}</p>
              {item.qualifications && (
                <p className="text-muted-foreground mt-1 text-xs">
                  {item.qualifications}
                </p>
              )}
              {item.email && (
                <a
                  href={`mailto:${item.email}`}
                  className="text-muted-foreground mt-1 inline-flex items-center gap-1 text-xs hover:underline"
                >
                  <Mail size={12} /> {item.email}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function ResearchTabsView({ tabs }: { tabs: ResearchTabValue[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  // Falling back to the first tab keeps the pane populated if a stored active
  // id no longer matches any tab (e.g. the admin renamed or removed one).
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
      <aside className="shrink-0 lg:w-72">
        <div className="sticky top-24 z-30 lg:rounded-2xl lg:border lg:border-white/10 lg:bg-white/5 lg:p-3">
          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-1">
            {tabs.map((tab) => {
              const Icon = lookupSidebarIcon(tab.icon) ?? FlaskConical;
              const isActive = tab.id === active?.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors lg:justify-start lg:px-4 lg:py-3 ${
                    isActive
                      ? "bg-gold/15 text-gold border-gold/25 border"
                      : "text-muted-foreground border border-transparent hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="text-left">{tab.label || tab.id}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {active && (
          <>
            <h2 className="text-foreground mb-6 font-serif text-2xl font-bold md:text-3xl">
              {active.label}
            </h2>
            {active.sections.length > 0 ? (
              <div className="space-y-8">
                {active.sections.map((section, i) => (
                  <TabSectionRenderer key={i} section={section} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground/60 rounded-2xl border border-dashed border-white/15 py-12 text-center text-sm">
                Details for this section will be published soon.
              </p>
            )}
          </>
        )}
      </div>
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
  const tabs = data.tabs.filter((t) => t.id.trim() !== "");
  // Tabs take over the page when present. The flat sections below stay in the
  // component so a page authored before tabs existed keeps rendering, and so an
  // admin can still reach them from the editor's section list.
  const hasTabs = tabs.length > 0;
  const show = (n: number) => (editable || n > 0) && !hasTabs;

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
          {/* Sidebar tabs — the primary layout once any tab exists */}
          {(hasTabs || editable) && (
            <EditableRegion
              as="section"
              section="tabs"
              label={RESEARCH_SECTION_LABELS.tabs}
              editable={editable}
              onEditSection={onEditSection}
            >
              {hasTabs ? (
                <ResearchTabsView tabs={tabs} />
              ) : (
                <EmptyHint>
                  Click to add sidebar tabs (Overview, Purpose, Committee…)
                </EmptyHint>
              )}
            </EditableRegion>
          )}

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
                      className="text-muted-foreground text-justify text-base leading-relaxed md:text-lg"
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
