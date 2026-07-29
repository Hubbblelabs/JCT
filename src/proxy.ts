import { auth } from "@/auth";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Deny by default. Admin APIs get a JSON 401 rather than a redirect, which
 * `fetch()` would follow silently and hand the caller login-page HTML with
 * status 200.
 */
function denied(pathname: string, url: string) {
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = new URL("/admin/login", url);
  if (pathname !== "/admin/login") {
    loginUrl.searchParams.set("callbackUrl", pathname);
  }
  return NextResponse.redirect(loginUrl);
}

const gate = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/admin/login";
  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Allow auth routes
  if (isApiAuthRoute) return NextResponse.next();

  // A session object with no user is not a session. Checking `req.auth` alone
  // would let a partially-resolved value read as authenticated.
  const user = req.auth?.user;

  if (isAdminApi && !user) {
    return denied(pathname, req.url);
  }

  // Redirect unauthenticated users to login
  if (isAdminRoute && !isLoginPage && !user) {
    return denied(pathname, req.url);
  }

  // Redirect already-authenticated users away from login
  if (isLoginPage && user) {
    const userRole = (user as Record<string, unknown>)?.role as string;
    const institution = (user as Record<string, unknown>)
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

/**
 * Wraps the gate so a throw *anywhere* in session resolution denies the
 * request instead of falling through.
 *
 * This matters because the previous failure mode was permissive: while
 * `trustHost` was unset, NextAuth threw `UntrustedHost` on every request and
 * unauthenticated callers reached `/admin/dashboard` with a 200 that streamed
 * real database content. The try/catch has to sit outside `auth()`, not inside
 * the callback — the throw originates in the wrapper, before the callback runs.
 */
export default async function proxy(
  req: NextRequest,
  ctx: unknown,
): Promise<NextResponse> {
  try {
    const res = (await (gate as unknown as (r: NextRequest, c: unknown) => unknown)(
      req,
      ctx,
    )) as NextResponse | undefined;
    return res ?? NextResponse.next();
  } catch (err) {
    console.error("[proxy] auth resolution failed:", err);
    return denied(req.nextUrl.pathname, req.url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
