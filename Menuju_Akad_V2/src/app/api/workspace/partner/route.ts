import { activeWorkspace } from "@/server/workspaces/active-workspace";
import { cookies } from "next/headers";
import {
  requireAuthOwner,
  jsonResponse,
  handlePaymentApiError,
  validateSameOrigin,
} from "@/server/payments/http";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { MembershipService } from "@/server/workspaces/membership-service";
import { readBoundedJson } from "@/server/payments/checkout-request";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const token = new URL(req.url).searchParams.get("token");
    if (token)
      return jsonResponse({
        invite: new MembershipService(getWorkspaceService()).previewInvite(auth.owner, token),
      });
    return jsonResponse({
      workspaces: new MembershipService(getWorkspaceService()).listMemberships(auth.owner),
    });
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
    const body = await readBoundedJson(req),
      service = new MembershipService(getWorkspaceService());
    if (body["action"] === "invite")
      return jsonResponse(
        service.invitePartner(auth.owner, (await activeWorkspace(auth.owner)).id),
      );
    if (body["action"] === "revoke") {
      service.revokePartner(auth.owner, (await activeWorkspace(auth.owner)).id);
      return jsonResponse({ ok: true });
    }
    if (body["action"] === "own") {
      (await cookies()).set(
        "ma-workspace",
        getWorkspaceService().getOrCreateWorkspace(auth.owner).id,
        { path: "/", httpOnly: true, sameSite: "lax" },
      );
      return jsonResponse({ ok: true });
    }
    if (
      (body["action"] === "accept" && typeof body["token"] === "string") ||
      (body["action"] === "select" && typeof body["workspaceId"] === "string")
    ) {
      const result =
        body["action"] === "select"
          ? {
              workspaceId: getWorkspaceService().requireWorkspace(
                auth.owner,
                body["workspaceId"] as string,
              ).id,
            }
          : service.acceptPartnerInvite(auth.owner, body["token"] as string, {
              fullName: body["fullName"],
              nickname: body["nickname"],
            });
      (await cookies()).set("ma-workspace", result.workspaceId, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: new URL(req.url).protocol === "https:",
        maxAge: 86400,
      });
      return jsonResponse(result);
    }
    return jsonResponse({ error: "Aksi pasangan tidak valid" }, 400);
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
