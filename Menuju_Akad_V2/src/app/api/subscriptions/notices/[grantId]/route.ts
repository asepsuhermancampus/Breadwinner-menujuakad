import {
  requireAuthOwner,
  jsonResponse,
  handlePaymentApiError,
  validateSameOrigin,
} from "@/server/payments/http";
import { getPaymentDatabase } from "@/server/payments/runtime";
import { updateNotice } from "@/server/subscriptions/notice-repository";
import { readBoundedJson } from "@/server/payments/checkout-request";
import type { NoticeAction } from "@/features/subscriptions/types";
export const runtime = "nodejs";
export async function PATCH(req: Request, context: { params: Promise<{ grantId: string }> }) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const body = await readBoundedJson(req),
      { grantId } = await context.params;
    if (
      !["start", "next", "back", "dismiss", "complete"].includes(body["action"] as string) ||
      !Number.isSafeInteger(body["expectedStep"]) ||
      Number(body["expectedStep"]) < 0
    )
      return jsonResponse({ error: "Langkah panduan tidak valid" }, 400);
    return jsonResponse({
      notice: updateNotice(
        getPaymentDatabase().storage(),
        auth.owner,
        grantId,
        body["action"] as NoticeAction,
        body["expectedStep"] as number,
      ),
    });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
