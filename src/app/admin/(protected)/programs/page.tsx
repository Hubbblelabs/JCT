"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { COLLEGE_LABELS, type College } from "@/lib/admin-nav";
import { PageShell } from "@/components/admin/kit/PageShell";
import { DataTable, type Column } from "@/components/admin/kit/DataTable";
import {
  Banner,
  PublishBadge,
  VisibilityBadge,
} from "@/components/admin/kit/primitives";

interface Program {
  _id: string;
  name: string;
  abbr: string;
  slug: string;
  institution: string;
  image: string;
  outcomes: string[];
  is_active: boolean;
  sort_order: number;
  status: "draft" | "published" | "archived";
}

const collegeLabel = (id: string) => COLLEGE_LABELS[id as College] ?? id ?? "—";

function ProgramsPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [busy, setBusy] = useState(false);

  const college = searchParams.get("college") ?? "";

  // The old loader had no `r.ok` check and no catch, so a failed request left
  // the page showing an empty table — indistinguishable from "no programs".
  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const r = await fetch("/api/admin/programs");
      if (!r.ok) throw new Error(`Request failed (${r.status})`);
      const data = await r.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err) {
      setPrograms([]);
      setLoadError(
        err instanceof Error ? err.message : "Could not load programs.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const open = (p: Program) =>
    router.push(`/admin/programs/${p._id}?college=${p.institution}`);

  const rows = college
    ? programs.filter((p) => p.institution === college)
    : programs;

  const handleCreateNew = async () => {
    setCreatingNew(true);
    try {
      const institution = college || "engineering";
      const r = await fetch("/api/admin/programs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Untitled Program",
          abbr: "UP",
          slug: `untitled-program-${Date.now()}`,
          institution,
          image: "",
          outcomes: [],
          is_active: true,
          sort_order: 0,
          content: {},
        }),
      });
      if (!r.ok) throw new Error();
      const data = await r.json();
      router.push(`/admin/programs/${data._id}?college=${institution}`);
    } catch {
      toast.error("Could not create the program. Nothing was saved.");
      setCreatingNew(false);
    }
  };

  /** Runs one request per row and reports how many actually succeeded. */
  const runBulk = async (
    label: string,
    selected: Program[],
    run: (p: Program) => Promise<Response>,
  ) => {
    setBusy(true);
    try {
      const results = await Promise.all(
        selected.map((p) => run(p).catch(() => null)),
      );
      const failed = results.filter((r) => !r || !r.ok).length;
      if (failed === 0) {
        toast.success(`${label} ${selected.length} program(s).`);
      } else {
        toast.error(
          `${label} ${selected.length - failed} of ${selected.length}. ${failed} failed — they were left unchanged.`,
        );
      }
      await load();
    } finally {
      setBusy(false);
    }
  };

  const setActive = (selected: Program[], is_active: boolean) =>
    runBulk(
      is_active ? "Published to site:" : "Hidden from site:",
      selected,
      (p) =>
        fetch(`/api/admin/programs/${p._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active }),
        }),
    );

  const publish = (selected: Program[]) =>
    runBulk("Published", selected, (p) =>
      fetch(`/api/admin/programs/${p._id}/publish`, { method: "POST" }),
    );

  const remove = async (selected: Program[]) => {
    const ok = await confirm({
      title:
        selected.length === 1
          ? "Delete program"
          : `Delete ${selected.length} programs`,
      message:
        selected.length === 1
          ? `Permanently delete “${selected[0].name}”? Its page content and uploaded images go with it. This cannot be undone.`
          : `Permanently delete ${selected.length} programs, including their page content and uploaded images? This cannot be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    await runBulk("Deleted", selected, (p) =>
      fetch(`/api/admin/programs/${p._id}`, { method: "DELETE" }),
    );
  };

  const columns: Column<Program>[] = [
    {
      key: "name",
      header: "Program",
      sortable: true,
      value: (p) => `${p.name} ${p.abbr} ${p.slug}`,
      render: (p) => (
        <span className="block">
          <span className="block font-medium text-[var(--admin-text)]">
            {p.name}
          </span>
          <span className="block font-mono text-[length:var(--admin-text-sm)] text-[var(--admin-text-faint)]">
            {p.abbr}
          </span>
        </span>
      ),
    },
    {
      key: "institution",
      header: "College",
      sortable: true,
      hideOnMobile: true,
      value: (p) => collegeLabel(p.institution),
      render: (p) => (
        <span className="text-[var(--admin-text-secondary)]">
          {collegeLabel(p.institution)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Page content",
      sortable: true,
      value: (p) => p.status ?? "draft",
      render: (p) => <PublishBadge status={p.status} />,
    },
    {
      key: "is_active",
      header: "On public site",
      sortable: true,
      value: (p) => (p.is_active ? 1 : 0),
      render: (p) => <VisibilityBadge isActive={p.is_active} />,
    },
  ];

  return (
    <PageShell
      title="Programs"
      description={
        college
          ? `Course cards and full page content for ${collegeLabel(college)}.`
          : "Course cards and full page content across all three colleges."
      }
      actions={
        <button
          onClick={handleCreateNew}
          disabled={creatingNew}
          className="admin-btn admin-btn-primary"
        >
          {creatingNew ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Plus size={15} />
          )}
          {creatingNew ? "Creating…" : "New program"}
        </button>
      }
    >
      {loadError && (
        <div className="mb-4">
          <Banner
            tone="danger"
            title="Could not load programs"
            action={
              <button
                onClick={() => void load()}
                className="admin-btn admin-btn-outline admin-btn-sm"
              >
                Retry
              </button>
            }
          >
            {loadError}
          </Banner>
        </div>
      )}

      <DataTable
        rows={rows}
        columns={columns}
        rowKey={(p) => p._id}
        loading={loading}
        searchPlaceholder="Search by name, code or slug…"
        onRowClick={open}
        initialSort={{ key: "name", dir: "asc" }}
        empty={{
          title: college
            ? `No programs for ${collegeLabel(college)} yet`
            : "No programs yet",
          body: "A program is one course entry — its card on the listing page and its full tabbed detail page.",
          action: (
            <button
              onClick={handleCreateNew}
              className="admin-btn admin-btn-primary"
            >
              <Plus size={15} /> New program
            </button>
          ),
        }}
        bulkActions={
          busy
            ? []
            : [
                { label: "Publish", icon: Send, onRun: (s) => publish(s) },
                {
                  label: "Show on site",
                  icon: Eye,
                  onRun: (s) => setActive(s, true),
                },
                {
                  label: "Hide from site",
                  icon: EyeOff,
                  onRun: (s) => setActive(s, false),
                },
                {
                  label: "Delete",
                  icon: Trash2,
                  destructive: true,
                  onRun: (s) => remove(s),
                },
              ]
        }
        toolbar={
          <span className="admin-help hidden sm:inline">
            <GraduationCap size={12} className="mr-1 inline" />
            Select rows to publish or hide several at once
          </span>
        }
      />
    </PageShell>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={null}>
      <ProgramsPageInner />
    </Suspense>
  );
}
