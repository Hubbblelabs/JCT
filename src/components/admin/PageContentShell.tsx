"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Save, Loader2, ExternalLink } from "lucide-react";
import { ValidationErrors } from "@/components/admin/ValidationErrors";
import { parseApiError, type ApiErrorPayload } from "@/lib/validation-helpers";
import { useSearchParams } from "next/navigation";

export type SectionDef = {
  /** Unique id for sidebar nav */
  id: string;
  /** Display label */
  label: string;
  /** The SiteConfig key this section edits. Optional when `kind: 'link'` or `kind: 'custom'`. */
  configKey?: string;
  /** "form" renders the editor; "link" renders an external admin link; "custom" renders self-managed content */
  kind: "form" | "link" | "custom";
  /** When kind === 'link', the href to navigate to */
  href?: string;
  /** Render the editor for this section. Receives the current value + an updater. */
  render?: (
    value: unknown,
    onChange: (next: unknown) => void,
  ) => ReactNode;
  /** When kind === 'custom', renders self-contained content with its own save logic */
  customRender?: () => ReactNode;
  /** Default value when no SiteConfig exists yet */
  defaultValue?: unknown;
};

type Props = {
  pageTitle: string;
  pageSubtitle: string;
  sections: SectionDef[];
};

export function PageContentShell({ pageTitle, pageSubtitle, sections }: Props) {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section");
  const resolveInitial = () => {
    if (sectionParam && sections.some((s) => s.id === sectionParam)) return sectionParam;
    return sections[0]?.id ?? "";
  };
  const [selected, setSelected] = useState<string>(resolveInitial);

  useEffect(() => {
    const valid = sectionParam && sections.some((s) => s.id === sectionParam)
      ? sectionParam
      : null;
    if (valid && valid !== selected) setSelected(valid);
    // Only re-run when the URL section param changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionParam]);

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  const [apiError, setApiError] = useState<ApiErrorPayload | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/site-config");
      const data: { config_key: string; value: unknown }[] = await r.json();
      const next: Record<string, unknown> = {};
      for (const s of sections) {
        if (s.kind !== "form" || !s.configKey) continue;
        const found = data.find((d) => d.config_key === s.configKey);
        next[s.configKey] =
          found?.value ?? s.defaultValue ?? defaultValueFor(s);
      }
      setValues(next);
    } catch {
      setMsg({ kind: "err", text: "Failed to load configuration." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // Sections list is intentionally stable across mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const section = sections.find((s) => s.id === selected);

  const save = async () => {
    if (!section || section.kind !== "form" || !section.configKey) return;
    setSaving(true);
    setMsg(null);
    setApiError(null);
    try {
      const r = await fetch("/api/admin/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config_key: section.configKey,
          value: values[section.configKey] ?? null,
        }),
      });
      if (r.ok) {
        setMsg({ kind: "ok", text: "Saved!" });
        await load();
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
    <div className="admin-content">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{pageTitle}</h1>
          <p className="admin-page-subtitle">{pageSubtitle}</p>
        </div>
        {section?.kind === "form" && (
          <button
            onClick={save}
            disabled={saving || loading}
            className="admin-btn admin-btn-gold"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving…" : "Save"}
          </button>
        )}
      </div>

      {msg && msg.kind === "ok" && (
        <p className="mb-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {msg.text}
        </p>
      )}

      {apiError && (
        <ValidationErrors
          error={apiError.message ?? apiError.error}
          details={apiError.details}
        />
      )}

      {msg && msg.kind === "err" && !apiError && (
        <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {msg.text}
        </p>
      )}

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="admin-card">
            {loading && (
              <div className="flex justify-center py-12">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            )}

            {!loading && section?.kind === "link" && section.href && (
              <div className="space-y-3 py-2">
                <h2 className="font-semibold text-gray-800">{section.label}</h2>
                <p className="text-sm text-gray-600">
                  This section is managed in the dedicated admin page. Click below
                  to continue there.
                </p>
                <Link
                  href={section.href}
                  className="admin-btn admin-btn-outline admin-btn-sm inline-flex"
                >
                  Open {section.label}
                  <ExternalLink size={13} className="ml-1" />
                </Link>
              </div>
            )}

            {!loading && section?.kind === "custom" && section.customRender && (
              <>
                <h2 className="mb-4 font-semibold text-gray-800">
                  {section.label}
                </h2>
                {section.customRender()}
              </>
            )}

            {!loading &&
              section?.kind === "form" &&
              section.configKey &&
              section.render && (
                <>
                  <h2 className="mb-4 font-semibold text-gray-800">
                    {section.label}
                  </h2>
                  {section.render(values[section.configKey], (next) =>
                    setValues((prev) => ({
                      ...prev,
                      [section.configKey!]: next,
                    })),
                  )}
                </>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

function defaultValueFor(s: SectionDef): unknown {
  if (s.defaultValue !== undefined) return s.defaultValue;
  return {};
}
