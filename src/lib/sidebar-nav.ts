import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Camera,
  ClipboardList,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
  Heart,
  Home,
  Info,
  Landmark,
  Layers,
  Link as LinkIcon,
  MessageSquareQuote,
  Newspaper,
  Phone,
  Rocket,
  School,
  Sparkles,
  Star,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type SidebarNavDefault = {
  anchor: string;
  navLabel: string;
  icon: LucideIcon;
};

export type ResolvedSidebarItem = {
  id: string;
  anchor: string;
  navLabel: string;
  icon: LucideIcon;
  /** Present iff this is a custom link (not a built-in anchor). */
  customHref?: string;
  isExternal?: boolean;
};

export type SidebarNavItemRaw = {
  id?: string;
  key?: string;
  label?: string;
  href?: string;
  icon?: string;
  visible?: boolean;
};

export const SIDEBAR_ICON_OPTIONS = [
  "Landmark",
  "Target",
  "MessageSquareQuote",
  "Briefcase",
  "BookOpen",
  "Users",
  "Heart",
  "Award",
  "School",
  "Star",
  "FileText",
  "ClipboardList",
  "Download",
  "Newspaper",
  "Trophy",
  "Sparkles",
  "Calendar",
  "Camera",
  "Phone",
  "Info",
  "Home",
  "GraduationCap",
  "Layers",
  "Rocket",
  "Building2",
  "Link",
  "ExternalLink",
] as const;
export type SidebarIconName = (typeof SIDEBAR_ICON_OPTIONS)[number];

const ICON_REGISTRY: Record<string, LucideIcon> = {
  Landmark,
  Target,
  MessageSquareQuote,
  Briefcase,
  BookOpen,
  Users,
  Heart,
  Award,
  School,
  Star,
  FileText,
  ClipboardList,
  Download,
  Newspaper,
  Trophy,
  Sparkles,
  Calendar,
  Camera,
  Phone,
  Info,
  Home,
  GraduationCap,
  Layers,
  Rocket,
  Building2,
  Link: LinkIcon,
  ExternalLink,
};

export function lookupSidebarIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  return ICON_REGISTRY[name] ?? null;
}

export function resolveSidebarItems(
  defaults: SidebarNavDefault[],
  overrides: SidebarNavItemRaw[] | undefined | null,
): ResolvedSidebarItem[] {
  if (!Array.isArray(overrides) || overrides.length === 0) {
    return defaults.map((d) => ({
      id: `b:${d.anchor}`,
      anchor: d.anchor,
      navLabel: d.navLabel,
      icon: d.icon,
    }));
  }
  const builtinMap = new Map(defaults.map((d) => [d.anchor, d]));
  const out: ResolvedSidebarItem[] = [];
  for (let i = 0; i < overrides.length; i++) {
    const o = overrides[i];
    if (!o || o.visible === false) continue;
    const idBase = o.id || o.key || `i:${i}`;
    const href = (o.href ?? "").trim();
    if (href) {
      out.push({
        id: `c:${idBase}`,
        anchor: o.id || `c-${i}`,
        navLabel: (o.label ?? "").trim() || "Untitled",
        icon: lookupSidebarIcon(o.icon) ?? ExternalLink,
        customHref: href,
        isExternal: /^https?:\/\//i.test(href),
      });
      continue;
    }
    const builtin = builtinMap.get(o.key ?? "");
    if (!builtin) continue;
    out.push({
      id: `b:${builtin.anchor}`,
      anchor: builtin.anchor,
      navLabel: (o.label ?? "").trim() || builtin.navLabel,
      icon: lookupSidebarIcon(o.icon) ?? builtin.icon,
    });
  }
  return out;
}

/** Defaults map exposed so admin can show built-in entries when the override list is empty. */
export function defaultsAsOverrides(
  defaults: SidebarNavDefault[],
): SidebarNavItemRaw[] {
  return defaults.map((d) => ({
    id: `b-${d.anchor}`,
    key: d.anchor,
    label: d.navLabel,
    visible: true,
  }));
}
