"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { LivePageEditor } from "@/components/admin/LivePageEditor";
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
import { contentPageDefault } from "@/lib/content-page-defaults";
import { ContentPageSchema } from "@/lib/validation";
import type { ContentPageValue } from "@/lib/validation";

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
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!def) {
    return (
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Page not found</h1>
            <p className="admin-page-subtitle">
              No content page is registered for &ldquo;{slug}&rdquo;.
            </p>
          </div>
        </div>
      </div>
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
      title={`${def.label} Editor`}
      subtitle={def.description}
      // An unsaved statutory page opens on the copy the public route is
      // already serving, not a blank canvas — otherwise the first save would
      // wipe the live text.
      emptyValue={() =>
        ContentPageSchema.parse(contentPageDefault(def.slug) ?? {})
      }
      sectionOrder={sectionOrder}
      sectionLabels={CONTENT_SECTION_LABELS}
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
