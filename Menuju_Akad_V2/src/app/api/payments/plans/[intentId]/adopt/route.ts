import { guestHash } from "@/server/payments/guest-reservation";
import { cookies } from "next/headers";
import { getPlanCheckoutService } from "@/server/payments/runtime";
import {
  handlePaymentApiError,
  jsonResponse,
  requireAuthOwner,
  validateSameOrigin,
} from "@/server/payments/http";
export const runtime = "nodejs";

export async function POST(req: Request, context: { params: Promise<{ intentId: string }> }) {
  const originError = validateSameOrigin(req);
  if (originError) return originError;
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const { intentId } = await context.params;
    const service = getPlanCheckoutService();
    service.adopt(intentId, (await guestHash(false, false)) ?? "", auth.owner);
    (await cookies()).delete("ma-workspace");
    return jsonResponse({
      quote: await service.quote({ kind: "owner", owner: auth.owner }, intentId),
      invoice: service.invoice(auth.owner, intentId),
    });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
