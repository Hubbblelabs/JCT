import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import {
  AuditLog,
  Event,
  ImageAsset,
  Placement,
  Program,
  Testimonial,
} from "@/lib/models";
import { DashboardClient } from "@/components/admin/dashboard/DashboardClient";
import type { DashboardData } from "@/components/admin/dashboard/types";
import { getImageUrl } from "@/lib/utils";

type Doc = Record<string, unknown>;

const str = (v: unknown): string => (v == null ? "" : String(v));
const num = (v: unknown): number => (typeof v === "number" ? v : 0);

function toIso(v: unknown): string {
  const d = v instanceof Date ? v : new Date(str(v));
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

const EMPTY: Omit<DashboardData, "storage"> = {
  dbOk: false,
  stats: {
    programs: 0,
    published: 0,
    drafts: 0,
    placements: 0,
    testimonials: 0,
    events: 0,
    images: 0,
  },
  weekly: {},
  activity: [],
  uploads: [],
  events: [],
  placementRecords: [],
  latestTestimonials: [],
};

async function getDashboardData(): Promise<DashboardData> {
  const storage: DashboardData["storage"] =
    process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET_NAME ? "r2" : "local";
  try {
    await connectDB();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [
      programs,
      published,
      drafts,
      placements,
      testimonials,
      events,
      images,
      logs,
      weeklyRaw,
      uploadDocs,
      eventDocs,
      placementDocs,
      testimonialDocs,
    ] = await Promise.all([
      Program.countDocuments({ is_active: true }),
      Program.countDocuments({ status: "published" }),
      Program.countDocuments({ status: "draft" }),
      Placement.countDocuments({ is_active: true }),
      Testimonial.countDocuments({ is_active: true }),
      Event.countDocuments({ is_active: true }),
      ImageAsset.countDocuments(),
      AuditLog.find().sort({ created_at: -1 }).limit(12).lean(),
      AuditLog.aggregate([
        { $match: { created_at: { $gte: weekAgo } } },
        { $group: { _id: "$entity_type", count: { $sum: 1 } } },
      ]),
      ImageAsset.find().sort({ created_at: -1 }).limit(4).lean(),
      Event.find({ is_active: true }).sort({ event_date: -1 }).limit(4).lean(),
      Placement.find({ is_active: true })
        .sort({ is_current: -1, year: -1 })
        .limit(3)
        .lean(),
      Testimonial.find({ is_active: true })
        .sort({ created_at: -1 })
        .limit(3)
        .lean(),
    ]);

    return {
      dbOk: true,
      storage,
      stats: {
        programs,
        published,
        drafts,
        placements,
        testimonials,
        events,
        images,
      },
      weekly: Object.fromEntries(
        (weeklyRaw as Array<{ _id: unknown; count: unknown }>).map((w) => [
          str(w._id),
          num(w.count),
        ]),
      ),
      activity: (logs as Doc[]).map((log) => ({
        id: str(log._id),
        entityType: str(log.entity_type),
        action: str(log.action),
        userEmail: str(log.user_email),
        summary: str(log.summary),
        createdAt: toIso(log.created_at),
      })),
      uploads: (uploadDocs as Doc[]).map((img) => ({
        id: str(img._id),
        filename: str(img.filename),
        url: getImageUrl(str(img.url)) ?? "",
        altText: str(img.alt_text),
        category: str(img.category),
        createdAt: toIso(img.created_at),
      })),
      events: (eventDocs as Doc[]).map((event) => ({
        id: str(event._id),
        title: str(event.title),
        category: str(event.category),
        institution: str(event.institution),
        eventDate: toIso(event.event_date),
        location: str(event.location),
      })),
      placementRecords: (placementDocs as Doc[]).map((p) => ({
        id: str(p._id),
        institution: str(p.institution),
        year: str(p.year),
        studentsPlaced: num(p.students_placed),
        placementPercentage: num(p.placement_percentage),
        highestPackage: str(p.highest_package),
        isCurrent: Boolean(p.is_current),
      })),
      latestTestimonials: (testimonialDocs as Doc[]).map((t) => ({
        id: str(t._id),
        name: str(t.name),
        batch: str(t.batch),
        category: str(t.category),
        institution: str(t.institution),
        quote: str(t.quote),
        avatar: getImageUrl(str(t.avatar)) ?? "",
      })),
    };
  } catch {
    return { ...EMPTY, storage };
  }
}

export default async function DashboardPage() {
  const session = await auth();

  const role = (session?.user as Record<string, unknown>)?.role as string;
  if (role === "editor") {
    const institution = (session?.user as Record<string, unknown>)
      ?.institution as string;
    redirect(`/admin/page-content?college=${institution || "engineering"}`);
  }

  const data = await getDashboardData();

  return (
    <DashboardClient
      data={data}
      user={{
        name: session?.user?.name ?? "",
        email: session?.user?.email ?? "",
        role: role ?? "admin",
      }}
    />
  );
}
