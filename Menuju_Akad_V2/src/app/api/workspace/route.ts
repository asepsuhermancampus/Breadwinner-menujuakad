import { getWorkspaceService } from "@/server/workspaces/runtime";
import {
  requireAuthOwner,
  jsonResponse,
  handlePaymentApiError,
  validateSameOrigin,
} from "@/server/payments/http";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { activeWorkspace } from "@/server/workspaces/active-workspace";
import {
  MAX_PROFILE_CHANGES_BODY,
  saveProfileChanges,
} from "@/server/workspaces/save-profile-changes";
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
    const body = await readBoundedJson(req, MAX_PROFILE_CHANGES_BODY);
    return jsonResponse({
      workspace: await saveProfileChanges(
        getWorkspaceService(),
        auth.owner,
        (await activeWorkspace(auth.owner)).id,
        body,
      ),
    });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
