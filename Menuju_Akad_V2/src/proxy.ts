import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
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
