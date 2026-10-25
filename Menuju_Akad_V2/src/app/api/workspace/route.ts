import { getWorkspaceService } from "@/server/workspaces/runtime";
import {
  requireAuthOwner,
  jsonResponse,
  handlePaymentApiError,
  validateSameOrigin,
} from "@/server/payments/http";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { activeWorkspace } from "@/server/workspaces/active-workspace";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    return jsonResponse({ workspace: await activeWorkspace(auth.owner) });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
export async function PATCH(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const body = await readBoundedJson(req);
    if (Object.keys(body).some((key) => !["fullName", "partnerName"].includes(key)))
      return jsonResponse({ error: "Profil tidak valid" }, 400);
    return jsonResponse({
      workspace: getWorkspaceService().saveProfile(
        auth.owner,
        body as unknown as { fullName: string; partnerName: string | null },
      ),
    });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
