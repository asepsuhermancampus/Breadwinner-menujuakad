import { auth } from "@/server/auth";
import { isOperator } from "@/server/identity/policy";
import { MarketplaceCatalog } from "@/server/marketplace/catalog";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { jsonResponse, validateSameOrigin, handlePaymentApiError } from "@/server/payments/http";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const session = await auth();
  if (!isOperator(session)) return jsonResponse({ error: "Akses pengelola diperlukan." }, 403);
  try {
    return jsonResponse({
      vendor: new MarketplaceCatalog(getWorkspaceService().db).save(
        await readBoundedJson(req, 8192),
      ),
    });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}
export async function DELETE(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const session = await auth();
  if (!isOperator(session)) return jsonResponse({ error: "Akses pengelola diperlukan." }, 403);
  try {
    const body = await readBoundedJson(req);
    if (typeof body.id !== "string") return jsonResponse({ error: "Vendor tidak valid." }, 400);
    new MarketplaceCatalog(getWorkspaceService().db).remove(body.id);
    return jsonResponse({ ok: true });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}
