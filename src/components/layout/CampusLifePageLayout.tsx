"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Users,
  Bus,
  Home,
  Trophy,
  Music,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { resolveIcon } from "@/lib/lucide-icon";
import { getImageUrl } from "@/lib/utils";
import type { CampusLifePageValue } from "@/lib/validation";

// ─── Editable sections ────────────────────────────────────────────────────────

export type CampusLifeEditableSection =
  | "hero"
  | "experience"
  | "highlights"
  | "services"
  | "sports"
  | "clubs"
  | "cta";

export const CAMPUS_LIFE_SECTION_LABELS: Record<
  CampusLifeEditableSection,
  string
> = {
  hero: "Hero",
  experience: "Experience Section",
  highlights: "Campus Highlights Gallery",
  services: "Essential Support Services",
  sports: "Sports & Athletics",
  clubs: "Clubs & Culture",
  cta: "Final Call to Action",
};

export const CAMPUS_LIFE_SECTION_ORDER: CampusLifeEditableSection[] = [
  "hero",
  "experience",
  "highlights",
  "services",
  "sports",
  "clubs",
  "cta",
];

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const slideInRight = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

// Fallback icon map for service/feature icon strings
const FEATURE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string; size?: number }>
> = {
  Users,
  Star,
  Zap,
  ShieldCheck,
  Bus,
  Home,
  Trophy,
  Music,
  CheckCircle2,
};

function resolveFeatureIcon(name: string) {
  if (name && name in FEATURE_ICONS) return FEATURE_ICONS[name];
  return resolveIcon(name, Users);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CampusLifePageLayout({
  data,
  editable = false,
  onEditSection,
}: {
  data: CampusLifePageValue;
  editable?: boolean;
  onEditSection?: (section: CampusLifeEditableSection) => void;
}) {
  const { hero, experience, highlights, services, sports, clubs, cta } = data;

  const heroBg = hero.backgroundImage
    ? (getImageUrl(hero.backgroundImage) ?? hero.backgroundImage)
    : "";

  return (
    <main className="bg-background selection:bg-gold selection:text-navy min-h-screen overflow-x-hidden">
      {!editable && <Navbar />}

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <EditableRegion
        as="section"
        section="hero"
        label={CAMPUS_LIFE_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEditSection}
        className="relative h-[85vh] w-full overflow-hidden"
      >
        {heroBg ? (
          <Image
            src={heroBg}
            alt="JCT Campus Life"
            fill
            sizes="100vw"
            className="object-cover brightness-[0.55]"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[#081a34]" />
        )}
        <div className="from-navy/50 absolute inset-x-0 top-0 h-[25%] bg-gradient-to-b to-transparent" />
        <div className="from-background/40 via-background/20 absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t to-transparent" />

        <div className="relative z-10 container mx-auto flex h-full flex-col items-start justify-end px-4 pb-16 text-left md:pb-24">
          {hero.title && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-4xl leading-tight font-bold text-white md:text-6xl lg:text-7xl"
            >
              {hero.title}
            </motion.h1>
          )}
          {hero.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 max-w-xl font-sans text-base text-white/80 md:text-lg"
            >
              {hero.subtitle}
            </motion.p>
          )}
        </div>
      </EditableRegion>

      <div className="container mx-auto px-4 pt-8 md:px-6">
        <Breadcrumb items={[{ label: "Campus Life" }]} />

        {/* ── Experience ──────────────────────────────────────────────── */}
        {(editable ||
          experience.title ||
          experience.body ||
          experience.features.length > 0) && (
          <EditableRegion
            as="section"
            section="experience"
            label={CAMPUS_LIFE_SECTION_LABELS.experience}
            editable={editable}
            onEditSection={onEditSection}
            className="section-padding grid items-center gap-16 lg:grid-cols-2"
          >
            <motion.div {...slideInLeft}>
              {experience.eyebrow && (
                <div className="bg-gold/10 text-gold inline-block rounded-lg px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  {experience.eyebrow}
                </div>
              )}
              {(experience.title || experience.titleHighlight) && (
                <h2 className="text-navy mt-4 font-serif text-4xl font-bold md:text-5xl">
                  {experience.title}{" "}
                  {experience.titleHighlight && (
                    <span className="text-gold">
                      {experience.titleHighlight}
                    </span>
                  )}
                </h2>
              )}
              {experience.body && (
                <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                  {experience.body}
                </p>
              )}

              {experience.features.length > 0 && (
                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  {experience.features.map((feat, i) => {
                    const Icon = resolveFeatureIcon(feat.icon);
                    return (
                      <div key={i} className="group flex gap-4 transition-all">
                        <div className="bg-surface group-hover:bg-gold/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors">
                          <Icon className="text-gold" size={20} />
                        </div>
                        <div>
                          <h4 className="text-navy font-bold">{feat.title}</h4>
                          {feat.desc && (
                            <p className="text-muted-foreground text-sm">
                              {feat.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            <motion.div {...slideInRight} className="relative">
              {experience.image && (
                <div className="relative aspect-[20/12] overflow-hidden rounded-[2.5rem] shadow-2xl">
                  <Image
                    src={getImageUrl(experience.image) ?? experience.image}
                    alt="JCT Campus"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              )}
              <div className="bg-gold absolute -right-6 -bottom-6 -z-10 h-64 w-64 rounded-3xl opacity-20 blur-3xl" />
            </motion.div>
          </EditableRegion>
        )}

        {/* ── Highlights Gallery ──────────────────────────────────────── */}
        {(editable || highlights.items.length > 0) && (
          <EditableRegion
            as="section"
            section="highlights"
            label={CAMPUS_LIFE_SECTION_LABELS.highlights}
            editable={editable}
            onEditSection={onEditSection}
            className="section-padding"
          >
            <div className="mb-16 text-center">
              <h2 className="text-navy font-serif text-4xl font-bold md:text-5xl">
                Campus Highlights
              </h2>
              <p className="text-muted-foreground mt-4">
                Discover the spaces where innovation and community thrive.
              </p>
            </div>

            <div className="columns-1 gap-6 space-y-6 sm:columns-2 lg:columns-3 xl:columns-4">
              {highlights.items.map((item, idx) => {
                const src = item.image
                  ? (getImageUrl(item.image) ?? item.image)
                  : "";
                return (
                  <motion.div
                    key={idx}
                    {...fadeIn}
                    className="break-inside-avoid"
                  >
                    <div className="group relative overflow-hidden rounded-[2rem] shadow-md transition-all hover:-translate-y-2 hover:shadow-2xl">
                      <div className="relative aspect-square w-full">
                        {src ? (
                          <Image
                            src={src}
                            alt={item.title}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div className="absolute right-0 bottom-0 left-0 translate-y-4 p-8 text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </EditableRegion>
        )}
      </div>

      {/* ── Services ──────────────────────────────────────────────────── */}
      {(editable || services.title || services.items.length > 0) && (
        <EditableRegion
          as="section"
          section="services"
          label={CAMPUS_LIFE_SECTION_LABELS.services}
          editable={editable}
          onEditSection={onEditSection}
          className="section-padding bg-surface/50 mx-4 my-12 rounded-[4rem] md:mx-6"
        >
          <div className="container mx-auto px-4">
            {(services.title || services.subtitle) && (
              <div className="mb-16 text-center">
                {services.eyebrow && (
                  <div className="text-gold mb-4 flex justify-center">
                    <ShieldCheck size={48} className="animate-pulse" />
                  </div>
                )}
                {services.title && (
                  <h2 className="text-navy font-serif text-4xl font-bold md:text-5xl">
                    {services.title}
                  </h2>
                )}
                {services.subtitle && (
                  <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-sm md:text-base">
                    {services.subtitle}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.items.map((service, i) => {
                const ServiceIcon = resolveFeatureIcon(service.icon);
                const svcImg = service.image
                  ? (getImageUrl(service.image) ?? service.image)
                  : "";
                return (
                  <motion.div
                    key={i}
                    {...fadeIn}
                    className="bg-background group border-border/50 flex flex-col overflow-hidden rounded-[2.5rem] border shadow-md transition-all hover:-translate-y-3 hover:shadow-2xl"
                  >
                    <div className="relative h-64 overflow-hidden md:h-72">
                      {svcImg ? (
                        <Image
                          src={svcImg}
                          alt={service.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-slate-100">
                          <ServiceIcon className="text-navy h-12 w-12 opacity-30" />
                        </div>
                      )}
                      <div className="absolute top-6 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/95 shadow-xl backdrop-blur-sm transition-transform duration-500 group-hover:rotate-[360deg] md:h-14 md:w-14">
                        <ServiceIcon className="text-navy" size={24} />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <h3 className="text-navy group-hover:text-gold font-serif text-xl font-bold transition-colors md:text-2xl">
                        {service.title}
                      </h3>
                      {service.desc && (
                        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
                          {service.desc}
                        </p>
                      )}
                      {service.points.length > 0 && (
                        <div className="border-border/50 mt-6 space-y-3 border-t pt-6">
                          {service.points.map((pt, j) => (
                            <div
                              key={j}
                              className="text-navy/80 flex items-center gap-2 text-xs font-medium"
                            >
                              <CheckCircle2 size={14} className="text-gold" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </EditableRegion>
      )}

      <div className="container mx-auto px-4 md:px-6">
        {/* ── Sports ──────────────────────────────────────────────────── */}
        {(editable ||
          sports.title ||
          sports.body ||
          sports.stats.length > 0) && (
          <EditableRegion
            as="section"
            section="sports"
            label={CAMPUS_LIFE_SECTION_LABELS.sports}
            editable={editable}
            onEditSection={onEditSection}
            className="section-padding"
          >
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {sports.images.length > 0 && (
                <motion.div {...slideInLeft} className="order-2 lg:order-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      {sports.images[0] && (
                        <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
                          <Image
                            src={
                              getImageUrl(sports.images[0]) ?? sports.images[0]
                            }
                            alt="Sports"
                            fill
                            sizes="(min-width: 768px) 30vw, 50vw"
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      )}
                      {sports.images[1] && (
                        <div className="group relative aspect-square overflow-hidden rounded-[2rem] shadow-xl">
                          <Image
                            src={
                              getImageUrl(sports.images[1]) ?? sports.images[1]
                            }
                            alt="Sports"
                            fill
                            sizes="(min-width: 768px) 30vw, 50vw"
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      )}
                    </div>
                    <div className="mt-12 space-y-4">
                      {sports.images[2] && (
                        <div className="group relative aspect-square overflow-hidden rounded-[2rem] shadow-xl">
                          <Image
                            src={
                              getImageUrl(sports.images[2]) ?? sports.images[2]
                            }
                            alt="Sports"
                            fill
                            sizes="(min-width: 768px) 30vw, 50vw"
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      )}
                      {sports.images[3] && (
                        <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl">
                          <Image
                            src={
                              getImageUrl(sports.images[3]) ?? sports.images[3]
                            }
                            alt="Sports"
                            fill
                            sizes="(min-width: 768px) 30vw, 50vw"
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                {...slideInRight}
                className={`${sports.images.length > 0 ? "order-1 lg:order-2" : ""}`}
              >
                {sports.eyebrow && (
                  <div className="bg-gold/10 text-gold inline-block rounded-lg px-3 py-1 text-xs font-bold tracking-widest uppercase">
                    {sports.eyebrow}
                  </div>
                )}
                {(sports.title || sports.titleHighlight) && (
                  <h2 className="text-navy mt-4 font-serif text-4xl font-bold md:text-5xl">
                    {sports.title}{" "}
                    {sports.titleHighlight && (
                      <span className="text-gold">{sports.titleHighlight}</span>
                    )}
                  </h2>
                )}
                {sports.body && (
                  <p className="text-muted-foreground mt-8 text-lg leading-relaxed">
                    {sports.body}
                  </p>
                )}

                {sports.stats.length > 0 && (
                  <div className="border-gold/30 mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-l-2 pl-8">
                    {sports.stats.map((stat, i) => (
                      <div key={i}>
                        <div className="text-navy font-serif text-2xl font-bold">
                          {stat.val}
                        </div>
                        <div className="text-muted-foreground text-sm tracking-wide uppercase">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(sports.highlightTitle || sports.highlightDesc) && (
                  <div className="bg-navy relative mt-12 overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl">
                    <div className="relative z-10 flex items-center gap-6">
                      <div className="bg-gold/20 flex h-16 w-16 items-center justify-center rounded-2xl">
                        <Trophy className="text-gold" size={32} />
                      </div>
                      <div>
                        {sports.highlightTitle && (
                          <h4 className="text-xl font-bold">
                            {sports.highlightTitle}
                          </h4>
                        )}
                        {sports.highlightDesc && (
                          <p className="mt-1 text-sm text-white/60">
                            {sports.highlightDesc}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="bg-gold/10 absolute -right-10 -bottom-10 h-40 w-40 rounded-full blur-3xl" />
                  </div>
                )}
              </motion.div>
            </div>
          </EditableRegion>
        )}
      </div>

      {/* ── Clubs & Culture ───────────────────────────────────────────── */}
      {(editable ||
        clubs.title ||
        clubs.featuredTitle ||
        clubs.events.length > 0) && (
        <EditableRegion
          as="section"
          section="clubs"
          label={CAMPUS_LIFE_SECTION_LABELS.clubs}
          editable={editable}
          onEditSection={onEditSection}
          className="section-padding bg-navy mx-4 my-12 overflow-hidden rounded-[4rem] text-white md:mx-6"
        >
          <div className="container mx-auto px-4">
            <div className="mb-16">
              {clubs.eyebrow && (
                <div className="text-gold inline-block rounded-lg bg-white/10 px-3 py-1 text-xs font-bold tracking-widest uppercase">
                  {clubs.eyebrow}
                </div>
              )}
              {clubs.title && (
                <h2 className="mt-4 font-serif text-4xl font-bold md:text-6xl">
                  {clubs.title}
                </h2>
              )}
            </div>

            <div className="space-y-16">
              {(clubs.featuredImage || clubs.featuredTitle) && (
                <motion.div
                  {...fadeIn}
                  className="group relative overflow-hidden rounded-[3rem] shadow-2xl"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[32/9]">
                    {clubs.featuredImage ? (
                      <Image
                        src={
                          getImageUrl(clubs.featuredImage) ??
                          clubs.featuredImage
                        }
                        alt={clubs.featuredTitle || "Featured club"}
                        fill
                        sizes="100vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800" />
                    )}
                    <div className="from-navy/90 via-navy/20 absolute inset-0 bg-gradient-to-t to-transparent" />
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 p-6 md:p-16">
                    <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
                      <div>
                        {clubs.featuredTitle && (
                          <h3 className="text-2xl font-bold md:text-5xl">
                            {clubs.featuredTitle}
                          </h3>
                        )}
                        {clubs.featuredDesc && (
                          <p className="mt-4 max-w-xl text-sm text-white/70 md:text-lg">
                            {clubs.featuredDesc}
                          </p>
                        )}
                      </div>
                      {clubs.tags.length > 0 && (
                        <div className="flex flex-wrap gap-3 lg:justify-end">
                          {clubs.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-white/10 px-4 py-1 text-xs font-bold backdrop-blur-md md:px-6 md:py-2 md:text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {clubs.events.length > 0 && (
                <div className="grid gap-8 lg:grid-cols-2">
                  {clubs.events.map((event, i) => {
                    const EventIcon = resolveFeatureIcon(event.icon);
                    return (
                      <motion.div
                        key={i}
                        {...(i % 2 === 0 ? slideInLeft : slideInRight)}
                        className="group flex flex-col gap-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 md:p-10"
                      >
                        <div className="bg-gold/20 text-gold flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:rotate-12 md:h-16 md:w-16">
                          <EventIcon size={28} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold md:text-3xl">
                            {event.title}
                          </h4>
                          {event.description && (
                            <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-lg">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </EditableRegion>
      )}

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      {(editable || cta.title || cta.ctaLabel) && (
        <EditableRegion
          as="section"
          section="cta"
          label={CAMPUS_LIFE_SECTION_LABELS.cta}
          editable={editable}
          onEditSection={onEditSection}
          className="section-padding container mx-auto mb-12 px-4 md:px-6"
        >
          <motion.div
            {...fadeIn}
            className="bg-gold relative flex flex-col items-center overflow-hidden rounded-[3rem] p-10 text-center md:p-24"
          >
            <div className="bg-navy absolute top-0 left-0 h-full w-full opacity-[0.03]" />
            <div className="border-navy/10 absolute -top-24 -right-24 h-96 w-96 rounded-full border-2" />

            {cta.title && (
              <h2 className="text-navy relative z-10 font-serif text-3xl font-bold md:text-6xl">
                {cta.title}
              </h2>
            )}
            {cta.description && (
              <p className="text-navy/70 relative z-10 mt-6 max-w-2xl text-base font-medium md:text-lg">
                {cta.description}
              </p>
            )}

            {cta.ctaLabel && cta.ctaHref && (
              <div className="relative z-10 mt-10 flex justify-center md:mt-12">
                <a
                  href={cta.ctaHref}
                  target={cta.ctaHref.startsWith("http") ? "_blank" : undefined}
                  rel={
                    cta.ctaHref.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="bg-navy hover:bg-navy-mid flex items-center gap-2 rounded-full px-10 py-4 text-base font-bold text-white shadow-2xl transition-all hover:scale-105 active:scale-95 md:px-12 md:py-5 md:text-lg"
                >
                  {cta.ctaLabel} <ArrowRight size={20} />
                </a>
              </div>
            )}
          </motion.div>
        </EditableRegion>
      )}

      {!editable && <Footer />}
    </main>
  );
}
