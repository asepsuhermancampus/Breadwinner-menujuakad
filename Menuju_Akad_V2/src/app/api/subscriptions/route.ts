import { requireAuthOwner, jsonResponse, handlePaymentApiError } from "@/server/payments/http";
import { getPaymentDatabase } from "@/server/payments/runtime";
import { readEntitlement } from "@/server/subscriptions/entitlement-query";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    return jsonResponse({
      subscription: readEntitlement(getPaymentDatabase().storage(), auth.owner),
    });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
