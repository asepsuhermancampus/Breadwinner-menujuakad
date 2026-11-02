import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref && /^[A-Za-z0-9_-]{3,50}$/.test(ref)) {
    response.cookies.set("menujuakad_ref", ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
    });
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
