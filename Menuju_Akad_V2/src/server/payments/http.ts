import "server-only";
import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { PaymentError } from "@/server/payments/errors";
import { ownerForSession } from "@/server/identity/policy";
import { isLocalOriginAlias } from "@/server/http/local-origin";
import { isConfiguredApplicationOrigin } from "@/server/http/application-origin";

export const NO_CACHE_HEADERS = {
  "Cache-Control": "private, no-store",
} as const;

export function jsonResponse<T>(data: T, status = 200): NextResponse<T> {
  return NextResponse.json(data, {
    status,
    headers: NO_CACHE_HEADERS,
  });
}

export function hashOwnerEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex");
}

export async function requireAuthOwner(
  req: Request,
): Promise<{ owner: string } | { errorResponse: NextResponse<{ error: string }> }> {
  void req;
  const session = await auth();
  const email = session?.user?.email;
  if (!email || typeof email !== "string" || email.trim().length === 0) {
    return {
      errorResponse: jsonResponse(
        { error: "Sesi tidak ditemukan atau belum terautentikasi." },
        401,
      ),
    };
  }
  return { owner: ownerForSession(session!) };
}

export function validateSameOrigin(req: Request): NextResponse<{ error: string }> | null {
  const origin = req.headers.get("origin");
  if (!origin) {
    return jsonResponse({ error: "Header Origin wajib disertakan." }, 403);
  }
  let expectedOrigin: string;
  try {
    expectedOrigin = new URL(req.url).origin;
  } catch {
    return jsonResponse({ error: "Format URL permintaan tidak valid." }, 400);
  }
  const localAlias = isLocalOriginAlias(req, origin);
  if (origin !== expectedOrigin && !localAlias && !isConfiguredApplicationOrigin(origin)) {
    return jsonResponse({ error: "Akses lintas-asal ditolak." }, 403);
  }
  return null;
}

export function handlePaymentApiError(error: unknown): NextResponse<{ error: string }> {
  if (error instanceof PaymentError) {
    return jsonResponse({ error: error.message }, error.httpStatus);
  }
  return jsonResponse({ error: "Terjadi kesalahan pada layanan pembayaran." }, 500);
}
