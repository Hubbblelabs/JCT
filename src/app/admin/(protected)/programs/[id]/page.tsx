"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  TextInput,
  NumberInput,
  TextArea,
  StringList,
  TextAreaList,
  Accordion,
  ImageUploadInput,
} from "@/components/admin/inputs";
import { Save, Trash2, ArrowLeft, Loader2, Check, Plus } from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";

// ── Generic items editor ────────────────────────────────────────────────────

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "number";
  span2?: boolean;
  placeholder?: string;
};

function ItemsEditor({
  items,
  onChange,
  fields,
  emptyItem,
  addLabel = "Add item",
}: {
  items: Record<string, unknown>[];
  onChange: (v: Record<string, unknown>[]) => void;
  fields: FieldDef[];
  emptyItem: Record<string, unknown>;
  addLabel?: string;
}) {
  const upd = (i: number, key: string, val: unknown) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const rem = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
          <div className="grid grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key} className={f.span2 ? "col-span-2" : ""}>
                <label className="admin-label">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    className="admin-textarea"
                    rows={2}
                    value={String(item[f.key] ?? "")}
                    onChange={(e) => upd(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    className="admin-input"
                    value={String(item[f.key] ?? "")}
                    onChange={(e) =>
                      upd(i, f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                    }
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => rem(i)}
            className="admin-btn admin-btn-danger admin-btn-sm mt-2"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { ...emptyItem }])}
        className="admin-btn admin-btn-outline admin-btn-sm w-full justify-center mt-1"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}

// ── Typed Labs editor ───────────────────────────────────────────────────────

type LabItem = { name: string; description: string; equipment: string[] };

function LabsEditor({ labs, onChange }: { labs: LabItem[]; onChange: (v: LabItem[]) => void }) {
  const upd = (i: number, key: string, val: unknown) =>
    onChange(labs.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)));
  const rem = (i: number) => onChange(labs.filter((_, idx) => idx !== i));
  const add = () => onChange([...labs, { name: "", description: "", equipment: [] }]);

  return (
    <div className="space-y-3">
      {labs.map((lab, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <TextInput label="Lab Name" value={lab.name} onChange={(e) => upd(i, "name", e.target.value)} />
            <TextArea label="Description" value={lab.description} onChange={(e) => upd(i, "description", e.target.value)} rows={2} />
          </div>
          <StringList
            label="Equipment"
            values={lab.equipment ?? []}
            onChange={(v) => upd(i, "equipment", v)}
            placeholder="Equipment / software…"
          />
          <button type="button" onClick={() => rem(i)} className="admin-btn admin-btn-danger admin-btn-sm">
            <Trash2 size={12} /> Remove Lab
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="admin-btn admin-btn-outline admin-btn-sm w-full justify-center mt-1">
        <Plus size={13} /> Add Lab
      </button>
    </div>
  );
}

// ── Curriculum editor ───────────────────────────────────────────────────────

type Subject = { code: string; name: string };
type CurriculumSemester = { semester: number; subjects: Subject[] };

function CurriculumEditor({
  semesters,
  onChange,
}: {
  semesters: CurriculumSemester[];
  onChange: (v: CurriculumSemester[]) => void;
}) {
  const addSem = () =>
    onChange([...semesters, { semester: semesters.length + 1, subjects: [] }]);
  const remSem = (i: number) =>
    onChange(semesters.filter((_, idx) => idx !== i));
  const updSem = (i: number, patch: Partial<CurriculumSemester>) =>
    onChange(semesters.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-3">
      {semesters.map((sem, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Semester {sem.semester}</span>
            <button type="button" onClick={() => remSem(i)} className="admin-btn admin-btn-danger admin-btn-sm">
              <Trash2 size={12} /> Remove
            </button>
          </div>
          {(sem.subjects ?? []).length > 0 && (
            <div className="mb-2 grid gap-1" style={{ gridTemplateColumns: "110px 1fr 32px" }}>
              <span className="text-xs font-semibold text-gray-400 px-1">Code</span>
              <span className="text-xs font-semibold text-gray-400 px-1">Subject Name</span>
              <span />
            </div>
          )}
          <div className="space-y-1 mb-2">
            {(sem.subjects ?? []).map((sub, j) => (
              <div key={j} className="grid gap-2 items-center" style={{ gridTemplateColumns: "110px 1fr 32px" }}>
                <input
                  className="admin-input text-sm"
                  value={sub.code}
                  placeholder="CS101"
                  onChange={(e) => {
                    const subs = sem.subjects.map((s, idx) =>
                      idx === j ? { ...s, code: e.target.value } : s
                    );
                    updSem(i, { subjects: subs });
                  }}
                />
                <input
                  className="admin-input text-sm"
                  value={sub.name}
                  placeholder="Subject name"
                  onChange={(e) => {
                    const subs = sem.subjects.map((s, idx) =>
                      idx === j ? { ...s, name: e.target.value } : s
                    );
                    updSem(i, { subjects: subs });
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    updSem(i, { subjects: sem.subjects.filter((_, idx) => idx !== j) })
                  }
                  className="admin-btn admin-btn-danger admin-btn-sm px-1.5"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => updSem(i, { subjects: [...sem.subjects, { code: "", name: "" }] })}
            className="admin-btn admin-btn-outline admin-btn-sm"
          >
            <Plus size={12} /> Add Subject
          </button>
        </div>
      ))}
      <button type="button" onClick={addSem} className="admin-btn admin-btn-outline admin-btn-sm w-full justify-center">
        <Plus size={13} /> Add Semester
      </button>
    </div>
  );
}

// ── Constants ───────────────────────────────────────────────────────────────

interface ProgramFields {
  name: string; abbr: string; slug: string; institution: string;
  degree: string; duration: string; seats: number; image: string;
  highlight: string; description: string; outcomes: string[];
  is_active: boolean; sort_order: number;
}

const EMPTY_PROG: ProgramFields = {
  name: "", abbr: "", slug: "", institution: "engineering",
  degree: "", duration: "", seats: 60, image: "", highlight: "",
  description: "", outcomes: [], is_active: true, sort_order: 0,
};

const E_BOARD   = { name: "", designation: "", organization: "", role: "" };
const E_FACULTY = { name: "", designation: "", qualification: "", experience: "", specialization: "" };
const E_EVENT   = { title: "", date: "", type: "", description: "" };
const E_ACHIEV  = { name: "", title: "", detail: "", year: "" };
const E_VAC     = { name: "", hours: "", provider: "", description: "" };
const E_PO      = { code: "", title: "", description: "" };
const E_SP_HL   = { title: "", year: "", description: "" };

// ── Main component ──────────────────────────────────────────────────────────

function ProgramDetailInner() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = id === "new";
  const urlCollege = searchParams.get("college") ?? "engineering";

  const [prog, setProg] = useState<ProgramFields>({
    ...EMPTY_PROG,
    institution: isNew ? urlCollege : "engineering",
  });
  const [dept, setDept] = useState<Record<string, unknown>>({});
  const [deptId, setDeptId] = useState<string | null>(null);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isNew) return;
    (async () => {
      const pRes = await fetch(`/api/admin/programs/${id}`);
      const pData = await pRes.json();

      const { _id, ...pRest } = pData as Record<string, unknown>;
      setProg(pRest as unknown as ProgramFields);

      const dRes = await fetch(`/api/admin/departments?slug=${pData.slug}`);
      const dData = await dRes.json();
      if (Array.isArray(dData) && dData.length > 0) {
        const d = dData[0] as Record<string, unknown>;
        setDeptId(String(d._id));
        const content = (d.content as Record<string, unknown>) ?? {};
        setDept(content);
      }
      setLoading(false);
    })();
  }, [id, isNew]);

  // ── Nested dept helpers ───────────────────────────────────────────────────
  const setAbout  = (k: string, v: unknown) => setDept(c => ({ ...c, about:              { ...(c.about              as object ?? {}), [k]: v } }));
  const setHod    = (k: string, v: unknown) => setDept(c => ({ ...c, hod:                { ...(c.hod                as object ?? {}), [k]: v } }));
  const setVM     = (k: string, v: unknown) => setDept(c => ({ ...c, visionMission:      { ...(c.visionMission      as object ?? {}), [k]: v } }));
  const setCareer = (k: string, v: unknown) => setDept(c => ({ ...c, careerProgression:  { ...(c.careerProgression  as object ?? {}), [k]: v } }));
  const setFb     = (k: string, v: unknown) => setDept(c => ({ ...c, feedback:           { ...(c.feedback           as object ?? {}), [k]: v } }));
  const setLib    = (k: string, v: unknown) => setDept(c => ({ ...c, library:            { ...(c.library            as object ?? {}), [k]: v } }));
  const setMag    = (k: string, v: unknown) => setDept(c => ({ ...c, magazine:           { ...(c.magazine           as object ?? {}), [k]: v } }));
  const setTL     = (k: string, v: unknown) => setDept(c => ({ ...c, teachingLearning:   { ...(c.teachingLearning   as object ?? {}), [k]: v } }));
  const setSP     = (k: string, v: unknown) => setDept(c => ({ ...c, studentParticipation: { ...(c.studentParticipation as object ?? {}), [k]: v } }));
  const setArr    = (k: string, v: unknown) => setDept(c => ({ ...c, [k]: v }));

  // Typed accessors
  const about  = (dept.about  as Record<string, unknown>) ?? {};
  const hod    = (dept.hod    as Record<string, unknown>) ?? {};
  const vm     = (dept.visionMission as Record<string, unknown>) ?? {};
  const career = (dept.careerProgression as Record<string, unknown>) ?? {};
  const fb     = (dept.feedback as Record<string, unknown>) ?? {};
  const lib    = (dept.library as Record<string, unknown>) ?? {};
  const mag    = (dept.magazine as Record<string, unknown>) ?? {};
  const tl     = (dept.teachingLearning as Record<string, unknown>) ?? {};
  const sp     = (dept.studentParticipation as Record<string, unknown>) ?? {};
  const arr    = (k: string) => ((dept[k] as Record<string, unknown>[]) ?? []);
  const curriculum = (dept.curriculum as CurriculumSemester[]) ?? [];

  // ── Save ──────────────────────────────────────────────────────────────────
  const save = async () => {
    setSaving(true);
    setMsg(null);
    setApiError(null);

    try {
      let programSlug = prog.slug;

      if (isNew) {
        const r = await fetch("/api/admin/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(prog),
        });
        if (!r.ok) {
          const err = await parseApiError(r);
          setApiError(err);
          setMsg({ text: err?.message ?? err?.error ?? "Error creating program", ok: false });
          return;
        }
        const data = await r.json();
        programSlug = data.slug as string;
        const dRes = await fetch("/api/admin/departments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: programSlug, college: prog.institution, content: dept }),
        });
        if (!dRes.ok) {
          const err = await parseApiError(dRes);
          setApiError(err);
          setMsg({ text: err?.message ?? err?.error ?? "Program saved but department content failed", ok: false });
          return;
        }
        router.replace(`/admin/programs/${data._id}?college=${prog.institution}`);
        return;
      }

      const pRes = await fetch(`/api/admin/programs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prog),
      });
      if (!pRes.ok) {
        const err = await parseApiError(pRes);
        setApiError(err);
        setMsg({ text: err?.message ?? err?.error ?? "Error saving program", ok: false });
        return;
      }

      if (deptId) {
        const dRes = await fetch(`/api/admin/departments/${deptId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: dept }),
        });
        if (!dRes.ok) {
          const err = await parseApiError(dRes);
          setApiError(err);
          setMsg({ text: err?.message ?? err?.error ?? "Error saving department", ok: false });
          return;
        }
      } else {
        const r = await fetch("/api/admin/departments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: programSlug, college: prog.institution, content: dept }),
        });
        if (r.ok) {
          const d = await r.json();
          setDeptId(String((d as Record<string, unknown>)._id));
        } else {
          const err = await parseApiError(r);
          setApiError(err);
          setMsg({ text: err?.message ?? err?.error ?? "Error creating department", ok: false });
          return;
        }
      }

      setMsg({ text: "Saved successfully", ok: true });
    } finally {
      setSaving(false);
    }
  };

  const deactivate = async () => {
    if (!confirm("Deactivate this program?")) return;
    await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
    router.push(`/admin/programs?college=${prog.institution}`);
  };

  const setP = (k: keyof ProgramFields, v: unknown) => setProg(f => ({ ...f, [k]: v }));
  const backHref = `/admin/programs?college=${isNew ? urlCollege : prog.institution}`;

  if (loading) {
    return (
      <div className="admin-content flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="admin-content">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="admin-page-header">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(backHref)} className="admin-btn admin-btn-outline admin-btn-sm">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="admin-page-title">{isNew ? "New Program" : prog.name || id}</h1>
            {!isNew && <p className="admin-page-subtitle">{prog.institution} · {prog.degree}</p>}
          </div>
          {!isNew && (
            <span className={`admin-badge ${prog.is_active ? "admin-badge-green" : "admin-badge-red"}`}>
              {prog.is_active ? "Active" : "Inactive"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {msg && <span className={`text-sm font-medium ${msg.ok ? "text-green-600" : "text-red-500"}`}>{msg.text}</span>}
          {!isNew && prog.is_active && (
            <button onClick={deactivate} className="admin-btn admin-btn-danger admin-btn-sm">
              <Trash2 size={14} /> Deactivate
            </button>
          )}
          <button onClick={save} disabled={saving} className="admin-btn admin-btn-gold">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {saving ? "Saving…" : isNew ? "Create Program" : "Save All"}
          </button>
        </div>
      </div>

      {apiError && (
        <ValidationErrors
          error={apiError.message ?? apiError.error}
          details={apiError.details}
        />
      )}

      {/* ── 1. Basic Info ─────────────────────────────────────────────── */}
      <Accordion title="Basic Info" defaultOpen>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Program Name" value={prog.name} onChange={e => setP("name", e.target.value)} required />
          <TextInput label="Abbreviation" value={prog.abbr} onChange={e => setP("abbr", e.target.value)} placeholder="CSE" required />
          <TextInput label="Slug" value={prog.slug} onChange={e => setP("slug", e.target.value)} placeholder="cse" required />
          <TextInput label="Degree" value={prog.degree} onChange={e => setP("degree", e.target.value)} placeholder="B.E." />
          <TextInput label="Duration" value={prog.duration} onChange={e => setP("duration", e.target.value)} placeholder="4 Years" />
          <TextInput label="Highlight" value={prog.highlight} onChange={e => setP("highlight", e.target.value)} hint="Short tagline on the program card" />
        </div>
        <ImageUploadInput label="Program Image" value={prog.image} onChange={url => setP("image", url)} uploadOnly />
      </Accordion>

      {/* ── 2. Accreditation & About ─────────────────────────────────── */}
      <Accordion title="Accreditation & About">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Accreditation"
            value={String(about.accreditation ?? "")}
            onChange={e => setAbout("accreditation", e.target.value)}
            placeholder="AICTE / NAAC / NBA / ISO 9001:2015"
            hint="Certifications held by the department"
          />
          <TextInput label="Established" value={String(about.established ?? "")} onChange={e => setAbout("established", e.target.value)} placeholder="2009" />
          <NumberInput label="Intake" value={Number(about.intake ?? 0)} onChange={e => setAbout("intake", parseInt(e.target.value))} />
          <TextInput label="Affiliation" value={String(about.affiliation ?? "")} onChange={e => setAbout("affiliation", e.target.value)} placeholder="Affiliated to Anna University" />
        </div>
        <TextAreaList label="About Paragraphs" values={(about.paragraphs as string[]) ?? []} onChange={v => setAbout("paragraphs", v)} placeholder="Paragraph of text about the department…" rows={4} />
      </Accordion>

      {/* ── 3. HOD's Desk ────────────────────────────────────────────── */}
      <Accordion title="HOD's Desk">
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="HOD Name" value={String(hod.name ?? "")} onChange={e => setHod("name", e.target.value)} />
          <TextInput label="Designation" value={String(hod.designation ?? "")} onChange={e => setHod("designation", e.target.value)} />
        </div>
        <TextAreaList label="Message (one paragraph per entry)" values={(hod.message as string[]) ?? []} onChange={v => setHod("message", v)} placeholder="Message paragraph…" rows={3} />
      </Accordion>

      {/* ── 4. Vision & Mission ──────────────────────────────────────── */}
      <Accordion title="Vision & Mission">
        <TextArea label="Vision" value={String(vm.vision ?? "")} onChange={e => setVM("vision", e.target.value)} rows={2} />
        <StringList label="Mission (one statement per entry)" values={(vm.mission as string[]) ?? []} onChange={v => setVM("mission", v)} placeholder="Mission statement…" />
      </Accordion>

      {/* ── 5. Program Outcomes ──────────────────────────────────────── */}
      <Accordion title="Program Outcomes">
        <ItemsEditor
          items={arr("programOutcomes")}
          onChange={v => setArr("programOutcomes", v)}
          fields={[
            { key: "code",        label: "Code",        placeholder: "PO1" },
            { key: "title",       label: "Title",       placeholder: "Engineering Knowledge" },
            { key: "description", label: "Description", type: "textarea", span2: true, placeholder: "Apply knowledge of mathematics…" },
          ]}
          emptyItem={E_PO}
          addLabel="Add Outcome"
        />
      </Accordion>

      {/* ── 6. Curriculum & Syllabus ─────────────────────────────────── */}
      <Accordion title="Curriculum & Syllabus">
        <Accordion title="Teaching & Learning Process">
          <TextArea label="Overview" value={String(tl.overview ?? "")} onChange={e => setTL("overview", e.target.value)} rows={2} />
          <div className="grid grid-cols-3 gap-4 mt-3">
            <StringList label="Methods" values={(tl.methods as string[]) ?? []} onChange={v => setTL("methods", v)} placeholder="Blended learning…" />
            <StringList label="Tools" values={(tl.tools as string[]) ?? []} onChange={v => setTL("tools", v)} placeholder="LMS / Moodle…" />
            <StringList label="Practices" values={(tl.practices as string[]) ?? []} onChange={v => setTL("practices", v)} placeholder="Flipped classroom…" />
          </div>
        </Accordion>

        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Value Added Courses</p>
          <ItemsEditor
            items={arr("valueAddedCourses")}
            onChange={v => setArr("valueAddedCourses", v)}
            fields={[
              { key: "name",        label: "Course Name" },
              { key: "hours",       label: "Hours",    placeholder: "30 hrs" },
              { key: "provider",    label: "Provider" },
              { key: "description", label: "Description", type: "textarea", span2: true },
            ]}
            emptyItem={E_VAC}
            addLabel="Add Course"
          />
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Semester-wise Subjects</p>
          <CurriculumEditor
            semesters={curriculum}
            onChange={v => setArr("curriculum", v)}
          />
        </div>
      </Accordion>

      {/* ── 7. Faculty & Council ─────────────────────────────────────── */}
      <Accordion title="Faculty & Council">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Core Faculty</p>
            <ItemsEditor
              items={arr("faculty")}
              onChange={v => setArr("faculty", v)}
              fields={[
                { key: "name",           label: "Name" },
                { key: "designation",    label: "Designation" },
                { key: "qualification",  label: "Qualification" },
                { key: "experience",     label: "Experience", placeholder: "10 years" },
                { key: "specialization", label: "Specialization" },
              ]}
              emptyItem={E_FACULTY}
              addLabel="Add Faculty Member"
            />
          </div>

          {(["advisoryBoard", "pac", "bos"] as const).map(boardKey => (
            <div key={boardKey}>
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {boardKey === "advisoryBoard" ? "Advisory Board"
                  : boardKey === "pac" ? "PAC (Program Advisory Committee)"
                  : "BoS (Board of Studies)"}
              </p>
              <ItemsEditor
                items={arr(boardKey)}
                onChange={v => setArr(boardKey, v)}
                fields={[
                  { key: "name",         label: "Name" },
                  { key: "designation",  label: "Designation" },
                  { key: "organization", label: "Organization" },
                  { key: "role",         label: "Role" },
                ]}
                emptyItem={E_BOARD}
                addLabel="Add Member"
              />
            </div>
          ))}
        </div>
      </Accordion>

      {/* ── 8. Facilities ────────────────────────────────────────────── */}
      <Accordion title="Facilities">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Laboratories</p>
            <LabsEditor
              labs={(dept.labs as LabItem[]) ?? []}
              onChange={v => setArr("labs", v)}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Library</p>
            <div className="grid grid-cols-3 gap-4">
              <NumberInput label="Books"    value={Number(lib.books ?? 0)}    onChange={e => setLib("books",    parseInt(e.target.value))} />
              <NumberInput label="Journals" value={Number(lib.journals ?? 0)} onChange={e => setLib("journals", parseInt(e.target.value))} />
              <NumberInput label="Magazines" value={Number(lib.magazines ?? 0)} onChange={e => setLib("magazines", parseInt(e.target.value))} />
            </div>
            <TextArea label="Description" value={String(lib.description ?? "")} onChange={e => setLib("description", e.target.value)} rows={2} />
            <StringList label="Digital Access" values={(lib.digitalAccess as string[]) ?? []} onChange={v => setLib("digitalAccess", v)} placeholder="NPTEL, IEEE Xplore…" />
          </div>
        </div>
      </Accordion>

      {/* ── 9. Life & Achievements ───────────────────────────────────── */}
      <Accordion title="Life & Achievements">
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Events</p>
            <ItemsEditor
              items={arr("events")}
              onChange={v => setArr("events", v)}
              fields={[
                { key: "title",       label: "Title" },
                { key: "date",        label: "Date",  placeholder: "2024-03-15" },
                { key: "type",        label: "Type",  placeholder: "Workshop / Seminar…" },
                { key: "description", label: "Description", type: "textarea", span2: true },
              ]}
              emptyItem={E_EVENT}
              addLabel="Add Event"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Student Achievements</p>
            <ItemsEditor
              items={arr("studentAchievements")}
              onChange={v => setArr("studentAchievements", v)}
              fields={[
                { key: "name",   label: "Name" },
                { key: "title",  label: "Achievement" },
                { key: "year",   label: "Year",    placeholder: "2024" },
                { key: "detail", label: "Details", type: "textarea", span2: true },
              ]}
              emptyItem={E_ACHIEV}
              addLabel="Add Achievement"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Faculty Achievements</p>
            <ItemsEditor
              items={arr("facultyAchievements")}
              onChange={v => setArr("facultyAchievements", v)}
              fields={[
                { key: "name",   label: "Name" },
                { key: "title",  label: "Achievement" },
                { key: "year",   label: "Year",    placeholder: "2024" },
                { key: "detail", label: "Details", type: "textarea", span2: true },
              ]}
              emptyItem={E_ACHIEV}
              addLabel="Add Achievement"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Department Magazine</p>
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Magazine Name"  value={String(mag.name ?? "")}        onChange={e => setMag("name", e.target.value)} />
              <TextInput label="Frequency"      value={String(mag.frequency ?? "")}   onChange={e => setMag("frequency", e.target.value)} placeholder="Bi-annual" />
              <TextInput label="Latest Issue"   value={String(mag.latestIssue ?? "")} onChange={e => setMag("latestIssue", e.target.value)} placeholder="Volume 12, 2024" />
            </div>
            <TextArea label="Description" value={String(mag.description ?? "")} onChange={e => setMag("description", e.target.value)} rows={2} />
            <StringList label="Highlights" values={(mag.highlights as string[]) ?? []} onChange={v => setMag("highlights", v)} placeholder="Featured article…" />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Student Clubs & Associations</p>
            <StringList label="Clubs" values={(sp.clubs as string[]) ?? []} onChange={v => setSP("clubs", v)} placeholder="IEEE Student Chapter…" />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Student Participation Highlights</p>
            <ItemsEditor
              items={(sp.highlights as Record<string, unknown>[]) ?? []}
              onChange={v => setSP("highlights", v)}
              fields={[
                { key: "title",       label: "Event / Activity" },
                { key: "year",        label: "Year", placeholder: "2024" },
                { key: "description", label: "Description", type: "textarea", span2: true },
              ]}
              emptyItem={E_SP_HL}
              addLabel="Add Highlight"
            />
          </div>
        </div>
      </Accordion>

      {/* ── 10. Career & Feedback ────────────────────────────────────── */}
      <Accordion title="Career & Feedback">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <TextInput label="Placement Rate"    value={String(career.placementRate ?? "")}   onChange={e => setCareer("placementRate",    e.target.value)} placeholder="98%" />
          <TextInput label="Average Package"   value={String(career.averagePackage ?? "")}  onChange={e => setCareer("averagePackage",   e.target.value)} placeholder="9 LPA" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <StringList label="Top Recruiters"  values={(career.topRecruiters as string[]) ?? []}  onChange={v => setCareer("topRecruiters",  v)} placeholder="TCS, Infosys…" />
          <StringList label="Higher Studies"  values={(career.higherStudies as string[]) ?? []}  onChange={v => setCareer("higherStudies",  v)} placeholder="M.Tech at IIT…" />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <StringList label="Curriculum Feedback Process"  values={(fb.curriculumProcess as string[]) ?? []}  onChange={v => setFb("curriculumProcess",  v)} placeholder="Step…" />
          <StringList label="Facility Feedback Process"    values={(fb.facilityProcess   as string[]) ?? []}  onChange={v => setFb("facilityProcess",    v)} placeholder="Step…" />
          <StringList label="Recent Improvements"          values={(fb.recentImprovements as string[]) ?? []} onChange={v => setFb("recentImprovements", v)} placeholder="Improvement…" />
        </div>
      </Accordion>

      {/* ── Footer save ──────────────────────────────────────────────── */}
      <div className="flex justify-end gap-2 pt-4 pb-8">
        <button onClick={() => router.push(backHref)} className="admin-btn admin-btn-outline">
          Cancel
        </button>
        <button onClick={save} disabled={saving} className="admin-btn admin-btn-gold">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? "Saving…" : isNew ? "Create Program" : "Save All"}
        </button>
      </div>
    </div>
  );
}

export default function ProgramDetailPage() {
  return (
    <Suspense fallback={null}>
      <ProgramDetailInner />
    </Suspense>
  );
}
