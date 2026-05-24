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

  // Redirect unauthenticated users to login
  if ((isAdminRoute && !isLoginPage) || isAdminApi) {
    if (!req.auth) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect already-authenticated users away from login
  if (isLoginPage && req.auth) {
    const userRole = (req.auth.user as Record<string, unknown>)?.role as string;
    const institution = (req.auth.user as Record<string, unknown>)
      ?.institution as string;
    if (userRole === "editor") {
      return NextResponse.redirect(
        new URL(
          `/admin/page-content?college=${institution || "engineering"}`,
          req.url,
        ),
      );
    }
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
