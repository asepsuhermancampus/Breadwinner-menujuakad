import { validateSameOrigin, jsonResponse, handlePaymentApiError } from "@/server/payments/http";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { GuestRsvpService } from "@/server/workspaces/guest-rsvp";
import { getWorkspaceService } from "@/server/workspaces/runtime";
export const runtime = "nodejs";
export async function POST(req: Request, { params }: { params: Promise<{ token: string }> }) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  try {
    const { token } = await params,
      body = await readBoundedJson(req);
    if (typeof body.status !== "string" || typeof body.count !== "number")
      return jsonResponse({ error: "Konfirmasi tidak valid." }, 400);
    return jsonResponse({
      invitation: new GuestRsvpService(getWorkspaceService().db).respond(
        token,
        body.status,
        body.count,
      ),
    });
  } catch (e) {
    return handlePaymentApiError(e);
  }
}
