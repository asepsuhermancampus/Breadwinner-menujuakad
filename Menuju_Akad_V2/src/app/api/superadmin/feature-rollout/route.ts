import { z } from "zod";
import { getSuperadminSession } from "@/server/reviews/access";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";
import { controllableFeatures } from "@/features/customer-workspace/domain/feature-availability-catalog";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import {
  defaultRollout,
  policyAllows,
  publishRollout,
  readRollout,
  rollbackRollout,
  rolloutAllowed,
  saveRolloutDraft,
} from "@/server/workspaces/feature-rollout";
import { rolloutDependencyWarnings } from "@/server/workspaces/feature-rollout-dependencies";
export const runtime = "nodejs";
const feature = z.enum(controllableFeatures);
const audience = z.enum(["guest", "owner", "partner"]);
const plan = z.enum(["free", "premium", "lifetime"]);
const policy = z
  .object({
    audiences: z.array(audience).min(1).max(3),
    plans: z.array(plan).min(1).max(3),
    workspaces: z.array(z.string().trim().min(1).max(128)).max(500),
  })
  .strict();
const common = { feature, revision: z.number().int().nonnegative().safe() };
const input = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("draft"),
      ...common,
      policy,
      reason: z.string().trim().min(1).max(500),
    })
    .strict(),
  z
    .object({
      action: z.literal("publish"),
      ...common,
      scheduledAt: z.string().datetime().nullable(),
    })
    .strict(),
  z
    .object({
      action: z.literal("rollback"),
      ...common,
      target: z.number().int().nonnegative().safe(),
      reason: z.string().trim().min(1).max(500),
    })
    .strict(),
  z
    .object({
      action: z.literal("preview"),
      feature,
      audience,
      plan,
      workspaceId: z.string().max(128).nullable(),
    })
    .strict(),
]);
export async function GET() {
  if (!(await getSuperadminSession()))
    return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const db = getWorkspaceService().db;
    const releases = Object.fromEntries(
      controllableFeatures.map((item) => {
        const release = readRollout(db, item);
        return [
          item,
          {
            ...release,
            warnings: release.draft ? rolloutDependencyWarnings(db, item, release.draft) : [],
          },
        ];
      }),
    );
    const workspaces = db
      .prepare("SELECT id,full_name FROM customer_workspaces ORDER BY rowid DESC")
      .all();
    return jsonResponse({ releases, workspaces });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
export async function POST(request: Request) {
  const origin = validateSameOrigin(request);
  if (origin) return origin;
  const account = await getSuperadminSession();
  if (!account) return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const parsed = input.safeParse(await readBoundedJson(request, 65536));
    if (!parsed.success) return jsonResponse({ error: "Periksa data rilis." }, 400);
    const data = parsed.data,
      db = getWorkspaceService().db;
    if (data.action === "draft") {
      const workspaceExists = db.prepare("SELECT 1 FROM customer_workspaces WHERE id=?");
      if (data.policy.workspaces.some((id) => !workspaceExists.get(id)))
        return jsonResponse({ error: "Workspace sasaran tidak ditemukan." }, 400);
      return jsonResponse(
        saveRolloutDraft(db, account.id, data.feature, data.policy, data.reason, data.revision),
      );
    }
    if (data.action === "publish")
      return jsonResponse(
        publishRollout(db, account.id, data.feature, data.revision, data.scheduledAt),
      );
    if (data.action === "rollback")
      return jsonResponse(
        rollbackRollout(db, account.id, data.feature, data.target, data.reason, data.revision),
      );
    const draft = readRollout(db, data.feature).draft ?? defaultRollout;
    const context = { audience: data.audience, plan: data.plan, workspaceId: data.workspaceId };
    const base = readFeatureAvailability(db, data.feature, data.audience).available;
    return jsonResponse({
      allowed: policyAllows(draft, context) && base,
      current: rolloutAllowed(db, data.feature, context) && base,
    });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
