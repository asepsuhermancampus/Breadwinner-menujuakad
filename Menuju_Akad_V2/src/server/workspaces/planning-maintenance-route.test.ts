import { expect, it, vi } from "vitest";
import type { Session } from "next-auth";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { GET, PATCH } from "@/app/api/superadmin/features/[feature]/route";
import { GET as publicStatus } from "@/app/api/workspace/feature-status/[feature]/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  session: null as Session | null,
  service: null as WorkspaceService | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
const context = (feature: string) => ({ params: Promise.resolve({ feature }) });
const request = (origin = "http://localhost") =>
  new Request("http://localhost/api/superadmin/features/calendar", {
    method: "PATCH",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify({ status: "maintenance", reason: "Pembaruan", version: 0 }),
  });
it("restricts changes to superadmin and publishes only registered feature status", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  state.session = null;
  expect((await GET(request(), context("calendar"))).status).toBe(401);
  state.session = {
    user: { id: "admin", email: "admin@example.test", role: "admin" },
    expires: "2099-01-01",
  };
  expect((await PATCH(request(), context("calendar"))).status).toBe(401);
  state.session = {
    user: { id: "super", email: "super@example.test", role: "superadmin" },
    expires: "2099-01-01",
  };
  expect((await PATCH(request("https://evil.example"), context("calendar"))).status).toBe(403);
  expect((await PATCH(request(), context("payments"))).status).toBe(404);
  expect((await PATCH(request(), context("calendar"))).status).toBe(200);
  expect((await PATCH(request(), context("calendar"))).status).toBe(409);
  expect(await (await publicStatus(request(), context("calendar"))).json()).toEqual({
    status: "maintenance",
  });
  expect((await publicStatus(request(), context("payments"))).status).toBe(404);
});
