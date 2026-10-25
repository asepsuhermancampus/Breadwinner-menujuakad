import { handlers } from "@/server/auth";
import { NextResponse, NextRequest } from "next/server";
import { validateSameOrigin } from "@/server/payments/http";

export const GET = handlers.GET;
export async function POST(request: NextRequest) {
  const invalid = validateSameOrigin(request);
  if (invalid) return invalid;
  if (Number(request.headers.get("content-length")) > 16384)
    return new Response(null, { status: 413 });
  const chunks: Uint8Array[] = [];
  const reader = request.body?.getReader();
  let bytes = 0;
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 16384) {
          await reader.cancel();
          return new Response(null, { status: 413 });
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
  }
  const bounded = new NextRequest(request.url, {
    method: "POST",
    headers: request.headers,
    body: Buffer.concat(chunks),
  });
  const response = await handlers.POST(bounded);
  if (new URL(request.url).pathname.endsWith("/signout") && response.ok) {
    const result = new NextResponse(response.body, response);
    for (const name of ["ma-workspace", "ma-checkout", "ma_superadmin_session", "ma_google_link"])
      result.cookies.set(name, "", { path: "/", maxAge: 0, httpOnly: true, sameSite: "lax" });
    return result;
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
