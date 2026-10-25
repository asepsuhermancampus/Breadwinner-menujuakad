import "server-only";
import { handlePaymentApiError, jsonResponse } from "@/server/payments/http";
import { getPaymentService, isPaymentReady } from "@/server/payments/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 32 * 1024;

async function readBoundedJson(
  req: Request,
): Promise<{ payload: unknown } | { status: number; error: string }> {
  if (!req.body) {
    return { status: 400, error: "Isi payload permintaan kosong." };
  }

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > MAX_BYTES) {
          await reader.cancel();
          return { status: 413, error: "Ukuran payload melebihi batas 32KB." };
        }
        chunks.push(value);
      }
    }
  } catch {
    return { status: 400, error: "Gagal membaca aliran data permintaan." };
  }

  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = new TextDecoder("utf-8").decode(merged);
  try {
    const payload = JSON.parse(text) as unknown;
    return { payload };
  } catch {
    return { status: 400, error: "Format JSON payload webhook tidak valid." };
  }
}

export async function POST(req: Request) {
  const readResult = await readBoundedJson(req);
  if ("error" in readResult) {
    return jsonResponse({ error: readResult.error }, readResult.status);
  }

  try {
    if (!isPaymentReady()) {
      return jsonResponse({ error: "Layanan pembayaran QRIS belum dikonfigurasi." }, 503);
    }
    const service = getPaymentService();
    await service.webhook(readResult.payload);
    return jsonResponse({ received: true }, 200);
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
