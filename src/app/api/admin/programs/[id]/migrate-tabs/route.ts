import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Program } from "@/lib/models";
import { requireRole, json, notFound, serverError } from "@/lib/api-helpers";
import { logAudit } from "@/lib/audit";

type Tab = {
  id: string;
  label: string;
  icon?: string;
  sections: unknown[];
};

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function nonEmptyString(v: unknown): string | null {
  return typeof v === "string" && v.trim().length > 0 ? v : null;
}

function arrayOrEmpty<T = unknown>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build a default 6-tab structure from legacy flat fields, mirroring the
 * fixed-tab ProgramPageLayout.
 */
function buildTabsFromLegacy(content: Record<string, unknown>): Tab[] {
  const tabs: Tab[] = [];

  // Overview
  const overviewSections: unknown[] = [];
  const aboutParagraphs = [content.about1, content.about2, content.about3]
    .map(asString)
    .filter((p) => p.trim().length > 0);
  if (aboutParagraphs.length > 0) {
    overviewSections.push({
      kind: "richText",
      html: aboutParagraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n"),
    });
  }
  const overviewStats: { label: string; value: string; sub?: string }[] = [];
  if (nonEmptyString(content.established))
    overviewStats.push({
      label: "Established",
      value: String(content.established),
    });
  if (nonEmptyString(content.intake))
    overviewStats.push({ label: "Intake", value: String(content.intake) });
  if (nonEmptyString(content.accreditation))
    overviewStats.push({
      label: "Accreditation",
      value: String(content.accreditation),
    });
  if (overviewStats.length > 0)
    overviewSections.push({ kind: "stats", items: overviewStats });
  tabs.push({
    id: "overview",
    label: "Overview",
    icon: "overview",
    sections: overviewSections,
  });

  // Academics
  const academicsSections: unknown[] = [];
  if (nonEmptyString(content.vision))
    academicsSections.push({
      kind: "richText",
      html: `<h3>Vision</h3><p>${escapeHtml(String(content.vision))}</p>`,
    });
  if (nonEmptyString(content.mission))
    academicsSections.push({
      kind: "richText",
      html: `<h3>Mission</h3><p>${escapeHtml(String(content.mission))}</p>`,
    });
  const outcomes = arrayOrEmpty<string>(content.outcomes).filter(
    (s) => typeof s === "string" && s.length > 0,
  );
  if (outcomes.length > 0)
    academicsSections.push({
      kind: "list",
      title: "Programme Outcomes",
      items: outcomes,
    });
  tabs.push({
    id: "academics",
    label: "Academics",
    icon: "academics",
    sections: academicsSections,
  });

  // Faculty
  const facultySections: unknown[] = [];
  const hodName = nonEmptyString(content.hodName);
  if (hodName) {
    facultySections.push({
      kind: "people",
      items: [
        {
          name: hodName,
          title: asString(content.hodDesignation) || "Head of Department",
          image: nonEmptyString(content.hodPhoto) ?? "",
          qualifications: asString(content.hodQualification),
        },
      ],
    });
    if (nonEmptyString(content.hodMessage))
      facultySections.push({
        kind: "richText",
        html: `<h3>Message from the Head</h3><p>${escapeHtml(String(content.hodMessage))}</p>`,
      });
  }
  const facultyList = arrayOrEmpty<Record<string, unknown>>(content.faculty);
  if (facultyList.length > 0) {
    facultySections.push({
      kind: "people",
      items: facultyList.map((f) => ({
        name: asString(f.name),
        title: asString(f.title ?? f.designation),
        image: asString(f.image ?? f.photo),
        email: asString(f.email),
        qualifications: asString(f.qualifications ?? f.qualification),
      })),
    });
  }
  tabs.push({
    id: "faculty",
    label: "Faculty & Council",
    icon: "faculty",
    sections: facultySections,
  });

  // Facilities
  const facilitiesSections: unknown[] = [];
  const labs = arrayOrEmpty<Record<string, unknown>>(content.labs);
  if (labs.length > 0) {
    facilitiesSections.push({
      kind: "cards",
      title: "Laboratories",
      items: labs.map((l) => ({
        title: asString(l.name ?? l.title),
        description: asString(l.description ?? l.desc),
        image: asString(l.image),
      })),
    });
  }
  tabs.push({
    id: "facilities",
    label: "Facilities",
    icon: "facilities",
    sections: facilitiesSections,
  });

  // Life
  const lifeSections: unknown[] = [];
  const achievements = arrayOrEmpty<Record<string, unknown>>(
    content.achievements,
  );
  if (achievements.length > 0) {
    lifeSections.push({
      kind: "cards",
      title: "Highlights",
      items: achievements.map((a) => ({
        title: asString(a.title),
        description: asString(a.description ?? a.desc),
        image: asString(a.image),
      })),
    });
  }
  tabs.push({
    id: "life",
    label: "Life & Achievements",
    icon: "life",
    sections: lifeSections,
  });

  // Career
  const careerSections: unknown[] = [];
  const careerStats: { label: string; value: string; sub?: string }[] = [];
  if (nonEmptyString(content.placementRate))
    careerStats.push({
      label: "Placement Rate",
      value: String(content.placementRate),
    });
  if (nonEmptyString(content.averagePackage))
    careerStats.push({
      label: "Average Package",
      value: String(content.averagePackage),
    });
  if (nonEmptyString(content.highestPackage))
    careerStats.push({
      label: "Highest Package",
      value: String(content.highestPackage),
    });
  if (careerStats.length > 0)
    careerSections.push({ kind: "stats", items: careerStats });
  const recruiters = arrayOrEmpty<string>(content.topRecruiters).filter(
    (s) => typeof s === "string" && s.length > 0,
  );
  if (recruiters.length > 0)
    careerSections.push({
      kind: "list",
      title: "Top Recruiters",
      items: recruiters,
    });
  tabs.push({
    id: "career",
    label: "Career & Feedback",
    icon: "career",
    sections: careerSections,
  });

  return tabs;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { session, error } = await requireRole(req, "editor");
  if (error) return error;

  try {
    await connectDB();
    const { id } = await params;
    const doc = await Program.findById(id);
    if (!doc) return notFound("Program not found");

    const existing = (doc.content ?? {}) as Record<string, unknown>;
    if (Array.isArray(existing.tabs) && existing.tabs.length > 0) {
      return json({
        content: existing,
        message: "Tabs already present — no changes made.",
      });
    }

    const tabs = buildTabsFromLegacy(existing);
    const nextContent = { ...existing, tabs };
    doc.content = nextContent;
    doc.updated_by = session!.user?.email ?? "";
    await doc.save();

    await logAudit(
      "program",
      "migrated-tabs",
      session!.user?.email ?? "",
      `Generated default tabs for program ${doc.slug}`,
    );

    return json({ content: nextContent });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
