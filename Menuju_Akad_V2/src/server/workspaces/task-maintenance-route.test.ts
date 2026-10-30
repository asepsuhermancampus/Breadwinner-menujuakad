import { beforeEach, expect, it, vi } from "vitest";
import type { Session } from "next-auth";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { GET, PATCH } from "@/app/api/superadmin/features/tasks/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  session: null as Session | null,
  service: null as WorkspaceService | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
beforeEach(() => {
  state.session = null;
  state.service = new WorkspaceService(new PaymentDatabase().storage());
});
const request = (
  origin = "http://localhost:3200",
  body = { status: "maintenance", reason: "Pembaruan", version: 0 },
) =>
  new Request("http://localhost:3200/api/superadmin/features/tasks", {
    method: "PATCH",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
function session(role: "customer" | "admin" | "superadmin") {
  state.session = {
    user: { id: "id-1", email: "user@example.test", role },
    expires: new Date(Date.now() + 60000).toISOString(),
  };
}
it("allows only superadmin to change status and rejects cross-origin, stale, and invalid requests", async () => {
  expect((await GET()).status).toBe(401);
  for (const role of ["customer", "admin"] as const) {
    session(role);
    expect((await PATCH(request())).status).toBe(401);
  }
  session("superadmin");
  expect((await PATCH(request("https://evil.example"))).status).toBe(403);
  expect(
    (await PATCH(request("http://localhost:3200", { status: "hidden", reason: "x", version: 0 })))
      .status,
  ).toBe(400);
  expect((await PATCH(request())).status).toBe(200);
  expect((await PATCH(request())).status).toBe(409);
  expect(await (await GET()).json()).toMatchObject({ status: "maintenance", version: 1 });
});
