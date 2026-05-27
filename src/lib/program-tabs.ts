import { sanitizeHtml } from "@/lib/sanitize-html";

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

export type TabsProgram = {
  name: string;
  shortName?: string;
  heroImage?: string;
  accentColor?: string;
  tabs: Tab[];
};

export function isTabsContent(content: unknown): content is TabsProgram {
  if (!content || typeof content !== "object") return false;
  const c = content as Record<string, unknown>;
  if (!Array.isArray(c.tabs)) return false;
  return c.tabs.length > 0;
}

function normalizeSection(raw: unknown): Section | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  // richText is the only untrusted-HTML carrier. All other section kinds
  // bind to attributes/text rendered via React, which auto-escapes.
  if (s.kind === "richText") {
    return { kind: "richText", html: sanitizeHtml(s.html) };
  }
  return s as Section;
}

function normalizeTab(raw: unknown): Tab | null {
  if (!raw || typeof raw !== "object") return null;
  const t = raw as Record<string, unknown>;
  if (typeof t.id !== "string" || typeof t.label !== "string") return null;
  const sections = Array.isArray(t.sections)
    ? (t.sections
        .map(normalizeSection)
        .filter((x): x is Section => x !== null) as Section[])
    : [];
  return {
    id: t.id,
    label: t.label,
    icon: typeof t.icon === "string" ? t.icon : undefined,
    sections,
  };
}

export function normalizeTabsContent(content: unknown): TabsProgram | null {
  if (!isTabsContent(content)) return null;
  const c = content as Record<string, unknown>;
  const tabs = (c.tabs as unknown[])
    .map(normalizeTab)
    .filter((x): x is Tab => x !== null);
  return {
    name: typeof c.name === "string" ? c.name : "",
    shortName: typeof c.shortName === "string" ? c.shortName : undefined,
    heroImage: typeof c.heroImage === "string" ? c.heroImage : undefined,
    accentColor: typeof c.accentColor === "string" ? c.accentColor : undefined,
    tabs,
  };
}
