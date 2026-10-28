import "server-only";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { isLocalOriginAlias } from "@/server/http/local-origin";
import { isConfiguredApplicationOrigin } from "@/server/http/application-origin";

export class ReviewHttpError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}
export function assertOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([new URL(request.url).origin]);
  const configured = process.env["REVIEWS_APP_ORIGIN"];
  if (configured) allowed.add(new URL(configured).origin);
  if (
    !origin ||
    (!allowed.has(origin) &&
      !isLocalOriginAlias(request, origin) &&
      !isConfiguredApplicationOrigin(origin))
  )
    throw new ReviewHttpError("Permintaan tidak diizinkan dari halaman ini.", 403);
}
export async function readJson(request: Request): Promise<unknown> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
    throw new ReviewHttpError("Gunakan format JSON.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new ReviewHttpError("Data belum diisi.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16384) {
        await reader.cancel();
        throw new ReviewHttpError("Data terlalu panjang.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ReviewHttpError("Data tidak dapat dibaca.");
  }
}
export function reviewJson(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" },
  });
}
export async function reviewAction(
  operation: () => Promise<Response> | Response,
): Promise<Response> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof ReviewHttpError) return reviewJson({ error: error.message }, error.status);
    if (error instanceof ZodError)
      return reviewJson({ error: "Periksa kembali nama, bintang, dan isian formulir." }, 400);
    console.error("[reviews] Request failed", error instanceof Error ? error.name : "unknown");
    return reviewJson({ error: "Layanan ulasan belum dapat diakses. Silakan coba lagi." }, 503);
  }
}
