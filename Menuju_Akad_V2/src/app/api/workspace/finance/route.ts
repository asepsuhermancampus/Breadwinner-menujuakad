import { auth } from "@/server/auth";
import { ownerForSession } from "@/server/identity/policy";
import { jsonResponse, handlePaymentApiError, validateSameOrigin } from "@/server/payments/http";
import { readBoundedJson } from "@/server/payments/checkout-request";
import { PaymentError } from "@/server/payments/errors";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { FinanceService } from "@/server/workspaces/finance-service";
import { activeWorkspace } from "@/server/workspaces/active-workspace";
import { financeRequestSchema } from "@/features/planner-finance/domain/finance-ledger";
export const runtime = "nodejs";
async function sessionActor() {
  const session = await auth();
  if (!session?.user?.email?.trim()) throw new PaymentError("Sesi diperlukan.", 401);
  return {
    id: ownerForSession(session),
    name: session.user.name?.trim().slice(0, 160) || "Pasangan",
  };
}
export async function GET(req: Request) {
  try {
    const actor = await sessionActor();
    const workspace =
      new URL(req.url).searchParams.get("workspace") ?? (await activeWorkspace(actor.id)).id;
    return jsonResponse(new FinanceService(getWorkspaceService()).read(actor.id, workspace));
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
export async function POST(req: Request) {
  const origin = validateSameOrigin(req);
  if (origin) return origin;
  try {
    const actor = await sessionActor();
    const parsed = financeRequestSchema.safeParse(await readBoundedJson(req, 1048576));
    if (!parsed.success) throw new PaymentError("Perintah keuangan tidak valid.", 400);
    const workspace =
      new URL(req.url).searchParams.get("workspace") ?? (await activeWorkspace(actor.id)).id;
    return jsonResponse(
      new FinanceService(getWorkspaceService()).execute(actor, parsed.data, workspace),
    );
  } catch (error) {
    return handlePaymentApiError(error);
  }
}
