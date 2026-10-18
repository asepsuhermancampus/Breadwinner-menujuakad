import { NextResponse, type NextRequest } from "next/server";

const FAIL_CLOSED = ["/dashboard", "/admin", "/vendor", "/ba"];

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  const pathname = request.nextUrl.pathname;
  if (FAIL_CLOSED.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/vendor/:path*",
    "/ba/:path*",
    "/account/:path*",
    "/auth/:path*",
    "/onboarding/:path*",
    "/join/:path*",
  ],
};
