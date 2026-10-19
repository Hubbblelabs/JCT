"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LivePageEditor } from "@/components/admin/LivePageEditor";
import { PageShell } from "@/components/admin/kit";
import {
  ContentPageLayout,
  CONTENT_SECTION_LABELS,
  CONTENT_SECTION_ORDER,
  contentSectionTitle,
  type ContentEditableSection,
} from "@/components/layout/ContentPageLayout";
import { ContentPageInspector } from "@/components/admin/ContentPageInspector";
import {
  contentPageUrl,
  getContentPage,
  hostAdminEditor,
} from "@/lib/content-pages";
import { ContentPageSchema } from "@/lib/validation";
import type { ContentPageValue } from "@/lib/validation";

const SECTION_HELP: Record<string, string> = {
  hero: "The banner at the top of the page: title and subtitle.",
  breadcrumb:
    "The trail of links under the banner showing where this page sits.",
  intro: "The opening paragraphs before the content blocks.",
  blocks:
    "The body of the page — text, tables, downloads, photos and more. Add, reorder or remove blocks here, or click one on the page to edit it.",
};

/**
 * One editor for every block-based content page — which page is being edited
 * comes from the `[slug]` segment and the registry in `src/lib/content-pages.ts`.
 */
export default function ContentPageEditor() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const def = getContentPage(slug);

  // A hosted page is authored inside its host's editor, which loads and saves
  // it alongside the rest of that page. Old bookmarks land here, so send them
  // on rather than opening a second editor for the same config key.
  const hostEditor = def ? hostAdminEditor(def) : undefined;
  useEffect(() => {
    if (hostEditor) router.replace(hostEditor);
  }, [hostEditor, router]);

  if (hostEditor) {
    return (
      <div className="admin-content">
        <div className="flex items-center justify-center py-28">
          <Loader2
            size={24}
            className="animate-spin text-[var(--admin-text-faint)]"
          />
        </div>
      </div>
    );
  }

  if (!def) {
    return (
      <PageShell
        title="Page not found"
        description={
          <>No content page is registered for &ldquo;{slug}&rdquo;.</>
        }
      >
        {null}
      </PageShell>
    );
  }

  // A hosted page's breadcrumb never reaches the public site — the host route
  // owns the trail — so its quick-jump button is dropped too.
  const sectionOrder = def.host
    ? CONTENT_SECTION_ORDER.filter((s) => s !== "breadcrumb")
    : CONTENT_SECTION_ORDER;

  return (
    <LivePageEditor<ContentPageValue>
      key={def.slug}
      configKey={def.configKey}
      // A hosted page has no URL of its own — link to the panel it renders as.
      publicPath={contentPageUrl(def)}
      title={def.label}
      subtitle={def.description}
      // Blank, like every other content page. The footer pages used to open on
      // a module of hard-coded copy, which showed the editor text that did not
      // exist in the database and made "what is stored" unanswerable from the
      // screen. Their copy is seeded into SiteConfig instead, so an unsaved
      // page here genuinely has nothing stored.
      emptyValue={() => ContentPageSchema.parse({})}
      sectionOrder={sectionOrder}
      sectionLabels={CONTENT_SECTION_LABELS}
      sectionHelp={SECTION_HELP}
      sectionTitle={contentSectionTitle}
      initialSection="blocks"
      renderPreview={({ data, onEditSection }) => (
        <ContentPageLayout
          data={data}
          editable
          showBreadcrumb={!def.host}
          onEditSection={onEditSection as (s: ContentEditableSection) => void}
        />
      )}
      renderInspector={({ section, data, onChange, onSelectSection }) => (
        <ContentPageInspector
          section={section}
          data={data}
          onChange={onChange}
          onSelectSection={onSelectSection}
        />
      )}
    />
  );
}
