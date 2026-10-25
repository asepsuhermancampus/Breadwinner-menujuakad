import {
  requireAuthOwner,
  jsonResponse,
  handlePaymentApiError,
  validateSameOrigin,
} from "@/server/payments/http";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { createSupportRequest } from "@/server/workspaces/support-service";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { activeWorkspace } from "@/server/workspaces/active-workspace";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const body = await readBoundedJson(req, 8192);
    return jsonResponse(
      createSupportRequest(
        getWorkspaceService(),
        auth.owner,
        body["message"] as string,
        (await activeWorkspace(auth.owner)).id,
      ),
    );
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
