import { checkoutPrincipal } from "@/server/payments/guest-reservation";
import { getPlanCheckoutService } from "@/server/payments/runtime";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, context: { params: Promise<{ intentId: string }> }) {
  try {
    const principal = await checkoutPrincipal(req, false);
    if (!principal) return jsonResponse({ error: "Pesanan tidak ditemukan" }, 404);
    const { intentId } = await context.params;
    const service = getPlanCheckoutService();
    const quote = await service.quote(principal, intentId);
    return jsonResponse({
      quote,
      ...(principal.kind === "owner" && new URL(req.url).searchParams.get("checkout") === "1"
        ? { invoice: service.invoice(principal.owner, intentId) }
        : {}),
    });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}

export async function DELETE(req: Request, context: { params: Promise<{ intentId: string }> }) {
  const originError = validateSameOrigin(req);
  if (originError) return originError;
  try {
    const principal = await checkoutPrincipal(req, false);
    if (!principal) return jsonResponse({ error: "Pesanan tidak ditemukan" }, 404);
    const { intentId } = await context.params;
    return jsonResponse({ quote: await getPlanCheckoutService().cancel(principal, intentId) });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
