import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "@/server/workspaces/service";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), workspaces: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: mocks.auth }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: mocks.workspaces }));
import { GET, POST } from "./route";
let db: PaymentDatabase;
let workspace: string;
beforeEach(() => {
  db = new PaymentDatabase();
  const service = new WorkspaceService(db.storage());
  workspace = service.getOrCreateWorkspace("a").id;
  mocks.workspaces.mockReturnValue(service);
  mocks.auth.mockResolvedValue({ user: { email: "a@example.test", ownerKey: "a", name: "Andi" } });
});
afterEach(() => {
  db.close();
  vi.clearAllMocks();
});
function request(command: unknown, origin = "http://localhost:3200") {
  return new Request(`http://localhost:3200/api/workspace/finance?workspace=${workspace}`, {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(command),
  });
}
it("authenticates server actor and denies hostile origins and spoofed actor fields", async () => {
  expect(
    (
      await POST(
        request(
          { revision: 0, requestId: "claim", command: { type: "claim", side: "groom" } },
          "https://evil.test",
        ),
      )
    ).status,
  ).toBe(403);
  expect(mocks.auth).not.toHaveBeenCalled();
  expect(
    (
      await POST(
        request({
          revision: 0,
          requestId: "claim",
          actor: "other",
          command: { type: "claim", side: "groom" },
        }),
      )
    ).status,
  ).toBe(400);
  const claimed = await POST(
    request({ revision: 0, requestId: "claim", command: { type: "claim", side: "groom" } }),
  );
  expect(claimed.status).toBe(200);
  expect((await claimed.json()).members).toEqual([
    { actorId: "a", actorName: "Andi", side: "groom" },
  ]);
  const stale = await POST(
    request({ revision: 0, requestId: "stale", command: { type: "claim", side: "bride" } }),
  );
  expect(stale.status).toBe(409);
  expect(
    (await GET(new Request(`http://localhost:3200/api/workspace/finance?workspace=${workspace}`)))
      .status,
  ).toBe(200);
});
