import { auth } from "@/server/auth";
import { isVendorOrOperator } from "@/server/identity/policy";
import { MarketplaceCatalog } from "@/server/marketplace/catalog";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { jsonResponse, validateSameOrigin, handlePaymentApiError } from "@/server/payments/http";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user || !isVendorOrOperator(session)) {
    return jsonResponse({ error: "Akses mitra vendor diperlukan." }, 403);
  }
  try {
    const catalog = new MarketplaceCatalog(getWorkspaceService().db);
    const vendors = catalog.list();
    const orders = catalog.requests();
    return jsonResponse({ vendors, orders });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}

export async function POST(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const session = await auth();
  if (!session?.user || !isVendorOrOperator(session)) {
    return jsonResponse({ error: "Akses mitra vendor diperlukan." }, 403);
  }
  try {
    const body = await readBoundedJson(req, 16384);
    const catalog = new MarketplaceCatalog(getWorkspaceService().db);
    const saved = catalog.save(body);
    return jsonResponse({ vendor: saved });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}
