"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  TextInput,
  TextArea,
  Select,
  NumberInput,
  ImageUploadInput,
  Repeater,
} from "@/components/admin/inputs";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Check,
  Info,
  Award,
  Users,
  Building2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  DeferredUploadsProvider,
  useDeferredUploads,
} from "@/lib/deferred-uploads";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

interface TopRecruiter {
  name: string;
  logo: string;
}
interface NotablePlacement {
  name: string;
  program: string;
  company: string;
  package: string;
  image: string;
}
interface CompanyStudent {
  name: string;
  program: string;
  package: string;
}
interface CompanyPlacement {
  company: string;
  logo: string;
  students: CompanyStudent[];
}
interface PlacementItem {
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
  top_recruiters: TopRecruiter[];
  notable_placements: NotablePlacement[];
  company_placements: CompanyPlacement[];
  is_active: boolean;
  sort_order: number;
}

const EMPTY: Omit<PlacementItem, "_id"> = {
  institution: "engineering",
  year: "",
  is_current: false,
  summary: "",
  highest_package: "",
  average_package: "",
  median_package: "",
  students_placed: 0,
  total_students: 0,
  placement_percentage: 0,
  offers_made: 0,
  companies_visited: 0,
  top_recruiters: [],
  notable_placements: [],
  company_placements: [],
  is_active: true,
  sort_order: 0,
};

const INSTITUTIONS = [
  { value: "engineering", label: "Engineering" },
  { value: "arts-science", label: "Arts & Science" },
  { value: "polytechnic", label: "Polytechnic" },
];

const INSTITUTION_LABELS: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
};

type SectionKey =
  "general" | "packages" | "counts" | "recruiters" | "notable" | "company";

const SECTIONS: { key: SectionKey; label: string; icon: typeof Info }[] = [
  { key: "general", label: "General", icon: Info },
  { key: "packages", label: "Package Stats", icon: Award },
  { key: "counts", label: "Placement Counts", icon: Users },
  { key: "recruiters", label: "Top Recruiters", icon: Building2 },
  { key: "notable", label: "Notable Placements", icon: GraduationCap },
  { key: "company", label: "Company Placements", icon: Briefcase },
];

function PlacementsPageInner() {
  const { flush, discardAll } = useDeferredUploads();
  const toast = useToast();
  const confirm = useConfirm();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<PlacementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PlacementItem | null>(null);
  const [form, setForm] = useState<Omit<PlacementItem, "_id">>(EMPTY);
  const [section, setSection] = useState<SectionKey>("general");
  const [saving, setSaving] = useState(false);
  const [filterInst] = useState(() => searchParams.get("college") ?? "");
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const url = filterInst
      ? `/api/admin/placements?institution=${filterInst}`
      : "/api/admin/placements";
    const r = await fetch(url);
    setItems(await r.json());
    setLoading(false);
  }, [filterInst]);

  useEffect(() => {
    load();
  }, [filterInst, load]);

  const openNew = () => {
    setEditing({ _id: "", ...EMPTY });
    setForm({ ...EMPTY, institution: filterInst || "engineering" });
    setSection("general");
    setApiError(null);
  };
  const openEdit = (e: PlacementItem) => {
    setEditing(e);
    setForm({
      ...EMPTY,
      ...e,
      top_recruiters: e.top_recruiters ?? [],
      notable_placements: e.notable_placements ?? [],
      company_placements: e.company_placements ?? [],
    });
    setSection("general");
    setApiError(null);
  };
  const close = () => {
    discardAll();
    setEditing(null);
    setForm(EMPTY);
    setApiError(null);
  };
  const set = (key: string, val: unknown) =>
    setForm((f) => ({ ...f, [key]: val }));

  const save = async () => {
    setSaving(true);
    setApiError(null);
    try {
      const flushedForm = await flush(form);
      setForm(flushedForm as Omit<PlacementItem, "_id">);
      const isNew = !editing?._id;
      const url = isNew
        ? "/api/admin/placements"
        : `/api/admin/placements/${editing!._id}`;
      const r = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flushedForm),
      });
      if (r.ok) {
        await load();
        close();
        toast.success(isNew ? "Placement record created." : "Record updated.");
      } else {
        setApiError(await parseApiError(r));
      }
    } catch (err) {
      setApiError({
        error: err instanceof Error ? err.message : "Upload failed",
      } as ApiErrorPayload);
    }
    setSaving(false);
  };

  const del = async (id: string) => {
    const ok = await confirm({
      title: "Delete placement record",
      message:
        "This year's placement record will be permanently removed. Continue?",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await fetch(`/api/admin/placements/${id}`, { method: "DELETE" });
    toast.success("Placement record deleted.");
    await load();
  };

  return (
    <>
      <div className="admin-content">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Placements</h1>
            <p className="admin-page-subtitle">
              Year-wise placement records
              {filterInst
                ? ` — ${INSTITUTION_LABELS[filterInst] ?? filterInst}`
                : ""}
              . Shown on /institutions/&lt;college&gt;/placements
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={openNew} className="admin-btn admin-btn-primary">
              <Plus size={16} /> Add Record
            </button>
          </div>
        </div>

        <div className="admin-card overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-gray-400" />
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>College</th>
                  <th>Placement %</th>
                  <th>Highest</th>
                  <th>Current</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-400">
                      No placement records yet.
                    </td>
                  </tr>
                )}
                {items.map((e) => (
                  <tr key={e._id}>
                    <td className="font-medium">{e.year}</td>
                    <td className="text-sm text-gray-500">
                      {INSTITUTION_LABELS[e.institution] ?? e.institution}
                    </td>
                    <td className="text-sm text-gray-500">
                      {e.placement_percentage
                        ? `${e.placement_percentage}%`
                        : "—"}
                    </td>
                    <td className="text-sm text-gray-500">
                      {e.highest_package || "—"}
                    </td>
                    <td>
                      {e.is_current ? (
                        <span className="admin-badge admin-badge-blue">
                          Current
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`admin-badge ${e.is_active ? "admin-badge-green" : "admin-badge-red"}`}
                      >
                        {e.is_active ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(e)}
                          className="admin-btn admin-btn-outline admin-btn-sm"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => del(e._id)}
                          className="admin-btn admin-btn-danger admin-btn-sm"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-10">
          <div className="w-full max-w-4xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-semibold text-gray-900">
                {editing._id ? "Edit Placement Record" : "New Placement Record"}
              </h2>
              <button
                onClick={close}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row">
              {/* Sidebar menu */}
              <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-gray-100 p-3 md:w-56 md:flex-col md:border-r md:border-b-0">
                {SECTIONS.map((s) => {
                  const Icon = s.icon;
                  const active = section === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSection(s.key)}
                      className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        active
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={15} />
                      {s.label}
                    </button>
                  );
                })}
              </nav>

              {/* Section content */}
              <div className="min-w-0 flex-1 p-6">
                {apiError && (
                  <ValidationErrors
                    error={apiError.message ?? apiError.error}
                    details={apiError.details}
                  />
                )}

                {section === "general" && (
                  <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-4">
                      <Select
                        label="College"
                        value={form.institution}
                        options={INSTITUTIONS}
                        onChange={(e) => set("institution", e.target.value)}
                        disabled={!!filterInst}
                      />
                      <TextInput
                        label="Academic Year"
                        value={form.year}
                        onChange={(e) => set("year", e.target.value)}
                        placeholder="2024-2025"
                        required
                      />
                      <NumberInput
                        label="Sort order"
                        value={form.sort_order}
                        onChange={(e) =>
                          set("sort_order", Number(e.target.value))
                        }
                        min={0}
                      />
                    </div>
                    <TextArea
                      label="Summary"
                      value={form.summary}
                      onChange={(e) => set("summary", e.target.value)}
                      rows={3}
                      hint="Short intro shown at the top of this year's section."
                    />
                    <div className="flex flex-wrap gap-6 pt-1">
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={form.is_current}
                          onChange={(e) => set("is_current", e.target.checked)}
                        />
                        Current year (highlighted at top)
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                          type="checkbox"
                          checked={form.is_active}
                          onChange={(e) => set("is_active", e.target.checked)}
                        />
                        Active (shown on website)
                      </label>
                    </div>
                  </div>
                )}

                {section === "packages" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <TextInput
                      label="Highest Package"
                      value={form.highest_package}
                      onChange={(e) => set("highest_package", e.target.value)}
                      placeholder="45 LPA"
                    />
                    <TextInput
                      label="Average Package"
                      value={form.average_package}
                      onChange={(e) => set("average_package", e.target.value)}
                      placeholder="8.5 LPA"
                    />
                    <TextInput
                      label="Median Package"
                      value={form.median_package}
                      onChange={(e) => set("median_package", e.target.value)}
                      placeholder="6 LPA"
                    />
                  </div>
                )}

                {section === "counts" && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    <NumberInput
                      label="Students Placed"
                      value={form.students_placed}
                      onChange={(e) =>
                        set("students_placed", Number(e.target.value))
                      }
                      min={0}
                    />
                    <NumberInput
                      label="Total Eligible"
                      value={form.total_students}
                      onChange={(e) =>
                        set("total_students", Number(e.target.value))
                      }
                      min={0}
                    />
                    <NumberInput
                      label="Placement %"
                      value={form.placement_percentage}
                      onChange={(e) =>
                        set("placement_percentage", Number(e.target.value))
                      }
                      min={0}
                    />
                    <NumberInput
                      label="Offers Made"
                      value={form.offers_made}
                      onChange={(e) =>
                        set("offers_made", Number(e.target.value))
                      }
                      min={0}
                    />
                    <NumberInput
                      label="Companies Visited"
                      value={form.companies_visited}
                      onChange={(e) =>
                        set("companies_visited", Number(e.target.value))
                      }
                      min={0}
                    />
                  </div>
                )}

                {section === "recruiters" && (
                  <div>
                    <p className="mb-3 text-xs text-gray-500">
                      Add each company&apos;s name and logo. These recruiters
                      are specific to this college and power both this placement
                      page and the recruiter carousel for{" "}
                      <span className="font-medium">
                        {INSTITUTION_LABELS[form.institution] ?? "this college"}
                      </span>
                      .
                    </p>
                    <Repeater<TopRecruiter>
                      label="Top Recruiters"
                      items={form.top_recruiters}
                      onChange={(v) => set("top_recruiters", v)}
                      onItemRemove={(item) => {
                        if (item.logo.startsWith("pending:")) discardAll();
                      }}
                      newItem={() => ({ name: "", logo: "" })}
                      renderItem={(item, _i, onItemChange) => (
                        <div className="grid grid-cols-1 gap-3 pr-8 sm:grid-cols-2">
                          <TextInput
                            label="Company Name"
                            value={item.name}
                            onChange={(e) =>
                              onItemChange({ ...item, name: e.target.value })
                            }
                          />
                          <ImageUploadInput
                            label="Logo"
                            ratio="square"
                            value={item.logo}
                            onChange={(url) =>
                              onItemChange({ ...item, logo: url })
                            }
                            hideUrlField
                          />
                        </div>
                      )}
                    />
                  </div>
                )}

                {section === "notable" && (
                  <Repeater<NotablePlacement>
                    label="Notable Placements"
                    items={form.notable_placements}
                    onChange={(v) => set("notable_placements", v)}
                    onItemRemove={(item) => {
                      if (item.image.startsWith("pending:")) discardAll();
                    }}
                    newItem={() => ({
                      name: "",
                      program: "",
                      company: "",
                      package: "",
                      image: "",
                    })}
                    renderItem={(item, _i, onItemChange) => (
                      <div className="grid grid-cols-1 gap-3 pr-8 sm:grid-cols-2">
                        <TextInput
                          label="Student Name"
                          value={item.name}
                          onChange={(e) =>
                            onItemChange({ ...item, name: e.target.value })
                          }
                        />
                        <TextInput
                          label="Program"
                          value={item.program}
                          onChange={(e) =>
                            onItemChange({ ...item, program: e.target.value })
                          }
                          placeholder="B.E. CSE"
                        />
                        <TextInput
                          label="Company"
                          value={item.company}
                          onChange={(e) =>
                            onItemChange({ ...item, company: e.target.value })
                          }
                        />
                        <TextInput
                          label="Package"
                          value={item.package}
                          onChange={(e) =>
                            onItemChange({ ...item, package: e.target.value })
                          }
                          placeholder="12 LPA"
                        />
                        <div className="sm:col-span-2">
                          <ImageUploadInput
                            label="Photo"
                            value={item.image}
                            onChange={(url) =>
                              onItemChange({ ...item, image: url })
                            }
                            hideUrlField
                          />
                        </div>
                      </div>
                    )}
                  />
                )}

                {section === "company" && (
                  <div>
                    <p className="mb-3 text-xs text-gray-500">
                      Group placed students under the company that hired them.
                      Add a company, then add each student with their program
                      and package. Shown as a company-wise breakdown on the
                      public placements page.
                    </p>
                    <Repeater<CompanyPlacement>
                      label="Company Placements"
                      items={form.company_placements}
                      onChange={(v) => set("company_placements", v)}
                      onItemRemove={(item) => {
                        if (item.logo.startsWith("pending:")) discardAll();
                      }}
                      newItem={() => ({ company: "", logo: "", students: [] })}
                      renderItem={(item, _i, onItemChange) => (
                        <div className="space-y-3 pr-8">
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <TextInput
                              label="Company Name"
                              value={item.company}
                              onChange={(e) =>
                                onItemChange({
                                  ...item,
                                  company: e.target.value,
                                })
                              }
                              placeholder="Tata Consultancy Services"
                            />
                            <ImageUploadInput
                              label="Company Logo"
                              ratio="square"
                              value={item.logo}
                              onChange={(url) =>
                                onItemChange({ ...item, logo: url })
                              }
                              hideUrlField
                            />
                          </div>
                          <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3">
                            <Repeater<CompanyStudent>
                              label="Placed Students"
                              items={item.students}
                              onChange={(students) =>
                                onItemChange({ ...item, students })
                              }
                              newItem={() => ({
                                name: "",
                                program: "",
                                package: "",
                              })}
                              renderItem={(stu, _si, onStuChange) => (
                                <div className="grid grid-cols-1 gap-3 pr-8 sm:grid-cols-3">
                                  <TextInput
                                    label="Student Name"
                                    value={stu.name}
                                    onChange={(e) =>
                                      onStuChange({
                                        ...stu,
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                  <TextInput
                                    label="Program"
                                    value={stu.program}
                                    onChange={(e) =>
                                      onStuChange({
                                        ...stu,
                                        program: e.target.value,
                                      })
                                    }
                                    placeholder="B.E. CSE"
                                  />
                                  <TextInput
                                    label="Package"
                                    value={stu.package}
                                    onChange={(e) =>
                                      onStuChange({
                                        ...stu,
                                        package: e.target.value,
                                      })
                                    }
                                    placeholder="6 LPA"
                                  />
                                </div>
                              )}
                            />
                          </div>
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
              <button onClick={close} className="admin-btn admin-btn-outline">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="admin-btn admin-btn-gold"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Check size={15} />
                )}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function PlacementsAdminPage() {
  return (
    <DeferredUploadsProvider>
      <Suspense fallback={null}>
        <PlacementsPageInner />
      </Suspense>
    </DeferredUploadsProvider>
  );
}
