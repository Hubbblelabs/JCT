import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Allow auth routes
  if (isApiAuthRoute) return NextResponse.next();

  // Unauthenticated API calls get a JSON 401 — a redirect would be silently
  // followed by fetch(), handing the caller login-page HTML with status 200.
  if (isAdminApi && !req.auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect unauthenticated users to login
  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authenticated users away from login
  if (isLoginPage && req.auth) {
    const userRole = (req.auth.user as Record<string, unknown>)?.role as string;
    const institution = (req.auth.user as Record<string, unknown>)
      ?.institution as string;
    if (userRole === "editor") {
      // Their college hub — the hub itself re-routes if the institution value
      // doesn't name a section they can open.
      return NextResponse.redirect(
        new URL(`/admin/hub/${institution || "engineering"}`, req.url),
      );
    }
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    /**
     * Every path under /api/admin EXCEPT the restore route.
     *
     * Next clones the request body for any request the proxy matches, and caps
     * that clone at `experimental.proxyClientMaxBodySize` (10 MB by default).
     * Past the cap it does not reject the request — it ends the stream early
     * and logs a warning, so the handler receives a truncated archive and the
     * ZIP parse dies with FILE_ENDED. Raising the cap is not the fix either:
     * the clone handed to the proxy is never drained, so a multi-gigabyte body
     * would simply accumulate in memory instead.
     *
     * This proxy never reads a request body — it only inspects the pathname and
     * the session — so skipping it here costs nothing. Access is still enforced:
     * the route calls `requireRole(req, "admin")` before it touches the body,
     * exactly as every other admin API route does.
     */
    "/api/admin/((?!site-config/restore(?:/|$)).*)",
  ],
};
