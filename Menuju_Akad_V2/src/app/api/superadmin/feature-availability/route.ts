import { z } from "zod";
import { getSuperadminSession } from "@/server/reviews/access";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import {
  readFeatureAvailability,
  updateFeatureAvailability,
} from "@/server/workspaces/feature-availability";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";
import { controllableFeatures } from "@/features/customer-workspace/domain/feature-availability-catalog";
export const runtime = "nodejs";
const features = controllableFeatures;
const input = z
  .object({
    feature: z.enum(features),
    audience: z.enum(["guest", "owner", "partner"]),
    available: z.boolean(),
    reason: z.string().trim().min(1).max(500),
    version: z.number().int().nonnegative().safe(),
  })
  .strict();
export async function GET() {
  if (!(await getSuperadminSession()))
    return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const db = getWorkspaceService().db;
    const settings = features.flatMap((feature) =>
      (["guest", "owner", "partner"] as const).map((audience) => ({
        feature,
        audience,
        ...readFeatureAvailability(db, feature, audience),
      })),
    );
    const audit = db
      .prepare(
        "SELECT feature,audience,actor,new_available,reason,version,created_at FROM feature_availability_audit ORDER BY id DESC LIMIT 30",
      )
      .all();
    return jsonResponse({ settings, audit });
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
    const { feature, audience, available, reason, version } = parsed.data;
    return jsonResponse(
      updateFeatureAvailability(
        getWorkspaceService().db,
        account.id,
        feature,
        audience,
        available,
        reason,
        version,
      ),
    );
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
