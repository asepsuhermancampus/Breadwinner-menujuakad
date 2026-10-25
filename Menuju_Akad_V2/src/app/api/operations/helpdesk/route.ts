import { auth } from "@/server/auth";
import { isOperator } from "@/server/identity/policy";
import { jsonResponse, handlePaymentApiError } from "@/server/payments/http";
import { getWorkspaceService } from "@/server/workspaces/runtime";
export const runtime = "nodejs";
export async function GET() {
  const session = await auth();
  if (!session?.user?.email || !isOperator(session))
    return jsonResponse({ error: "Akses petugas diperlukan" }, 403);
  try {
    const tickets = getWorkspaceService()
      .db.prepare(
        "SELECT id,message,priority,created_at FROM customer_support ORDER BY CASE WHEN priority='priority' THEN 0 ELSE 1 END,created_at ASC LIMIT 500",
      )
      .all();
    return jsonResponse({ tickets });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
