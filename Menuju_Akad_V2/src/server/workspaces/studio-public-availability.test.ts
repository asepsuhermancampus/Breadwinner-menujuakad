import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { updateFeatureAvailability } from "./feature-availability";
import { createStudioDocument } from "@/features/invitation-studio/content/editor-content";
import { GET } from "@/app/studio-invitation/[workspaceId]/[projectId]/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({ service: null as WorkspaceService | null }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
it("keeps a published Studio invitation accessible while editing is restricted", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  const workspace = state.service.getOrCreateWorkspace("owner");
  const document = createStudioDocument();
  document.publication = "published";
  state.service.db
    .prepare("INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,0)")
    .run(
      workspace.id,
      "studio-drafts",
      JSON.stringify([{ id: "project", document, activeDocument: document }]),
    );
  updateFeatureAvailability(state.service.db, "admin", "studio-drafts", "owner", false, "Uji", 0);
  const response = await GET(new Request("http://localhost/studio-invitation/test/project"), {
    params: Promise.resolve({ workspaceId: workspace.id, projectId: "project" }),
  });
  expect(response.status).toBe(200);
  expect(await response.text()).toContain("Undangan untuk keluarga dan sahabat");
});
