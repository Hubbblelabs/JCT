import { connectDB } from "@/lib/mongodb";
import { Placement } from "@/lib/models";
import { getImageUrl } from "@/lib/utils";

type PlacementLean = {
  _id: unknown;
  institution?: string;
  year?: string;
  is_current?: boolean;
  summary?: string;
  highest_package?: string;
  average_package?: string;
  median_package?: string;
  students_placed?: number;
  total_students?: number;
  placement_percentage?: number;
  offers_made?: number;
  companies_visited?: number;
  top_recruiters?: { name?: string; logo?: string }[];
  notable_placements?: {
    name?: string;
    program?: string;
    company?: string;
    package?: string;
    image?: string;
  }[];
  company_placements?: {
    company?: string;
    logo?: string;
    students?: { name?: string; program?: string; package?: string }[];
  }[];
};

export type PublicTopRecruiter = { name: string; logo: string | null };
export type PublicNotablePlacement = {
  name: string;
  program: string;
  company: string;
  package: string;
  image: string | null;
};

export type PublicCompanyStudent = {
  name: string;
  program: string;
  package: string;
};
export type PublicCompanyPlacement = {
  company: string;
  logo: string | null;
  students: PublicCompanyStudent[];
};

export type PublicPlacement = {
  _id: string;
  institution: string;
  year: string;
  is_current: boolean;
  summary: string;
  highest_package: string;
  average_package: string;
  median_package: string;
  students_placed: number;
  total_students: number;
  placement_percentage: number;
  offers_made: number;
  companies_visited: number;
  top_recruiters: PublicTopRecruiter[];
  notable_placements: PublicNotablePlacement[];
  company_placements: PublicCompanyPlacement[];
};

// Top recruiter name + logo live directly on each placement-year record — the
// carousel and this page share that single per-college source. Dedupe so a
// company only ever appears once per year's list.
function normalize(doc: PlacementLean): PublicPlacement {
  const seenRecruiters = new Set<string>();
  const top_recruiters: PublicTopRecruiter[] = [];
  for (const r of doc.top_recruiters ?? []) {
    const name = (r.name ?? "").trim();
    if (!name) continue;
    const key = name.toLowerCase();
    if (seenRecruiters.has(key)) continue;
    seenRecruiters.add(key);
    const logo = getImageUrl(r.logo);
    top_recruiters.push({ name, logo });
  }

  return {
    _id: String(doc._id),
    institution: doc.institution ?? "",
    year: doc.year ?? "",
    is_current: doc.is_current === true,
    summary: doc.summary ?? "",
    highest_package: doc.highest_package ?? "",
    average_package: doc.average_package ?? "",
    median_package: doc.median_package ?? "",
    students_placed: doc.students_placed ?? 0,
    total_students: doc.total_students ?? 0,
    placement_percentage: doc.placement_percentage ?? 0,
    offers_made: doc.offers_made ?? 0,
    companies_visited: doc.companies_visited ?? 0,
    top_recruiters,
    notable_placements: (doc.notable_placements ?? [])
      .map((p) => ({
        name: p.name ?? "",
        program: p.program ?? "",
        company: p.company ?? "",
        package: p.package ?? "",
        image: getImageUrl(p.image),
      }))
      .filter((p) => p.name || p.company),
    company_placements: (doc.company_placements ?? [])
      .map((c) => ({
        company: (c.company ?? "").trim(),
        logo: getImageUrl(c.logo),
        students: (c.students ?? [])
          .map((s) => ({
            name: (s.name ?? "").trim(),
            program: (s.program ?? "").trim(),
            package: (s.package ?? "").trim(),
          }))
          .filter((s) => s.name),
      }))
      .filter((c) => c.company && c.students.length > 0),
  };
}

// All active placement records for a college, newest first. Runs at build /
// ISR time; degrade to an empty list if the DB is briefly unreachable so the
// page still renders.
export async function listPublicPlacements(
  institution: string,
): Promise<PublicPlacement[]> {
  try {
    await connectDB();
    const docs = await Placement.find({ institution, is_active: true })
      .sort({ is_current: -1, sort_order: 1, year: -1 })
      .lean<PlacementLean[]>();
    return docs.map((doc) => normalize(doc));
  } catch (err) {
    console.warn(
      "[public-placements] listPublicPlacements failed; " +
        "falling back to empty list:",
      err,
    );
    return [];
  }
}
