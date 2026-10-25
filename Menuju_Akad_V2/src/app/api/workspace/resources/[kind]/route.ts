import {
  requireAuthOwner,
  jsonResponse,
  handlePaymentApiError,
  validateSameOrigin,
} from "@/server/payments/http";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { ResourceService } from "@/server/workspaces/resource-service";
import { isResourceKind } from "@/server/workspaces/resource-policy";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { activeWorkspace } from "@/server/workspaces/active-workspace";
export const runtime = "nodejs";
type Context = { params: Promise<{ kind: string }> };
export async function GET(req: Request, context: Context) {
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  const { kind } = await context.params;
  if (!isResourceKind(kind)) return jsonResponse({ error: "Fitur tidak ditemukan" }, 404);
  try {
    return jsonResponse(
      new ResourceService(getWorkspaceService()).readResource(
        auth.owner,
        kind,
        new URL(req.url).searchParams.get("workspace") ?? (await activeWorkspace(auth.owner)).id,
      ),
    );
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
export async function PUT(req: Request, context: Context) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  const { kind } = await context.params;
  if (!isResourceKind(kind)) return jsonResponse({ error: "Fitur tidak ditemukan" }, 404);
  try {
    const data = await readBoundedJson(req, 1048576);
    return jsonResponse(
      new ResourceService(getWorkspaceService()).writeResource(
        auth.owner,
        kind,
        data["revision"] as number,
        data["data"],
        new URL(req.url).searchParams.get("workspace") ?? (await activeWorkspace(auth.owner)).id,
      ),
    );
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
