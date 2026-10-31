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
import { readPlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const auth = await requireAuthOwner(req);
  if ("errorResponse" in auth) return auth.errorResponse;
  try {
    const service = getWorkspaceService(),
      workspace = await activeWorkspace(auth.owner);
    if (!workspace.subscription.capabilities.includes("pdf"))
      return jsonResponse({ error: "Ekspor PDF tersedia pada Premium dan Lifetime" }, 403);
    if (!readFeatureAvailability(service.db, "pdf", workspace.role, workspace).available)
      return jsonResponse({ error: "Ringkasan cetak belum tersedia untuk akun ini." }, 403);
    if (readPlanningMaintenance(service.db, "pdf").status === "maintenance")
      return jsonResponse({ error: "Ringkasan cetak sedang dalam pemeliharaan." }, 503);
    const resources = new ResourceService(service);
    const data = Object.fromEntries(
      (["guests", "tasks", "finance", "documents"] as const)
        .filter(
          (kind) =>
            (kind !== "tasks" && kind !== "documents" && kind !== "guests" && kind !== "finance") ||
            readFeatureAvailability(service.db, kind, workspace.role, workspace).available,
        )
        .map((kind) => [kind, resources.readResource(auth.owner, kind, workspace.id).data]),
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
