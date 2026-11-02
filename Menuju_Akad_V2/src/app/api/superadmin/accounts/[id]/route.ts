import { z } from "zod";
import { getSuperadminSession } from "@/server/reviews/access";
import { getAccounts } from "@/server/identity/runtime";
import { changeAccountAccess } from "@/server/identity/account-administration";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";
export const runtime = "nodejs";
const input = z
  .object({
    role: z.enum(["customer", "admin", "vendor", "ambassador"]),
    active: z.boolean(),
    expected: z
      .object({
        role: z.enum(["customer", "admin", "superadmin", "vendor", "ambassador"]),
        active: z.boolean(),
        version: z.number().int().nonnegative().safe(),
      })
      .strict(),
    reason: z.string().trim().min(1).max(500),
  })
  .strict();
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const origin = validateSameOrigin(request);
  if (origin) return origin;
  const account = await getSuperadminSession();
  if (!account) return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const { id } = await context.params;
    if (!id || id.length > 160) return jsonResponse({ error: "Akun tidak ditemukan." }, 404);
    const parsed = input.safeParse(await readBoundedJson(request, 4096));
    if (!parsed.success) return jsonResponse({ error: "Periksa perubahan dan alasan." }, 400);
    const { role, active, expected, reason } = parsed.data;
    return jsonResponse(
      changeAccountAccess(getAccounts().db, account.id, id, { role, active }, expected, reason),
    );
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
