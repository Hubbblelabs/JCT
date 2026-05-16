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
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
