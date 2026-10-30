import { expect, it, vi } from "vitest";
import type { Session } from "next-auth";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { GET, PATCH } from "@/app/api/superadmin/dashboard-cards/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  session: null as Session | null,
  service: null as WorkspaceService | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
const request = (
  origin = "http://localhost",
  body: unknown = { card: "tasks", audience: "guest", visible: false, reason: "Uji", version: 0 },
) =>
  new Request("http://localhost/api/superadmin/dashboard-cards", {
    method: "PATCH",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
it("only accepts validated, same-origin changes from superadmins", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  state.session = null;
  expect((await GET()).status).toBe(401);
  state.session = {
    user: { id: "admin", email: "a@example.test", role: "admin" },
    expires: "2099-01-01",
  };
  expect((await PATCH(request())).status).toBe(401);
  state.session = {
    user: { id: "super", email: "s@example.test", role: "superadmin" },
    expires: "2099-01-01",
  };
  expect((await PATCH(request("https://evil.example"))).status).toBe(403);
  expect(
    (
      await PATCH(
        request("http://localhost", {
          card: "payments",
          audience: "guest",
          visible: false,
          reason: "x",
          version: 0,
        }),
      )
    ).status,
  ).toBe(400);
  expect((await PATCH(request())).status).toBe(200);
  expect((await PATCH(request())).status).toBe(409);
});
