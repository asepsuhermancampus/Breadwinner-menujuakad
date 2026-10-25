import {
  requireAuthOwner,
  jsonResponse,
  NO_CACHE_HEADERS,
  handlePaymentApiError,
} from "@/server/payments/http";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { ResourceService } from "@/server/workspaces/resource-service";
import { buildPrintableReport } from "@/server/workspaces/pdf-report";
import { activeWorkspace } from "@/server/workspaces/active-workspace";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const service = getWorkspaceService(),
      workspace = await activeWorkspace(auth.owner);
    if (!workspace.subscription.capabilities.includes("pdf"))
      return jsonResponse({ error: "Ekspor PDF tersedia pada Premium dan Lifetime" }, 403);
    const resources = new ResourceService(service);
    const data = Object.fromEntries(
      (["guests", "tasks", "finance", "documents"] as const).map((kind) => [
        kind,
        resources.readResource(auth.owner, kind, workspace.id).data,
      ]),
    );
    return new Response(buildPrintableReport(workspace.profile.fullName, data), {
      headers: {
        ...NO_CACHE_HEADERS,
        "Content-Type": "text/html; charset=utf-8",
        "Content-Security-Policy":
          "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'",
      },
    });
  } catch (cause) {
    return handlePaymentApiError(cause);
  }
}
