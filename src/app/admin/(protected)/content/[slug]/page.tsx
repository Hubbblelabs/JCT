"use client";

import { useParams } from "next/navigation";
import { LivePageEditor } from "@/components/admin/LivePageEditor";
import {
  ContentPageLayout,
  CONTENT_SECTION_LABELS,
  CONTENT_SECTION_ORDER,
  contentSectionTitle,
  type ContentEditableSection,
} from "@/components/layout/ContentPageLayout";
import { ContentPageInspector } from "@/components/admin/ContentPageInspector";
import { getContentPage } from "@/lib/content-pages";
import { ContentPageSchema } from "@/lib/validation";
import type { ContentPageValue } from "@/lib/validation";

/**
 * One editor for every block-based content page — which page is being edited
 * comes from the `[slug]` segment and the registry in `src/lib/content-pages.ts`.
 */
export default function ContentPageEditor() {
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const def = getContentPage(slug);

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

  return (
    <LivePageEditor<ContentPageValue>
      key={def.slug}
      configKey={def.configKey}
      publicPath={def.path}
      title={`${def.label} Editor`}
      subtitle={def.description}
      emptyValue={() => ContentPageSchema.parse({})}
      sectionOrder={CONTENT_SECTION_ORDER}
      sectionLabels={CONTENT_SECTION_LABELS}
      sectionTitle={contentSectionTitle}
      initialSection="blocks"
      renderPreview={({ data, onEditSection }) => (
        <ContentPageLayout
          data={data}
          editable
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
