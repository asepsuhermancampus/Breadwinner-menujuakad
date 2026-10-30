import { expect, it, vi } from "vitest";
import type { Session } from "next-auth";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { GET, POST } from "@/app/api/superadmin/feature-rollout/route";
vi.mock("server-only", () => ({}));
const state = vi.hoisted(() => ({
  session: null as Session | null,
  service: null as WorkspaceService | null,
}));
vi.mock("@/server/auth", () => ({ auth: async () => state.session }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: () => state.service! }));
const request = (body: unknown, origin = "http://localhost") =>
  new Request("http://localhost/api/superadmin/feature-rollout", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
it("only lets superadmins publish valid drafts with current revisions", async () => {
  const database = new PaymentDatabase();
  state.service = new WorkspaceService(database.storage());
  state.session = null;
  expect((await GET()).status).toBe(401);
  state.session = {
    user: { id: "root", email: "s@example.test", role: "superadmin" },
    expires: "2099-01-01",
  };
  const draft = {
    action: "draft",
    feature: "tasks",
    revision: 0,
    reason: "Percobaan",
    policy: { audiences: ["owner"], plans: ["free"], workspaces: [] },
  };
  expect((await POST(request(draft, "https://evil.example"))).status).toBe(403);
  expect((await POST(request({ ...draft, feature: "payments" }))).status).toBe(400);
  expect((await POST(request({ ...draft, policy: { ...draft.policy, workspaces: ["tidak-ada"] } }))).status).toBe(400);
  expect((await POST(request(draft))).status).toBe(200);
  expect((await POST(request(draft))).status).toBe(409);
  expect(
    (await POST(request({ action: "publish", feature: "tasks", revision: 1, scheduledAt: null })))
      .status,
  ).toBe(200);
  const result = await (await GET()).json();
  expect(result.releases.tasks.history[0].actor).toBe("root");
  database.close();
});

