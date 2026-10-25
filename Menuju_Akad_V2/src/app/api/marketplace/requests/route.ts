import { auth } from "@/server/auth";
import { isOperator } from "@/server/identity/policy";
import { MarketplaceCatalog } from "@/server/marketplace/catalog";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readBoundedJson } from "@/server/payments/checkout-request";
import {
  jsonResponse,
  validateSameOrigin,
  requireAuthOwner,
  handlePaymentApiError,
} from "@/server/payments/http";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const owner = await requireAuthOwner(req);
  if ("errorResponse" in owner) return owner.errorResponse;
  try {
    const body = await readBoundedJson(req, 8192);
    return jsonResponse({
      order: new MarketplaceCatalog(getWorkspaceService().db).request(
        owner.owner,
        body.vendorIds as string[],
        body.message as string,
        (await auth())?.user?.email ?? "",
      ),
    });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}

export async function GET() {
  const session = await auth();
  if (!isOperator(session)) return jsonResponse({ error: "Akses pengelola diperlukan." }, 403);
  return jsonResponse({ orders: new MarketplaceCatalog(getWorkspaceService().db).requests() });
}
export async function PATCH(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const session = await auth();
  if (!isOperator(session)) return jsonResponse({ error: "Akses pengelola diperlukan." }, 403);
  try {
    const b = await readBoundedJson(req);
    if (typeof b.id !== "string" || typeof b.status !== "string")
      return jsonResponse({ error: "Permintaan tidak valid." }, 400);
    new MarketplaceCatalog(getWorkspaceService().db).updateRequest(b.id, b.status);
    return jsonResponse({ ok: true });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}
