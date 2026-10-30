import { getWorkspaceService } from "@/server/workspaces/runtime";
import { readTaskMaintenance } from "@/server/workspaces/task-maintenance";
import { readFeatureAvailability } from "@/server/workspaces/feature-availability";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export function GET() {
  try {
    const db = getWorkspaceService().db;
    const status = readTaskMaintenance(db).status;
    return Response.json(
      {
        status: !readFeatureAvailability(db, "tasks", "guest", null).available ? "disabled" : status,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "Status tugas belum dapat diperiksa." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

