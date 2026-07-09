import type { ComponentType } from "react";

/** Minimal icon contract satisfied by lucide-react components. */
export type IconType = ComponentType<{ size?: number; className?: string }>;

export type ActivityItem = {
  id: string;
  entityType: string;
  action: string;
  userEmail: string;
  summary: string;
  createdAt: string;
};

export type UploadItem = {
  id: string;
  filename: string;
  url: string;
  altText: string;
  category: string;
  createdAt: string;
};

export type EventItem = {
  id: string;
  title: string;
  category: string;
  institution: string;
  eventDate: string;
  location: string;
};

export type PlacementItem = {
  id: string;
  institution: string;
  year: string;
  studentsPlaced: number;
  placementPercentage: number;
  highestPackage: string;
  isCurrent: boolean;
};

export type TestimonialItem = {
  id: string;
  name: string;
  batch: string;
  category: string;
  institution: string;
  quote: string;
  avatar: string;
};

export type DashboardStats = {
  programs: number;
  published: number;
  drafts: number;
  placements: number;
  testimonials: number;
  events: number;
  images: number;
};

export type DashboardData = {
  dbOk: boolean;
  storage: "r2" | "local";
  stats: DashboardStats;
  /** Audit-logged changes in the last 7 days, keyed by entity_type. */
  weekly: Record<string, number>;
  activity: ActivityItem[];
  uploads: UploadItem[];
  events: EventItem[];
  placementRecords: PlacementItem[];
  latestTestimonials: TestimonialItem[];
};

export type DashboardUser = {
  name: string;
  email: string;
  role: string;
};
