import "server-only";
import { PaymentError } from "./errors";

export async function readBoundedJson(
  req: Request,
  limit = 1024,
): Promise<Record<string, unknown>> {
  if (!req.body) throw new PaymentError("Permintaan kosong", 400);
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) {
        await reader.cancel();
        throw new PaymentError("Permintaan terlalu besar", 413);
      }
      chunks.push(value);
    }
    const data: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error();
    return data as Record<string, unknown>;
  } catch (error) {
    if (error instanceof PaymentError) throw error;
    throw new PaymentError("Permintaan tidak valid", 400);
  } finally {
    reader.releaseLock();
  }
}

export async function readPlanRequest(req: Request) {
  const body = await readBoundedJson(req);
  if (
    Object.keys(body).some(
      (k) => !["planId", "claimDiscount", "replaceIntentId", "renewal"].includes(k),
    ) ||
    (body["planId"] !== "premium" && body["planId"] !== "lifetime") ||
    typeof body["claimDiscount"] !== "boolean" ||
    (body["replaceIntentId"] !== undefined &&
      (typeof body["replaceIntentId"] !== "string" ||
        !/^[a-f0-9-]{36}$/.test(body["replaceIntentId"]))) ||
    (body["renewal"] !== undefined && typeof body["renewal"] !== "boolean")
  )
    throw new PaymentError("Paket atau klaim tidak valid", 400);
  return {
    planId: body["planId"] as "premium" | "lifetime",
    claimDiscount: body["claimDiscount"] as boolean,
    ...(body["replaceIntentId"] ? { replaceIntentId: body["replaceIntentId"] as string } : {}),
    ...(body["renewal"] !== undefined ? { renewal: body["renewal"] as boolean } : {}),
  };
}
