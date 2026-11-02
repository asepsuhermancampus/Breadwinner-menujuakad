import { z } from "zod";
import { getSuperadminSession } from "@/server/reviews/access";
import { getPaymentDatabase } from "@/server/payments/runtime";
import {
  readPlanPricing,
  readPlanPricingAudit,
  updatePlanPrice,
} from "@/server/payments/plan-pricing-settings";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";

export const runtime = "nodejs";

const patchSchema = z
  .object({
    planId: z.enum(["premium", "lifetime"]),
    amount: z.number().int().min(10000).max(100000000),
    reason: z.string().trim().min(3).max(500),
    version: z.number().int().nonnegative().safe(),
  })
  .strict();

export async function GET() {
  const account = await getSuperadminSession();
  if (!account) return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const db = getPaymentDatabase().storage();
    const pricing = readPlanPricing(db);
    const audit = readPlanPricingAudit(db, 50);
    return jsonResponse({ pricing, audit });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}

export async function PATCH(request: Request) {
  const originError = validateSameOrigin(request);
  if (originError) return originError;

  const account = await getSuperadminSession();
  if (!account) return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);

  try {
    const body = await readBoundedJson(request, 4096);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return jsonResponse(
        { error: "Periksa kembali input harga paket dan alasan penyesuaian." },
        400,
      );
    }

    const { planId, amount, reason, version } = parsed.data;
    const db = getPaymentDatabase().storage();
    const updated = updatePlanPrice(db, account.email, planId, amount, reason, version);

    const pricing = readPlanPricing(db);
    const audit = readPlanPricingAudit(db, 50);

    return jsonResponse({
      success: true,
      updated,
      pricing,
      audit,
      message: `Harga Paket ${planId === "premium" ? "Premium" : "Lifetime"} berhasil diperbarui ke Rp ${amount.toLocaleString("id-ID")}.`,
    });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}

