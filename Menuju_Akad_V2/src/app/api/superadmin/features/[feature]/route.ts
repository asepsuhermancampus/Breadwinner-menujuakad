import { z } from "zod";
import { getSuperadminSession } from "@/server/reviews/access";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import {
  readPlanningMaintenance,
  updatePlanningMaintenance,
} from "@/server/workspaces/planning-maintenance";
import { isMaintainedPlanningFeature } from "@/features/customer-planning/domain/maintenance-catalog";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";
export const runtime = "nodejs";
type Context = { params: Promise<{ feature: string }> };
const input = z
  .object({
    status: z.enum(["active", "maintenance"]),
    reason: z.string().trim().min(1).max(500),
    version: z.number().int().nonnegative().safe(),
  })
  .strict();
export async function GET(_request: Request, context: Context) {
  if (!(await getSuperadminSession()))
    return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  const { feature } = await context.params;
  if (!isMaintainedPlanningFeature(feature))
    return jsonResponse({ error: "Fitur tidak ditemukan." }, 404);
  try {
    const db = getWorkspaceService().db;
    const audit = db
      .prepare(
        "SELECT version,actor,old_status,new_status,reason,created_at FROM planning_maintenance_audit WHERE feature=? ORDER BY version DESC LIMIT 20",
      )
      .all(feature);
    return jsonResponse({ ...readPlanningMaintenance(db, feature), audit });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
export async function PATCH(request: Request, context: Context) {
  const origin = validateSameOrigin(request);
  if (origin) return origin;
  const account = await getSuperadminSession();
  if (!account) return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  const { feature } = await context.params;
  if (!isMaintainedPlanningFeature(feature))
    return jsonResponse({ error: "Fitur tidak ditemukan." }, 404);
  try {
    const parsed = input.safeParse(await readBoundedJson(request, 4096));
    if (!parsed.success)
      return jsonResponse({ error: "Periksa status dan alasan perubahan." }, 400);
    return jsonResponse(
      updatePlanningMaintenance(
        getWorkspaceService().db,
        account.id,
        feature,
        parsed.data.status,
        parsed.data.reason,
        parsed.data.version,
      ),
    );
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
