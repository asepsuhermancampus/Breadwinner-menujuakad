import { checkoutPrincipal } from "@/server/payments/guest-reservation";
import { getPlanCheckoutService } from "@/server/payments/runtime";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";
import { readPlanRequest } from "@/server/payments/checkout-request";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const principal = await checkoutPrincipal(req, false);
    const service = getPlanCheckoutService();
    const active = principal ? service.intents.active(principal) : null;
    const selected = new URL(req.url).searchParams.get("plan");
    return jsonResponse({
      authenticated: principal?.kind === "owner",
      quote:
        active && (!selected || active.planId === selected)
          ? await service.quote(principal!, active.id)
          : null,
      activeQuote: active ? await service.quote(principal!, active.id) : null,
      offer: service.offer(principal),
    });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}

export async function POST(req: Request) {
  const error = validateSameOrigin(req);
  if (error) return error;
  try {
    const data = await readPlanRequest(req);
    const principal = (await checkoutPrincipal(req, true))!;
    if (data.claimDiscount && principal.kind !== "owner")
      return jsonResponse({ error: "Masuk atau daftar untuk mengklaim diskon tambahan." }, 401);
    const quote = await getPlanCheckoutService().reserve(
      principal,
      data.planId,
      data.claimDiscount,
      data,
    );
    return jsonResponse({ quote });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
