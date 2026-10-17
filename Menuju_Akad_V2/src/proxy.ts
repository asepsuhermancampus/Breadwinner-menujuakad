import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  if (!request.nextUrl.pathname.startsWith("/preview-ui")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return response;
}
export const config = {
  matcher: [
    "/account/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/vendor/:path*",
    "/ba/:path*",
    "/preview-ui/:path*",
  ],
};
