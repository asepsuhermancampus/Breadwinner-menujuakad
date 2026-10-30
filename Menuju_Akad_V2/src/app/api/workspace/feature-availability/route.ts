import { dashboardContext } from "@/app/_components/dashboard-context";
import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";
import {
  availabilityFeatures,
  type AvailabilityFeature,
} from "@/features/customer-workspace/domain/feature-availability-catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  try {
    const access = await dashboardContext();
    const audience = access.mode === "guest" ? "guest" : access.workspace.role;
    const db = getWorkspaceService().db;
    const settings = Object.fromEntries(
      (Object.keys(availabilityFeatures) as AvailabilityFeature[]).map((feature) => [
        feature,
        readFeatureAvailability(db, feature, audience, access.mode === "guest" ? null : access.workspace).available,
      ]),
    );
    return Response.json(settings, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { error: "Ketersediaan fitur belum dapat diperiksa." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

