import "server-only";
import {
  handlePaymentApiError,
  jsonResponse,
  requireAuthOwner,
  validateSameOrigin,
} from "@/server/payments/http";
import { getPaymentService, isPaymentReady } from "@/server/payments/runtime";
import { readDiscountClaim } from "@/server/payments/create-request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authResult = await requireAuthOwner(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  try {
    if (!isPaymentReady()) {
      return jsonResponse({ error: "Layanan pembayaran QRIS belum dikonfigurasi." }, 503);
    }
    const service = getPaymentService();
    const invoice = service.current(authResult.owner);
    return jsonResponse({ invoice, discountOffer: service.discountOffer(authResult.owner) });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}

export async function POST(req: Request) {
  const authResult = await requireAuthOwner(req);
  if ("errorResponse" in authResult) {
    return authResult.errorResponse;
  }

  const originError = validateSameOrigin(req);
  if (originError) {
    return originError;
  }

  try {
    if (!isPaymentReady()) {
      return jsonResponse({ error: "Layanan pembayaran QRIS belum dikonfigurasi." }, 503);
    }
    const service = getPaymentService();
    const claim = await readDiscountClaim(req);
    const invoice = claim
      ? await service.create(authResult.owner, true)
      : await service.create(authResult.owner);
    return jsonResponse({ invoice }, 200);
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
