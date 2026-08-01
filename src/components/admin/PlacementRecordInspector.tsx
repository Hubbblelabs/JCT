"use client";

import { CalendarDays, Loader2, Plus, Star, Trash2 } from "lucide-react";
import {
  Field,
  FormGrid,
  TextInput,
  TextArea,
  NumberInput,
  ImageUploadInput,
  Repeater,
} from "@/components/admin/inputs";
import {
  PLACEMENT_RECORD_SECTION_LABELS,
  type PlacementRecordSectionKey,
} from "@/components/layout/PlacementsPageLayout";
import type {
  AdminPlacementRecord,
  CompanyPlacementValue,
  CompanyStudentValue,
  NotablePlacementValue,
  TopRecruiterValue,
} from "@/lib/admin-placement-records";

/**
 * The year-wise placement data, edited from inside the Placements page editor.
 *
 * These fields used to live in a modal on a screen of their own; the page is
 * now the only place they are authored, so each block of the live preview
 * opens the matching part of the record here.
 */

export function PlacementRecordInspector({
  record,
  sectionKey,
  onChange,
}: {
  record: AdminPlacementRecord;
  sectionKey: PlacementRecordSectionKey;
  onChange: (next: AdminPlacementRecord) => void;
}) {
  const patch = (p: Partial<AdminPlacementRecord>) =>
    onChange({ ...record, ...p });

  if (sectionKey === "overview") {
    return (
      <FormGrid>
        <TextInput
          label="Academic Year"
          span={4}
          value={record.year}
          onChange={(e) => patch({ year: e.target.value })}
          placeholder="2024-2025"
          required
        />
        <Field label="Visibility" span={8}>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={record.is_current}
              onChange={(e) => patch({ is_current: e.target.checked })}
            />
            Current year (selected first on the public page)
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={record.is_active}
              onChange={(e) => patch({ is_active: e.target.checked })}
            />
            Active (shown on the website)
          </label>
        </Field>
        <TextArea
          label="Summary"
          span="full"
          rows={3}
          value={record.summary}
          onChange={(e) => patch({ summary: e.target.value })}
          hint="Short intro shown above this year's figures."
        />

        <TextInput
          label="Highest Package"
          span={4}
          value={record.highest_package}
          onChange={(e) => patch({ highest_package: e.target.value })}
          placeholder="45 LPA"
        />
        <TextInput
          label="Average Package"
          span={4}
          value={record.average_package}
          onChange={(e) => patch({ average_package: e.target.value })}
          placeholder="8.5 LPA"
        />
        <TextInput
          label="Median Package"
          span={4}
          value={record.median_package}
          onChange={(e) => patch({ median_package: e.target.value })}
          placeholder="6 LPA"
        />

        <NumberInput
          label="Students Placed"
          span={3}
          value={record.students_placed}
          onChange={(e) => patch({ students_placed: Number(e.target.value) })}
          min={0}
        />
        <NumberInput
          label="Total Eligible"
          span={3}
          value={record.total_students}
          onChange={(e) => patch({ total_students: Number(e.target.value) })}
          min={0}
        />
        <NumberInput
          label="Placement %"
          span={2}
          value={record.placement_percentage}
          onChange={(e) =>
            patch({ placement_percentage: Number(e.target.value) })
          }
          min={0}
        />
        <NumberInput
          label="Offers Made"
          span={2}
          value={record.offers_made}
          onChange={(e) => patch({ offers_made: Number(e.target.value) })}
          min={0}
        />
        <NumberInput
          label="Companies Visited"
          span={2}
          value={record.companies_visited}
          onChange={(e) => patch({ companies_visited: Number(e.target.value) })}
          min={0}
        />
      </FormGrid>
    );
  }

  if (sectionKey === "recruiters") {
    return (
      <>
        <p className="mb-3 text-xs text-gray-500">
          Company name and logo. These recruiters also power the recruiter
          carousel under Placement Highlights.
        </p>
        <Repeater<TopRecruiterValue>
          label="Top Recruiters"
          itemSpan={6}
          items={record.top_recruiters}
          onChange={(top_recruiters) => patch({ top_recruiters })}
          newItem={() => ({ name: "", logo: "" })}
          renderItem={(item, _i, oc) => (
            <FormGrid tight>
              <TextInput
                label="Company Name"
                span="full"
                value={item.name}
                onChange={(e) => oc({ ...item, name: e.target.value })}
              />
              <ImageUploadInput
                label="Logo"
                span="full"
                ratio="square"
                value={item.logo}
                onChange={(logo) => oc({ ...item, logo })}
                hideUrlField
              />
            </FormGrid>
          )}
        />
      </>
    );
  }

  if (sectionKey === "achievers") {
    return (
      <Repeater<NotablePlacementValue>
        label="Placed Students"
        itemSpan={6}
        items={record.notable_placements}
        onChange={(notable_placements) => patch({ notable_placements })}
        newItem={() => ({
          name: "",
          program: "",
          company: "",
          package: "",
          image: "",
        })}
        renderItem={(item, _i, oc) => (
          <FormGrid tight>
            <TextInput
              label="Student Name"
              span={7}
              value={item.name}
              onChange={(e) => oc({ ...item, name: e.target.value })}
            />
            <TextInput
              label="Program"
              span={5}
              value={item.program}
              onChange={(e) => oc({ ...item, program: e.target.value })}
              placeholder="B.E. CSE"
            />
            <TextInput
              label="Company"
              span={7}
              value={item.company}
              onChange={(e) => oc({ ...item, company: e.target.value })}
            />
            <TextInput
              label="Package"
              span={5}
              value={item.package}
              onChange={(e) => oc({ ...item, package: e.target.value })}
              placeholder="12 LPA"
            />
            <ImageUploadInput
              label="Photo"
              span="full"
              ratio="portrait"
              value={item.image}
              onChange={(image) => oc({ ...item, image })}
              hideUrlField
            />
          </FormGrid>
        )}
      />
    );
  }

  return (
    <>
      <p className="mb-3 text-xs text-gray-500">
        Group placed students under the company that hired them. Add a company,
        then each student with their program and package.
      </p>
      <Repeater<CompanyPlacementValue>
        label="Placements by Company"
        items={record.company_placements}
        onChange={(company_placements) => patch({ company_placements })}
        newItem={() => ({ company: "", logo: "", students: [] })}
        renderItem={(item, _i, oc) => (
          <FormGrid tight>
            <TextInput
              label="Company Name"
              span={5}
              value={item.company}
              onChange={(e) => oc({ ...item, company: e.target.value })}
              placeholder="Tata Consultancy Services"
            />
            <ImageUploadInput
              label="Company Logo"
              span={7}
              ratio="square"
              value={item.logo}
              onChange={(logo) => oc({ ...item, logo })}
              hideUrlField
            />
            <div className="admin-col-full rounded-lg border border-gray-100 bg-gray-50/60 p-3">
              <Repeater<CompanyStudentValue>
                label="Placed Students"
                itemSpan={4}
                items={item.students}
                onChange={(students) => oc({ ...item, students })}
                newItem={() => ({ name: "", program: "", package: "" })}
                renderItem={(stu, _si, onStu) => (
                  <FormGrid tight>
                    <TextInput
                      label="Student Name"
                      span="full"
                      value={stu.name}
                      onChange={(e) => onStu({ ...stu, name: e.target.value })}
                    />
                    <TextInput
                      label="Program"
                      span={7}
                      value={stu.program}
                      onChange={(e) =>
                        onStu({ ...stu, program: e.target.value })
                      }
                      placeholder="B.E. CSE"
                    />
                    <TextInput
                      label="Package"
                      span={5}
                      value={stu.package}
                      onChange={(e) =>
                        onStu({ ...stu, package: e.target.value })
                      }
                      placeholder="6 LPA"
                    />
                  </FormGrid>
                )}
              />
            </div>
          </FormGrid>
        )}
      />
    </>
  );
}

/**
 * The year list: which years exist, which one is current, and the add/delete
 * controls. Creating and deleting a year hits the API straight away — a
 * document has to exist before its blocks can be clicked in the preview.
 */
export function PlacementYearsInspector({
  records,
  selectedId,
  busy,
  onSelect,
  onAdd,
  onDelete,
}: {
  records: AdminPlacementRecord[];
  selectedId: string;
  busy: boolean;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (record: AdminPlacementRecord) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Each year is a record of its own. Pick one to load it into the preview,
        then click any block on the page to edit that year&apos;s figures,
        recruiters or students. Adding and deleting a year takes effect
        immediately; the fields inside it save with the rest of the page.
      </p>

      {records.length === 0 ? (
        <p className="text-sm text-gray-500">No years yet.</p>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div
              key={r._id}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                r._id === selectedId
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200"
              }`}
            >
              <CalendarDays size={16} className="shrink-0 text-gray-400" />
              <button
                type="button"
                onClick={() => onSelect(r._id)}
                className="min-w-0 flex-1 text-left"
              >
                <span className="block text-sm font-semibold text-gray-900">
                  {r.year || "Untitled year"}
                </span>
                <span className="block text-xs text-gray-400">
                  {r.notable_placements.length} students ·{" "}
                  {r.top_recruiters.length} recruiters
                  {r.is_active ? "" : " · hidden"}
                </span>
              </button>
              {r.is_current && (
                <span className="admin-badge admin-badge-blue shrink-0">
                  <Star size={11} /> Current
                </span>
              )}
              <button
                type="button"
                onClick={() => onDelete(r)}
                disabled={busy}
                aria-label={`Delete ${r.year}`}
                className="admin-btn admin-btn-danger admin-btn-sm shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onAdd}
        disabled={busy}
        className="admin-btn admin-btn-outline admin-btn-sm"
      >
        {busy ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Plus size={14} />
        )}
        Add Year
      </button>
    </div>
  );
}

export function placementRecordInspectorTitle(
  record: AdminPlacementRecord | undefined,
  key: PlacementRecordSectionKey,
): string {
  const label = PLACEMENT_RECORD_SECTION_LABELS[key];
  return record?.year ? `${record.year} — ${label}` : label;
}
