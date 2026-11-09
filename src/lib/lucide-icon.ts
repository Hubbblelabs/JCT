import {
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Cloud,
  Compass,
  Cpu,
  FileText,
  FlaskConical,
  GraduationCap,
  Globe,
  Heart,
  Lightbulb,
  Network,
  Plane,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

// CMS-managed sections store icons as plain name strings. This curated map
// resolves those names to Lucide components — keeping the client bundle small
// instead of importing the entire icon set.
const ICONS: Record<string, LucideIcon> = {
  award: Award,
  badgecheck: BadgeCheck,
  bookopen: BookOpen,
  briefcase: Briefcase,
  building: Building,
  building2: Building2,
  calendar: Calendar,
  calendarcheck: CalendarCheck,
  checkcircle: CheckCircle2,
  cloud: Cloud,
  compass: Compass,
  cpu: Cpu,
  file: FileText,
  filetext: FileText,
  flask: FlaskConical,
  flaskconical: FlaskConical,
  cap: GraduationCap,
  graduationcap: GraduationCap,
  globe: Globe,
  heart: Heart,
  lightbulb: Lightbulb,
  network: Network,
  plane: Plane,
  rocket: Rocket,
  shieldcheck: ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  trend: TrendingUp,
  trendingup: TrendingUp,
  growth: TrendingUp,
  trophy: Trophy,
  users: Users,
};

export function resolveIcon(
  name: string | undefined,
  fallback: LucideIcon,
): LucideIcon {
  if (!name) return fallback;
  const key = name.trim().toLowerCase();
  // Own keys only: the name is free text from the CMS, and "constructor" or
  // "__proto__" would otherwise resolve to Object / Object.prototype, which
  // React refuses to render — taking the whole page down with it.
  return Object.hasOwn(ICONS, key) ? ICONS[key] : fallback;
}
