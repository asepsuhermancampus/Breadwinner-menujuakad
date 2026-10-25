import "server-only";
import { PaymentError } from "./errors";

export async function readDiscountClaim(req: Request): Promise<boolean> {
  if (!req.body) return false;
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 1024) {
        await reader.cancel();
        throw new PaymentError("Permintaan klaim terlalu besar.", 413);
      }
      chunks.push(value);
    }
    if (!bytes) return false;
    const payload: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error();
    const claim = (payload as Record<string, unknown>)["claimNewUserDiscount"];
    if (claim !== undefined && typeof claim !== "boolean") throw new Error();
    return claim === true;
  } catch (error) {
    if (error instanceof PaymentError) throw error;
    throw new PaymentError("Permintaan klaim diskon tidak valid.", 400);
  } finally {
    reader.releaseLock();
  }
}
