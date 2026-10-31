import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readPlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { isMaintainedPlanningFeature } from "@/features/customer-planning/domain/maintenance-catalog";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import { isAvailabilityFeature } from "@/features/customer-workspace/domain/feature-availability-catalog";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(_request: Request, context: { params: Promise<{ feature: string }> }) {
  const headers = { "Cache-Control": "no-store" };
  const { feature } = await context.params;
  if (feature !== "vendors" && !isMaintainedPlanningFeature(feature))
    return Response.json({ error: "Fitur tidak ditemukan." }, { status: 404, headers });
  try {
    const db = getWorkspaceService().db;
    const status =
      feature === "vendors"
        ? readFeatureAvailability(db, "vendors", "guest", null).available
          ? "active"
          : "disabled"
        : isAvailabilityFeature(feature) &&
            !readFeatureAvailability(db, feature, "guest", null).available
          ? "disabled"
          : readPlanningMaintenance(db, feature).status;
    return Response.json({ status }, { headers });
  } catch {
    return Response.json(
      { error: "Status fitur belum dapat diperiksa." },
      { status: 503, headers },
    );
  }
}
