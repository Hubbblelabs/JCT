"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import {
  RecruitersSectionForm,
  type RecruitersSectionVal,
} from "@/components/admin/PageContentForms";

// Company logos are no longer stored in a separate registry — they come from
// each college's Placement.top_recruiters records (managed on the Placements
// admin page). This screen edits the "Placement Highlights" section copy
// (heading, description, and stat cards) shown above the carousel. The copy is
// scoped per college (?college=) and per home (?scope=main).
const SCOPE_CONFIG_KEY: Record<string, string> = {
  engineering: "engineeringPlacementHighlights",
  "arts-science": "artsSciencePlacementHighlights",
  polytechnic: "polytechnicPlacementHighlights",
};

const SCOPE_LABEL: Record<string, string> = {
  engineering: "Engineering",
  "arts-science": "Arts & Science",
  polytechnic: "Polytechnic",
  main: "Home",
};

function RecruitersSectionPanel({ configKey }: { configKey: string }) {
  const [value, setValue] = useState<RecruitersSectionVal>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const r = await fetch("/api/admin/site-config");
        const data: { config_key: string; value: unknown }[] = await r.json();
        const found = data.find((d) => d.config_key === configKey);
        if (!cancelled) setValue((found?.value as RecruitersSectionVal) ?? {});
      } catch {
        if (!cancelled)
          setMsg({ kind: "err", text: "Failed to load section content." });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [configKey]);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    setApiError(null);
    try {
      const r = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config_key: configKey, value }),
      });
      if (r.ok) {
        setMsg({ kind: "ok", text: "Section content saved!" });
      } else {
        const parsed = await parseApiError(r);
        setApiError(parsed);
        setMsg({
          kind: "err",
          text: parsed?.message ?? parsed?.error ?? "Save failed.",
        });
      }
    } catch {
      setMsg({ kind: "err", text: "Save failed." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card mb-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-gray-800">
            Placement Highlights Section
          </h2>
          <p className="text-xs text-gray-500">
            Heading, description, and stat cards for the recruiters section on
            the home and institution pages. Company logos are managed per
            college on the Placements page.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving || loading}
          className="admin-btn admin-btn-gold shrink-0"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Check size={15} />
          )}
          {saving ? "Saving…" : "Save Section"}
        </button>
      </div>

      {msg?.kind === "ok" && (
        <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {msg.text}
        </p>
      )}
      {apiError && (
        <ValidationErrors
          error={apiError.message ?? apiError.error}
          details={apiError.details}
        />
      )}
      {msg?.kind === "err" && !apiError && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {msg.text}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <RecruitersSectionForm value={value} onChange={setValue} />
      )}
    </div>
  );
}

function RecruitersPageInner() {
  const searchParams = useSearchParams();
  const college = searchParams.get("college") ?? "";
  // Home (main) uses ?scope=main; each college uses ?college=<id>. Default to
  // main when no college is passed.
  const resolvedScope = college || "main";
  const configKey = SCOPE_CONFIG_KEY[college] ?? "mainPlacementHighlights";
  const label = SCOPE_LABEL[resolvedScope] ?? "Home";

  return (
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Placement Highlights — {label}</h1>
          <p className="admin-page-subtitle">
            Section copy for the placement carousel on the {label} page. Company
            logos come from{" "}
            {college ? "this college" : "every college"}&apos;s placement
            records.
          </p>
        </div>
      </div>
      <RecruitersSectionPanel configKey={configKey} />
    </div>
  );
}

export default function RecruitersPage() {
  return (
    <Suspense fallback={null}>
      <RecruitersPageInner />
    </Suspense>
  );
}
