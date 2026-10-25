import "server-only";
import { handlePaymentApiError, jsonResponse, requireAuthOwner } from "@/server/payments/http";
import { getPaymentService, isPaymentReady } from "@/server/payments/runtime";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ORDER_ID_REGEX = /^[A-Za-z0-9_-]{1,128}$/;

export async function GET(req: Request, props: { params: Promise<{ orderId: string }> }) {
  const authResult = await requireAuthOwner(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const { orderId } = await props.params;
  if (!orderId || !ORDER_ID_REGEX.test(orderId)) {
    return jsonResponse({ error: "Format order ID tidak valid." }, 400);
  }

  try {
    if (!isPaymentReady()) {
      return jsonResponse({ error: "Layanan pembayaran QRIS belum dikonfigurasi." }, 503);
    }
    const service = getPaymentService();
    const invoice =
      new URL(req.url).searchParams.get("manual") === "1"
        ? await service.refresh(authResult.owner, orderId, { manual: true })
        : await service.refresh(authResult.owner, orderId);
    return jsonResponse({ invoice });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
