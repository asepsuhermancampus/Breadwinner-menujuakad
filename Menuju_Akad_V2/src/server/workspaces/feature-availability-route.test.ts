import { expect, it, vi } from "vitest";
import type { Session } from "next-auth";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { GET, PATCH } from "@/app/api/superadmin/feature-availability/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  session: null as Session | null,
  service: null as WorkspaceService | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
function request(
  origin = "http://localhost",
  body: unknown = {
    feature: "tasks",
    audience: "guest",
    available: false,
    reason: "Uji",
    version: 0,
  },
) {
  return new Request("http://localhost/api/superadmin/feature-availability", {
    method: "PATCH",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}
it("requires superadmin and same origin, validates changes, and rejects stale versions", async () => {
  state.service = new WorkspaceService(new PaymentDatabase().storage());
  state.session = null;
  expect((await GET()).status).toBe(401);
  state.session = {
    user: { id: "admin", email: "a@example.test", role: "admin" },
    expires: "2099-01-01",
  };
  expect((await PATCH(request())).status).toBe(401);
  state.session = {
    user: { id: "root", email: "s@example.test", role: "superadmin" },
    expires: "2099-01-01",
  };
  expect((await PATCH(request("https://evil.example"))).status).toBe(403);
  expect(
    (
      await PATCH(
        request("http://localhost", {
          feature: "payments",
          audience: "guest",
          available: false,
          reason: "Uji",
          version: 0,
        }),
      )
    ).status,
  ).toBe(400);
  expect(
    (
      await PATCH(
        request("http://localhost", {
          feature: "unknown-feature",
          audience: "owner",
          available: false,
          reason: "Uji",
          version: 0,
        }),
      )
    ).status,
  ).toBe(400);
  expect((await PATCH(request())).status).toBe(200);
  expect((await PATCH(request())).status).toBe(409);
  expect(
    (
      await PATCH(
        request("http://localhost", {
          feature: "emergency",
          audience: "partner",
          available: false,
          reason: "Uji perlengkapan",
          version: 0,
        }),
      )
    ).status,
  ).toBe(200);
  const result = await (await GET()).json();
  expect(result.settings.some((item: { feature: string }) => item.feature === "seserahan")).toBe(
    true,
  );
  expect(result.settings).toContainEqual({
    feature: "tasks",
    audience: "guest",
    available: false,
    version: 1,
  });
  expect(result.settings).toContainEqual({
    feature: "emergency",
    audience: "partner",
    available: false,
    version: 1,
  });
  expect(result.audit).toHaveLength(2);
});
