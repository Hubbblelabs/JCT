import Link from "next/link";
import { readdir } from "node:fs/promises";
import path from "node:path";

type RouteGroup = {
  label: string;
  routes: string[];
};

const APP_DIR = path.join(process.cwd(), "src", "app");

async function collectPageFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "api") {
        continue;
      }

      files.push(...(await collectPageFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && entry.name === "page.tsx") {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeRoute(filePath: string): string | null {
  const relPath = path.relative(APP_DIR, filePath).replace(/\\/g, "/");

  if (relPath === "page.tsx") {
    return "/";
  }

  const withoutPage = relPath.replace(/\/page\.tsx$/, "");
  const segments = withoutPage.split("/").filter(Boolean);
  const cleanSegments = segments.filter(
    (segment) => !(segment.startsWith("(") && segment.endsWith(")")),
  );

  if (cleanSegments.some((segment) => segment.startsWith("["))) {
    return null;
  }

  const route = `/${cleanSegments.join("/")}`;

  if (route === "/robots" || route === "/sitemap") {
    return null;
  }

  return route;
}

function groupRoutes(routes: string[]): RouteGroup[] {
  const grouped = new Map<string, string[]>();

  for (const route of routes) {
    const parts = route.split("/").filter(Boolean);
    const label = parts[0] ?? "root";

    if (!grouped.has(label)) {
      grouped.set(label, []);
    }

    grouped.get(label)?.push(route);
  }

  return [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, groupRoutesList]) => ({
      label,
      routes: groupRoutesList.sort((a, b) => a.localeCompare(b)),
    }));
}

function prettifyRoute(route: string): string {
  if (route === "/") {
    return "Home";
  }

  return route
    .slice(1)
    .split("/")
    .map((part) => part.replace(/-/g, " "))
    .join(" / ");
}

export async function RouteQuickNav() {
  const pageFiles = await collectPageFiles(APP_DIR);
  const routes = [
    ...new Set(pageFiles.map(normalizeRoute).filter(Boolean)),
  ] as string[];
  const routeGroups = groupRoutes(routes);

  return (
    <div className="fixed right-4 bottom-20 z-50 md:right-6 md:bottom-24">
      <details className="group relative">
        <summary className="flex h-12 cursor-pointer list-none items-center justify-center rounded-full border border-[#0a1628]/20 bg-white px-4 text-sm font-semibold text-[#0a1628] shadow-lg transition-colors hover:bg-[#f7f7f7]">
          Routes ({routes.length})
        </summary>

        <div className="absolute right-0 bottom-14 max-h-[65vh] w-[20rem] overflow-y-auto rounded-2xl border border-[#0a1628]/10 bg-white p-4 shadow-2xl">
          <p className="mb-3 text-xs font-semibold tracking-[0.08em] text-[#0a1628]/60 uppercase">
            Quick Route Access
          </p>

          <div className="space-y-4">
            {routeGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-1 text-[11px] font-bold tracking-[0.08em] text-[#0a1628]/45 uppercase">
                  {group.label}
                </p>
                <div className="flex flex-col gap-1">
                  {group.routes.map((route) => (
                    <Link
                      key={route}
                      href={route}
                      className="rounded-md px-2 py-1.5 text-sm text-[#0a1628] transition-colors hover:bg-[#f3f4f6]"
                    >
                      {prettifyRoute(route)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
