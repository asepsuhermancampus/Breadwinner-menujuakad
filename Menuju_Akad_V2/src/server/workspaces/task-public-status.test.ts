import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { updateTaskMaintenance } from "./task-maintenance";
import { updateFeatureAvailability } from "./feature-availability";
import { GET } from "@/app/api/workspace/task-status/route";
import { GET as planningStatus } from "@/app/api/workspace/feature-status/[feature]/route";
import { updatePlanningMaintenance } from "./planning-maintenance";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({ service: null as WorkspaceService | null }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
it("exposes only current task availability without audit or admin details", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  expect(await (await GET()).json()).toEqual({ status: "active" });
  updateTaskMaintenance(state.service.db, "admin", "maintenance", "internal reason", 0);
  const result = await GET();
  expect(result.headers.get("cache-control")).toContain("no-store");
  expect(await result.json()).toEqual({ status: "maintenance" });
});
it("reports emergency availability for trial users even during maintenance", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "emergency", "guest", false, "Uji", 0);
  updatePlanningMaintenance(state.service.db, "admin", "emergency", "maintenance", "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "emergency" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports calendar as unavailable to trial users during maintenance", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "calendar", "guest", false, "Uji", 0);
  updatePlanningMaintenance(state.service.db, "admin", "calendar", "maintenance", "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "calendar" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports moodboard unavailable for trial users", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "moodboard", "guest", false, "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "moodboard" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports documents unavailable for trial users", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "documents", "guest", false, "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "documents" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports rundown unavailable for trial users", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "rundown", "guest", false, "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "rundown" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports a restricted seserahan to trial users", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "seserahan", "guest", false, "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "seserahan" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports printable reports unavailable for trial users", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "pdf", "guest", false, "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "pdf" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports invitation editor unavailable for trial users", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "invitations", "guest", false, "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "invitations" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports Studio unavailable for trial users", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "studio-drafts", "guest", false, "Uji", 0);
  const response = await planningStatus(new Request("http://localhost"), {
    params: Promise.resolve({ feature: "studio-drafts" }),
  });
  expect(await response.json()).toEqual({ status: "disabled" });
});
it("reports when tasks are unavailable to trial users", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  updateFeatureAvailability(state.service.db, "admin", "tasks", "guest", false, "Uji", 0);
  expect(await (await GET()).json()).toEqual({ status: "disabled" });
  updateTaskMaintenance(state.service.db, "admin", "maintenance", "Perbaikan", 0);
  expect(await (await GET()).json()).toEqual({ status: "disabled" });
});
