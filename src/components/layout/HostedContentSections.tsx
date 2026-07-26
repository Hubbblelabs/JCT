import { loadHostedContentPages } from "@/lib/hosted-content";
import { ContentPageBody } from "@/components/layout/ContentPageLayout";
import {
  SectionPanelHeading,
  type PageSectionItem,
} from "@/components/layout/SectionedPageShell";

/**
 * Turns the content pages a host route absorbs (see `loadHostedContentPages`)
 * into panels for `SectionedPageShell`.
 */
export async function loadHostedSections(
  hostPath: string,
): Promise<PageSectionItem[]> {
  const pages = await loadHostedContentPages(hostPath);
  return pages.map(({ def, data }) => {
    const Icon = def.icon;
    return {
      id: def.host!.anchor,
      label: def.host!.navLabel,
      icon: <Icon />,
      content: (
        <>
          <SectionPanelHeading
            title={data.hero?.title?.trim() || def.label}
            subtitle={data.hero?.subtitle}
          />
          <ContentPageBody data={data} />
        </>
      ),
    };
  });
}
