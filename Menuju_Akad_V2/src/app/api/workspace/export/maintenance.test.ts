import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "@/server/workspaces/service";
import { updatePlanningMaintenance } from "@/server/workspaces/planning-maintenance";
import { updateFeatureAvailability } from "@/server/workspaces/feature-availability";
import { ResourceService } from "@/server/workspaces/resource-service";
import { GET } from "./route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({ service: null as WorkspaceService | null }));
vi.mock("@/server/auth", () => ({
  auth: async () => ({ user: { email: "owner@example.test", ownerKey: "owner" } }),
}));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
vi.mock("@/server/workspaces/active-workspace", () => ({
  activeWorkspace: async () => ({
    id: state.service!.getOrCreateWorkspace("owner").id,
    role: "owner",
    profile: { fullName: "Owner" },
    subscription: { capabilities: ["pdf"] },
  }),
}));
it("blocks export during maintenance without deleting workspace data", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updatePlanningMaintenance(state.service.db, "admin", "pdf", "maintenance", "Perbaikan", 0);
  const response = await GET(new Request("http://localhost/api/workspace/export"));
  expect(response.status).toBe(503);
  expect((await response.json()).error).toMatch(/pemeliharaan/i);
  expect(state.service.getOrCreateWorkspace("owner").id).toBeTruthy();
});
it("blocks export when the audience cannot use printable reports", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "pdf", "owner", false, "Uji", 0);
  const response = await GET(new Request("http://localhost/api/workspace/export"));
  expect(response.status).toBe(403);
  expect(state.service.getOrCreateWorkspace("owner").id).toBeTruthy();
});
it("omits unavailable tasks from an otherwise permitted export", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  const workspace = state.service.getOrCreateWorkspace("owner");
  state.service.db
    .prepare("INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,1)")
    .run(workspace.id, "tasks", JSON.stringify([{ title: "Rahasia tugas" }]));
  updateFeatureAvailability(state.service.db, "admin", "tasks", "owner", false, "Uji", 0);
  const response = await GET(new Request("http://localhost/api/workspace/export"));
  expect(response.status).toBe(200);
  const report = await response.text();
  expect(report).not.toContain("Rahasia tugas");
  expect(report).not.toContain("Checklist tugas");
  expect(report).toContain("Daftar tamu");
});
it("omits unavailable documents from an otherwise permitted export", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  const workspace = state.service.getOrCreateWorkspace("owner");
  state.service.db
    .prepare("INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,1)")
    .run(workspace.id, "documents", JSON.stringify([{ title: "Berkas pribadi" }]));
  updateFeatureAvailability(state.service.db, "admin", "documents", "owner", false, "Uji", 0);
  const response = await GET(new Request("http://localhost/api/workspace/export"));
  expect(response.status).toBe(200);
  const report = await response.text();
  expect(report).not.toContain("Berkas pribadi");
  expect(report).not.toContain("<h2>Dokumen</h2>");
  expect(report).toContain("Daftar tamu");
});
it("omits unavailable guests from an otherwise permitted export", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  const workspace = state.service.getOrCreateWorkspace("owner");
  state.service.db
    .prepare("INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,?,?,1)")
    .run(workspace.id, "guests", JSON.stringify([{ name: "Tamu pribadi" }]));
  updateFeatureAvailability(state.service.db, "admin", "guests", "owner", false, "Uji", 0);
  const response = await GET(new Request("http://localhost/api/workspace/export"));
  expect(response.status).toBe(200);
  const report = await response.text();
  expect(report).not.toContain("Tamu pribadi");
  expect(report).not.toContain("Daftar tamu");
});
it("omits a linked budget from the account report when its source is restricted", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  const workspace = state.service.getOrCreateWorkspace("owner");
  new ResourceService(state.service).writeResource(
    "owner",
    "seserahan",
    0,
    [{ id: "gift", title: "Hadiah rahasia", quantity: 1, unitCost: 100 }],
    workspace.id,
  );
  updateFeatureAvailability(state.service.db, "admin", "seserahan", "owner", false, "Uji", 0);
  const response = await GET(new Request("http://localhost/api/workspace/export"));
  expect(response.status).toBe(200);
  expect(await response.text()).not.toContain("Hadiah rahasia");
});
