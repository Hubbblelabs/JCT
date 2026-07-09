// "Continue editing" shortcuts — purely client-side. Dashboard links record
// the pages they navigate to; the dashboard reads them back on the next
// visit. No backend involvement.

export type RecentPage = {
  label: string;
  href: string;
  ts: number;
};

const STORAGE_KEY = "jct-admin-recent-pages";
const MAX_ENTRIES = 8;

export function readRecentPages(): RecentPage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is RecentPage =>
        typeof p === "object" &&
        p !== null &&
        typeof (p as RecentPage).label === "string" &&
        typeof (p as RecentPage).href === "string",
    );
  } catch {
    return [];
  }
}

export function rememberPage(page: { label: string; href: string }): void {
  if (typeof window === "undefined") return;
  try {
    const next: RecentPage[] = [
      { ...page, ts: Date.now() },
      ...readRecentPages().filter((p) => p.href !== page.href),
    ].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked — shortcuts are a nicety, never an error.
  }
}
