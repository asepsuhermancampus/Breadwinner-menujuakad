import { z } from "zod";
import { getSuperadminSession } from "@/server/reviews/access";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readTaskMaintenance, updateTaskMaintenance } from "@/server/workspaces/task-maintenance";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";

export const runtime = "nodejs";
const input = z
  .object({
    status: z.enum(["active", "maintenance"]),
    reason: z.string().trim().min(1).max(500),
    version: z.number().int().nonnegative().safe(),
  })
  .strict();
export async function GET() {
  if (!(await getSuperadminSession()))
    return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const db = getWorkspaceService().db;
    const audit = db
      .prepare(
        "SELECT version,actor,old_status,new_status,reason,created_at FROM task_maintenance_audit ORDER BY version DESC LIMIT 20",
      )
      .all();
    return jsonResponse({ ...readTaskMaintenance(db), audit });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
export async function PATCH(request: Request) {
  const originError = validateSameOrigin(request);
  if (originError) return originError;
  const account = await getSuperadminSession();
  if (!account) return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const parsed = input.safeParse(await readBoundedJson(request, 4096));
    if (!parsed.success)
      return jsonResponse({ error: "Periksa status dan alasan perubahan." }, 400);
    const { status, reason, version } = parsed.data;
    return jsonResponse(
      updateTaskMaintenance(getWorkspaceService().db, account.id, status, reason, version),
    );
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
