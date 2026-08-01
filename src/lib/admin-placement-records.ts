"use client";

import { getImageUrl } from "@/lib/utils";
import type { PublicPlacement } from "@/lib/public-placements";
import type {
  CompanyPlacementValue,
  CompanyStudentValue,
  NotablePlacementValue,
  TopRecruiterValue,
} from "@/lib/validation";

export type {
  CompanyPlacementValue,
  CompanyStudentValue,
  NotablePlacementValue,
  TopRecruiterValue,
};

/**
 * Year-wise placement records as the admin API returns them: storage keys, not
 * resolved URLs, and including the ones hidden from the public site.
 *
 * The Placements page editor holds these alongside its site-config draft so the
 * whole page — copy and data — is authored in one place. They are `Placement`
 * documents rather than a config key, so they have no draft/publish split:
 * saving writes them straight through, whichever save button was used.
 */
export type AdminPlacementRecord = {
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
  top_recruiters: TopRecruiterValue[];
  notable_placements: NotablePlacementValue[];
  company_placements: CompanyPlacementValue[];
  is_active: boolean;
  sort_order: number;
};

/** Fields the editor writes back — `_id` and `institution` are not among them. */
const EDITABLE_FIELDS = [
  "year",
  "is_current",
  "summary",
  "highest_package",
  "average_package",
  "median_package",
  "students_placed",
  "total_students",
  "placement_percentage",
  "offers_made",
  "companies_visited",
  "top_recruiters",
  "notable_placements",
  "company_placements",
  "is_active",
  "sort_order",
] as const;

/** Fills in fields an older document predates, so every input is controlled. */
function normalize(raw: Record<string, unknown>): AdminPlacementRecord {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const num = (v: unknown) => (typeof v === "number" ? v : 0);
  const arr = <T>(v: unknown) => (Array.isArray(v) ? (v as T[]) : []);
  return {
    _id: str(raw._id) || String(raw._id ?? ""),
    institution: str(raw.institution),
    year: str(raw.year),
    is_current: raw.is_current === true,
    summary: str(raw.summary),
    highest_package: str(raw.highest_package),
    average_package: str(raw.average_package),
    median_package: str(raw.median_package),
    students_placed: num(raw.students_placed),
    total_students: num(raw.total_students),
    placement_percentage: num(raw.placement_percentage),
    offers_made: num(raw.offers_made),
    companies_visited: num(raw.companies_visited),
    top_recruiters: arr<TopRecruiterValue>(raw.top_recruiters),
    notable_placements: arr<NotablePlacementValue>(raw.notable_placements),
    company_placements: arr<CompanyPlacementValue>(raw.company_placements),
    is_active: raw.is_active !== false,
    sort_order: num(raw.sort_order),
  };
}

export async function loadPlacementRecords(
  institution: string,
): Promise<AdminPlacementRecord[]> {
  const r = await fetch(
    `/api/admin/placements?institution=${encodeURIComponent(institution)}`,
  );
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(
      body?.message ?? body?.error ?? "Failed to load placements",
    );
  }
  const docs = (await r.json()) as Record<string, unknown>[];
  return Array.isArray(docs) ? docs.map(normalize) : [];
}

/**
 * A year label that is free for this college. `(institution, year)` is unique,
 * so a blind "New Year" would 400 the second time.
 */
export function nextFreeYear(records: AdminPlacementRecord[]): string {
  const taken = new Set(records.map((r) => r.year.trim()));
  const start = new Date().getFullYear();
  for (let y = start; y > start - 25; y--) {
    const label = `${y}-${y + 1}`;
    if (!taken.has(label)) return label;
  }
  for (let n = 1; n < 100; n++) {
    const label = n === 1 ? "New Year" : `New Year ${n}`;
    if (!taken.has(label)) return label;
  }
  return `New Year ${Date.now()}`;
}

export async function createPlacementRecord(
  institution: string,
  year: string,
): Promise<AdminPlacementRecord> {
  const r = await fetch("/api/admin/placements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ institution, year }),
  });
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(body?.message ?? body?.error ?? "Could not add the year");
  }
  return normalize((await r.json()) as Record<string, unknown>);
}

export async function deletePlacementRecord(id: string): Promise<void> {
  const r = await fetch(`/api/admin/placements/${id}`, { method: "DELETE" });
  if (!r.ok) {
    const body = await r.json().catch(() => null);
    throw new Error(
      body?.message ?? body?.error ?? "Could not delete the year",
    );
  }
}

/**
 * PATCHes only the records that actually changed. Every field of every year is
 * live in the editor, so writing all of them on each save would rewrite — and
 * audit-log — years nobody touched.
 */
export async function savePlacementRecords(
  next: AdminPlacementRecord[],
  original: AdminPlacementRecord[],
): Promise<void> {
  const before = new Map(original.map((r) => [r._id, r]));
  const changed = next.filter((r) => {
    const prev = before.get(r._id);
    return !prev || !sameEditableFields(r, prev);
  });
  for (const record of changed) {
    const payload: Record<string, unknown> = {};
    for (const key of EDITABLE_FIELDS) payload[key] = record[key];
    const r = await fetch(`/api/admin/placements/${record._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const body = await r.json().catch(() => null);
      throw new Error(
        body?.message ??
          body?.error ??
          `Failed to save the ${record.year || "untitled"} record`,
      );
    }
  }
}

function sameEditableFields(
  a: AdminPlacementRecord,
  b: AdminPlacementRecord,
): boolean {
  return EDITABLE_FIELDS.every(
    (key) => JSON.stringify(a[key]) === JSON.stringify(b[key]),
  );
}

/**
 * Maps a record onto the shape the public layout renders. Storage keys become
 * URLs the same way the server-side `normalize()` does; an image still queued
 * for upload resolves to its local object URL so the preview shows the picked
 * file rather than a broken tile.
 */
export function toPreviewRecord(
  record: AdminPlacementRecord,
  getPreview: (key: string) => string | null,
): PublicPlacement {
  const url = (v: string): string | null => {
    const key = (v ?? "").trim();
    if (!key) return null;
    if (key.startsWith("pending:")) return getPreview(key);
    return getImageUrl(key);
  };
  return {
    _id: record._id,
    institution: record.institution,
    year: record.year,
    is_current: record.is_current,
    summary: record.summary,
    highest_package: record.highest_package,
    average_package: record.average_package,
    median_package: record.median_package,
    students_placed: record.students_placed,
    total_students: record.total_students,
    placement_percentage: record.placement_percentage,
    offers_made: record.offers_made,
    companies_visited: record.companies_visited,
    top_recruiters: record.top_recruiters.map((r) => ({
      name: r.name ?? "",
      logo: url(r.logo ?? ""),
    })),
    notable_placements: record.notable_placements.map((s) => ({
      name: s.name ?? "",
      program: s.program ?? "",
      company: s.company ?? "",
      package: s.package ?? "",
      image: url(s.image ?? ""),
    })),
    company_placements: record.company_placements.map((c) => ({
      company: c.company ?? "",
      logo: url(c.logo ?? ""),
      students: (c.students ?? []).map((s) => ({
        name: s.name ?? "",
        program: s.program ?? "",
        package: s.package ?? "",
      })),
    })),
  };
}
