export type Section =
  | { kind: "richText"; html: string }
  | {
      kind: "stats";
      items: { label: string; value: string; sub?: string }[];
    }
  | { kind: "list"; title?: string; items: string[] }
  | {
      kind: "cards";
      title?: string;
      items: { title: string; description: string; image?: string }[];
    }
  | { kind: "image"; src: string; caption?: string }
  | {
      kind: "people";
      items: {
        name: string;
        title: string;
        image?: string;
        email?: string;
        qualifications?: string;
      }[];
    };

export type Tab = {
  id: string;
  label: string;
  icon?: string;
  sections: Section[];
};

export type TabsDept = {
  name: string;
  shortName?: string;
  heroImage?: string;
  accentColor?: string;
  tabs: Tab[];
};

export function isTabsContent(content: unknown): content is TabsDept {
  if (!content || typeof content !== "object") return false;
  const c = content as Record<string, unknown>;
  if (!Array.isArray(c.tabs)) return false;
  return c.tabs.length > 0;
}

export function normalizeTabsContent(content: unknown): TabsDept | null {
  if (!isTabsContent(content)) return null;
  const c = content as Record<string, unknown>;
  return {
    name: typeof c.name === "string" ? c.name : "",
    shortName: typeof c.shortName === "string" ? c.shortName : undefined,
    heroImage: typeof c.heroImage === "string" ? c.heroImage : undefined,
    accentColor:
      typeof c.accentColor === "string" ? c.accentColor : undefined,
    tabs: c.tabs as Tab[],
  };
}
