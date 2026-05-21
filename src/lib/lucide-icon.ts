import {
  Award,
  BookOpen,
  Briefcase,
  Building,
  Building2,
  Calendar,
  CalendarCheck,
  CheckCircle2,
  FileText,
  FlaskConical,
  GraduationCap,
  Globe,
  Heart,
  Lightbulb,
  Rocket,
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
  bookopen: BookOpen,
  briefcase: Briefcase,
  building: Building,
  building2: Building2,
  calendar: Calendar,
  calendarcheck: CalendarCheck,
  checkcircle: CheckCircle2,
  file: FileText,
  filetext: FileText,
  flask: FlaskConical,
  flaskconical: FlaskConical,
  cap: GraduationCap,
  graduationcap: GraduationCap,
  globe: Globe,
  heart: Heart,
  lightbulb: Lightbulb,
  rocket: Rocket,
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
  return ICONS[name.trim().toLowerCase()] ?? fallback;
}
