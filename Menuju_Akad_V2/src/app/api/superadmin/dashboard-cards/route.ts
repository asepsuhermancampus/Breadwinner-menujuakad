import { z } from "zod";
import { getSuperadminSession } from "@/server/reviews/access";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readDashboardCards, updateDashboardCard } from "@/server/workspaces/dashboard-cards";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";
export const runtime = "nodejs";
const input = z
  .object({
    card: z.enum(["tasks", "documents", "budget", "guests", "priorities", "quick-links"]),
    audience: z.enum(["guest", "owner", "partner"]),
    visible: z.boolean(),
    reason: z.string().trim().min(1).max(500),
    version: z.number().int().nonnegative().safe(),
  })
  .strict();
export async function GET() {
  if (!(await getSuperadminSession()))
    return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const db = getWorkspaceService().db;
    const cards = (["guest", "owner", "partner"] as const).flatMap((audience) =>
      readDashboardCards(db, audience),
    );
    const audit = db
      .prepare(
        "SELECT card,audience,actor,old_visible,new_visible,reason,version,created_at FROM dashboard_card_audit ORDER BY id DESC LIMIT 30",
      )
      .all();
    return jsonResponse({ cards, audit });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
export async function PATCH(request: Request) {
  const origin = validateSameOrigin(request);
  if (origin) return origin;
  const account = await getSuperadminSession();
  if (!account) return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const parsed = input.safeParse(await readBoundedJson(request, 4096));
    if (!parsed.success)
      return jsonResponse({ error: "Periksa pengaturan dan alasan perubahan." }, 400);
    const { card, audience, visible, reason, version } = parsed.data;
    return jsonResponse(
      updateDashboardCard(
        getWorkspaceService().db,
        account.id,
        card,
        audience,
        visible,
        reason,
        version,
      ),
    );
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
