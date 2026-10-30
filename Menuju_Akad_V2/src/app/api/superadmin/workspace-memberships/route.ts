import { z } from "zod";
import { getSuperadminSession } from "@/server/reviews/access";
import { getAccounts } from "@/server/identity/runtime";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import {
  cancelAdminInvite,
  listAdminMemberships,
  revokeAdminPartner,
} from "@/server/workspaces/admin-membership";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { handlePaymentApiError, jsonResponse, validateSameOrigin } from "@/server/payments/http";
export const runtime = "nodejs";
const revoke = z
  .object({
    workspaceId: z.string().min(1).max(160),
    target: z.string().min(1).max(160),
    revision: z.number().int().nonnegative().safe(),
    reason: z.string().trim().min(1).max(500),
  })
  .strict();
const cancel = z
  .object({
    action: z.literal("cancel_invite"),
    workspaceId: z.string().min(1).max(160),
    invite: z.string().regex(/^[a-f0-9]{64}$/),
    reason: z.string().trim().min(1).max(500),
  })
  .strict();
export async function GET(request: Request) {
  if (!(await getSuperadminSession()))
    return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const id = new URL(request.url).searchParams.get("account");
    if (!id || id.length > 160) return jsonResponse({ error: "Akun tidak ditemukan." }, 404);
    const account = getAccounts().db.prepare("SELECT owner_key FROM accounts WHERE id=?").get(id);
    if (!account) return jsonResponse({ error: "Akun tidak ditemukan." }, 404);
    const db = getWorkspaceService().db;
    const key = String(account.owner_key);
    const history = db
      .prepare(
        `SELECT workspace_id,actor,target,action,reason,created_at FROM workspace_membership_audit
      WHERE target=? OR workspace_id IN (SELECT id FROM customer_workspaces WHERE owner=?) ORDER BY id DESC LIMIT 30`,
      )
      .all(key, key);
    const findAccount = getAccounts().db.prepare("SELECT email FROM accounts WHERE owner_key=?");
    const memberships = listAdminMemberships(db, key).map((membership) => ({
      ...membership,
      partnerEmail: membership.partner
        ? String(findAccount.get(membership.partner)?.email ?? "Akun tidak tersedia")
        : null,
    }));
    return jsonResponse({
      memberships,
      history: history.map((entry) => ({
        ...entry,
        targetEmail: String(findAccount.get(String(entry.target))?.email ?? "Akun tidak tersedia"),
      })),
    });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
export async function POST(request: Request) {
  const origin = validateSameOrigin(request);
  if (origin) return origin;
  const actor = await getSuperadminSession();
  if (!actor) return jsonResponse({ error: "Silakan masuk sebagai superadmin." }, 401);
  try {
    const parsed = z.union([revoke, cancel]).safeParse(await readBoundedJson(request, 4096));
    if (!parsed.success)
      return jsonResponse({ error: "Periksa anggota dan alasan perubahan." }, 400);
    const data = parsed.data;
    if ("action" in data)
      cancelAdminInvite(
        getWorkspaceService().db,
        actor.id,
        data.workspaceId,
        data.invite,
        data.reason,
      );
    else
      revokeAdminPartner(
        getWorkspaceService().db,
        actor.id,
        data.workspaceId,
        data.target,
        data.reason,
        data.revision,
      );
    return jsonResponse({ ok: true });
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
