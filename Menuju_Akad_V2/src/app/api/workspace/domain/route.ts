import {
  requireAuthOwner,
  jsonResponse,
  handlePaymentApiError,
  validateSameOrigin,
} from "@/server/payments/http";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { DomainService } from "@/server/workspaces/domain-service";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { activeWorkspace } from "@/server/workspaces/active-workspace";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import { PaymentError } from "@/server/payments/errors";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const workspace = await activeWorkspace(auth.owner);
    if (
      workspace.role !== "owner" ||
      !readFeatureAvailability(getWorkspaceService().db, "domain", workspace.role, workspace)
        .available
    )
      throw new PaymentError("Custom domain belum tersedia untuk akun ini.", 403);
    return jsonResponse({ domain: new DomainService(getWorkspaceService()).get(auth.owner) });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
export async function POST(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const workspace = await activeWorkspace(auth.owner);
    if (
      workspace.role !== "owner" ||
      !readFeatureAvailability(getWorkspaceService().db, "domain", workspace.role, workspace)
        .available
    )
      throw new PaymentError("Custom domain belum tersedia untuk akun ini.", 403);
    const body = await readBoundedJson(req),
      service = new DomainService(getWorkspaceService());
    if (body["action"] === "verify")
      return jsonResponse({ domain: await service.verifyDomain(auth.owner) });
    if (typeof body["hostname"] !== "string")
      return jsonResponse({ error: "Domain tidak valid" }, 400);
    return jsonResponse({ domain: service.requestDomain(auth.owner, body["hostname"]) });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
