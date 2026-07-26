"use client";

import { CalendarDays, Download, FileText, FolderOpen } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/ui/PageHero";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EditableRegion } from "@/components/admin/EditableRegion";
import { getImageUrl } from "@/lib/utils";
import type { DocumentsPageValue } from "@/lib/validation";

export type DocumentsEditableSection = "hero" | "intro" | "categories";

export const DOCUMENTS_SECTION_LABELS: Record<
  DocumentsEditableSection,
  string
> = {
  hero: "Hero",
  intro: "Introduction",
  categories: "Document Categories",
};

export const DOCUMENTS_SECTION_ORDER: DocumentsEditableSection[] = [
  "hero",
  "intro",
  "categories",
];

// Uploaded documents are stored as R2 keys ("documents/…"), which are not valid
// hrefs on their own — resolve them the same way images are.
const docUrl = (v: string) => getImageUrl(v) || "";

/**
 * A document with a file but no typed-in title is still a real download, so it
 * must render. Derive a readable label from the storage key / URL:
 * "documents/1785040633931-Mandatory-Disclosure-2026.pdf" → "Mandatory Disclosure 2026".
 */
function docLabel(doc: { title: string; file: string }): string {
  if (doc.title.trim()) return doc.title;
  const file = doc.file.trim();
  if (!file) return "Untitled Document";
  const base = (file.split("?")[0].split("/").pop() ?? "")
    .replace(/^\d{10,}-/, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return base || "Download";
}

export function DocumentsPageLayout({
  data,
  editable = false,
  onEditSection,
}: {
  data: DocumentsPageValue;
  editable?: boolean;
  onEditSection?: (section: DocumentsEditableSection) => void;
}) {
  const intro = data.intro.filter((p) => p.trim() !== "");
  // A row counts as publishable once it has a file OR a title — filtering on
  // title alone hid uploaded documents the admin never named.
  const categories = editable
    ? data.categories
    : data.categories
        .map((c) => ({
          ...c,
          documents: c.documents.filter(
            (d) => d.file.trim() !== "" || d.title.trim() !== "",
          ),
        }))
        .filter((c) => c.documents.length > 0);

  return (
    <main className="bg-surface text-foreground min-h-screen">
      {!editable && <Navbar forceSolidOnTop />}

      <EditableRegion
        as="div"
        section="hero"
        label={DOCUMENTS_SECTION_LABELS.hero}
        editable={editable}
        onEditSection={onEditSection}
      >
        <PageHero
          title={data.hero.title || "Documents & Downloads"}
          subtitle={data.hero.subtitle}
        />
      </EditableRegion>

      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <Breadcrumb
          items={[
            { label: "Engineering", href: "/institutions/engineering" },
            { label: "Documents" },
          ]}
        />

        {(intro.length > 0 || editable) && (
          <EditableRegion
            as="section"
            section="intro"
            label={DOCUMENTS_SECTION_LABELS.intro}
            editable={editable}
            onEditSection={onEditSection}
            className="mt-8 max-w-3xl"
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
              <p className="text-muted-foreground/60 text-sm italic">
                Click to add an introduction…
              </p>
            )}
          </EditableRegion>
        )}

        <EditableRegion
          as="section"
          section="categories"
          label={DOCUMENTS_SECTION_LABELS.categories}
          editable={editable}
          onEditSection={onEditSection}
          className="mt-12"
        >
          {categories.length > 0 ? (
            <div className="space-y-12">
              {categories.map((category, ci) => (
                <div key={ci}>
                  <h2 className="text-foreground mb-2 flex items-center gap-3 font-serif text-xl font-bold md:text-2xl">
                    <span className="bg-gold/20 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                      <FolderOpen size={20} />
                    </span>
                    {category.title || "Untitled Category"}
                  </h2>
                  {category.description && (
                    <p className="text-muted-foreground mb-5 text-sm leading-relaxed md:text-base">
                      {category.description}
                    </p>
                  )}

                  {category.documents.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {category.documents.map((doc, di) => {
                        const href = docUrl(doc.file);
                        return (
                          <a
                            key={di}
                            href={href || "#"}
                            target={href ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            onClick={
                              editable || !href
                                ? (e) => e.preventDefault()
                                : undefined
                            }
                            className="hover:border-gold/30 group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:bg-white/10"
                          >
                            <span className="bg-gold/15 text-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                              <FileText size={18} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="text-foreground group-hover:text-gold block text-sm font-bold transition-colors duration-300">
                                {docLabel(doc)}
                              </span>
                              {doc.description && (
                                <span className="text-muted-foreground mt-1 block text-xs leading-relaxed">
                                  {doc.description}
                                </span>
                              )}
                              <span className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                                {doc.updatedOn && (
                                  <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                                    <CalendarDays size={12} />
                                    {doc.updatedOn}
                                  </span>
                                )}
                                <span className="text-gold flex items-center gap-1.5 text-[11px] font-bold">
                                  <Download size={12} />
                                  Download
                                </span>
                              </span>
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-muted-foreground rounded-xl border-2 border-dashed border-white/10 py-8 text-center text-sm">
                      Click to add documents to this category
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-16 text-center">
              <FileText size={32} className="text-muted-foreground/40" />
              <p className="text-muted-foreground/60 mt-3 text-sm">
                {editable
                  ? "No documents yet. Click here to add the first category."
                  : "Documents will be published soon."}
              </p>
            </div>
          )}
        </EditableRegion>
      </div>

      {!editable && <Footer />}
    </main>
  );
}
