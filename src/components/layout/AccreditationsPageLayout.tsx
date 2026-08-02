"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  CalendarRange,
  Download,
  FileText,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import type { AccreditationsPageValue } from "@/lib/validation";

type Institution = "main" | "engineering" | "arts-science" | "polytechnic";

export type AccreditationsEditableSection = "hero" | "intro" | "items";

export const ACCREDITATIONS_SECTION_LABELS: Record<
  AccreditationsEditableSection,
  string
> = {
  hero: "Hero",
  intro: "Introduction",
  items: "Accreditations",
};

export const ACCREDITATIONS_SECTION_ORDER: AccreditationsEditableSection[] = [
  "hero",
  "intro",
  "items",
];

const THEME: Record<
  Institution,
  { themeClass: string; badge: string; chip: string; accentText: string }
> = {
  main: {
    themeClass: "",
    badge: "bg-gold/15 text-gold",
    chip: "border-gold/30 text-gold",
    accentText: "text-gold",
  },
  engineering: {
    themeClass: "",
    badge: "bg-gold/15 text-gold",
    chip: "border-gold/30 text-gold",
    accentText: "text-gold",
  },
  "arts-science": {
    themeClass: "arts-science-theme",
    badge: "bg-arts-science-accent/15 text-arts-science-accent",
    chip: "border-arts-science-accent/30 text-arts-science-accent",
    accentText: "text-arts-science-accent",
  },
  polytechnic: {
    themeClass: "polytechnic-theme",
    badge: "bg-polytechnic/15 text-polytechnic",
    chip: "border-polytechnic/30 text-polytechnic",
    accentText: "text-polytechnic",
  },
};

const INSTITUTION_META: Record<
  Institution,
  { label: string; breadcrumbHref: string }
> = {
  main: { label: "JCT Institutions", breadcrumbHref: "/" },
  engineering: {
    label: "Engineering",
    breadcrumbHref: "/institutions/engineering",
  },
  "arts-science": {
    label: "Arts & Science",
    breadcrumbHref: "/institutions/arts-science",
  },
  polytechnic: {
    label: "Polytechnic",
    breadcrumbHref: "/institutions/polytechnic",
  },
};

/**
 * A card links to a dedicated page only when the CMS entry sets `detailHref`.
 * NAAC used to be mapped implicitly here; it now lives under "More" in the
 * navbar at /institutions/engineering/naac, so this page no longer links to it.
 */
function detailPageFor(item: AccreditationsPageValue["items"][number]): string {
  return item.detailHref?.trim() ?? "";
}

function validityLabel(from: string, to: string): string {
  const f = from.trim();
  const t = to.trim();
  if (f && t) return `${f} – ${t}`;
  if (f) return `From ${f}`;
  if (t) return `Until ${t}`;
  return "";
}

function AccreditationCard({
  item,
  theme,
  editable,
}: {
  item: AccreditationsPageValue["items"][number];
  theme: (typeof THEME)[Institution];
  editable: boolean;
}) {
  const logo = getImageUrl(item.logo) || "";
  const certificate = getImageUrl(item.certificate) || "";
  const validity = validityLabel(item.validFrom, item.validTo);
  const detailHref = detailPageFor(item);

  return (
    <div className="bg-card flex h-full flex-col rounded-2xl border border-white/10 p-6 shadow-sm transition-all hover:border-white/20 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
          {logo ? (
            <div className="relative h-[70%] w-[70%]">
              <Image
                src={logo}
                alt={item.name || "Accreditation"}
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          ) : (
            <Award size={26} className={theme.accentText} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground font-serif text-lg font-bold">
            {detailHref ? (
              <Link
                href={detailHref}
                onClick={editable ? (e) => e.preventDefault() : undefined}
                className="transition-opacity hover:underline hover:opacity-80"
              >
                {item.name || "Untitled"}
              </Link>
            ) : (
              item.name || "Untitled"
            )}
          </h3>
          {item.fullName && (
            <p className="text-muted-foreground mt-0.5 text-sm">
              {item.fullName}
            </p>
          )}
          {item.grade && (
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${theme.badge}`}
            >
              <BadgeCheck size={13} />
              {item.grade}
            </span>
          )}
        </div>
      </div>

      {item.description && (
        <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
          {item.description}
        </p>
      )}

      <div className="mt-auto space-y-2 pt-4">
        {item.accreditedBy && (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <BadgeCheck size={14} className={`shrink-0 ${theme.accentText}`} />
            <span>
              Accredited by{" "}
              <span className="text-foreground font-medium">
                {item.accreditedBy}
              </span>
            </span>
          </p>
        )}
        {validity && (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <CalendarRange
              size={14}
              className={`shrink-0 ${theme.accentText}`}
            />
            <span>Valid: {validity}</span>
          </p>
        )}
      </div>

      {(certificate || detailHref) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {detailHref && (
            <Link
              href={detailHref}
              onClick={editable ? (e) => e.preventDefault() : undefined}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/5 ${theme.chip}`}
            >
              {`View ${item.name.trim() || "Details"}`}
              <ArrowRight size={15} />
            </Link>
          )}
          {certificate && (
            <a
              href={certificate}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/5 ${theme.chip}`}
            >
              <Download size={15} />
              {item.certificateLabel?.trim() || "View Certificate"}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function AccreditationsPageLayout({
  data,
  institution,
  editable = false,
  onEditSection,
}: {
  data: AccreditationsPageValue;
  institution: Institution;
  editable?: boolean;
  onEditSection?: (section: AccreditationsEditableSection) => void;
}) {
  const theme = THEME[institution];
  const meta = INSTITUTION_META[institution];
  const intro = data.intro.filter((p) => p.trim() !== "");
  const items = editable
    ? data.items
    : data.items.filter((it) => it.name.trim() !== "" || it.logo.trim() !== "");

  return (
    <main
      className={`bg-surface text-foreground min-h-screen ${theme.themeClass}`}
    >
      {!editable && <Navbar forceSolidOnTop />}

      <EditableRegion
        as="div"
        section="hero"
        label={ACCREDITATIONS_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEditSection}
      >
        <PageHero title={data.hero.title} subtitle={data.hero.subtitle} />
      </EditableRegion>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            ...(institution === "main"
              ? []
              : [{ label: meta.label, href: meta.breadcrumbHref }]),
            { label: "Accreditations" },
          ]}
        />

        {(intro.length > 0 || editable) && (
          <EditableRegion
            as="section"
            section="intro"
            label={ACCREDITATIONS_SECTION_LABELS.intro}
            editable={editable}
            onEditSection={onEditSection}
            className="mt-8 max-w-3xl"
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
              <p className="text-muted-foreground/60 text-sm italic">
                Add an introduction for this accreditations page…
              </p>
            )}
          </EditableRegion>
        )}

        <EditableRegion
          as="section"
          section="items"
          label={ACCREDITATIONS_SECTION_LABELS.items}
          editable={editable}
          onEditSection={onEditSection}
          className="mt-10"
        >
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <AccreditationCard
                  key={i}
                  item={item}
                  theme={theme}
                  editable={editable}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-16 text-center">
              <FileText size={32} className="text-muted-foreground/40" />
              <p className="text-muted-foreground/60 mt-3 text-sm">
                {editable
                  ? "No accreditations yet. Click here to add the first one."
                  : "Accreditation details will be published soon."}
              </p>
            </div>
          )}
        </EditableRegion>
      </div>

      {!editable && <Footer />}
    </main>
  );
}
