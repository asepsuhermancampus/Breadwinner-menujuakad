import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { capabilitiesFor } from "@/features/plans/domain/capabilities";
import { WorkspaceService } from "./service";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), workspaces: vi.fn() }));
vi.mock("server-only", () => ({}));
vi.mock("@/server/auth", () => ({ auth: mocks.auth }));
vi.mock("@/server/workspaces/runtime", () => ({ getWorkspaceService: mocks.workspaces }));
import { GET, PUT } from "@/app/api/workspace/resources/[kind]/route";

let database: PaymentDatabase;
let workspaces: WorkspaceService;
let workspaceId: string;
const owner = "premium-budget-origin-owner";
const context = { params: Promise.resolve({ kind: "finance" }) };
const budget = {
  id: "budget-origin",
  title: "Catatan anggaran Premium",
  amount: 1500000,
  purpose: "Dana gedung",
  notes: "Dana terkumpul untuk uang muka gedung.",
  priority: "Tinggi",
  dueDate: "2027-03-01",
  createdAt: "2026-10-26T03:00:00Z",
  completed: false,
};

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "development");
  database = new PaymentDatabase();
  database.reserveInvoice(owner, "production", "premium-origin-order", 149000);
  database
    .storage()
    .prepare("INSERT INTO subscription_grants VALUES(?,?,?,?,?,?,?)")
    .run(
      "premium-origin-grant",
      "premium-origin-order",
      owner,
      "premium",
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
      JSON.stringify(capabilitiesFor("premium")),
    );
  workspaces = new WorkspaceService(database.storage());
  workspaceId = workspaces.getOrCreateWorkspace(owner).id;
  mocks.workspaces.mockReturnValue(workspaces);
  mocks.auth.mockResolvedValue({ user: { email: "premium@example.test", ownerKey: owner } });
});

afterEach(() => {
  database.close();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

function request(origin = "http://localhost:3200", revision = 0) {
  return new Request(
    `http://0.0.0.0:3200/api/workspace/resources/finance?workspace=${workspaceId}`,
    {
      method: "PUT",
      headers: { origin, host: "localhost:3200", "Content-Type": "application/json" },
      body: JSON.stringify({ revision, data: [budget] }),
    },
  );
}

it("persists a Premium customer's budget from the browser origin while Next binds 0.0.0.0", async () => {
  expect(workspaces.requireWorkspace(owner, workspaceId).subscription.planId).toBe("premium");
  const saved = await PUT(request(), context);
  expect(saved.status).toBe(200);
  expect(await saved.json()).toEqual({ revision: 1 });

  const reloaded = await GET(
    new Request(`http://0.0.0.0:3200/api/workspace/resources/finance?workspace=${workspaceId}`),
    context,
  );
  expect(await reloaded.json()).toEqual({ revision: 1, data: [budget] });

  const stale = await PUT(request(), context);
  expect(stale.status).toBe(409);
});

it("rejects a hostile origin before authentication or any budget write", async () => {
  mocks.auth.mockClear();
  const denied = await PUT(request("http://hostile.invalid:3200"), context);
  expect(denied.status).toBe(403);
  expect(mocks.auth).not.toHaveBeenCalled();
  const stored = database
    .storage()
    .prepare("SELECT 1 FROM workspace_resources WHERE workspace_id=? AND kind='finance'")
    .get(workspaceId);
  expect(stored).toBeUndefined();
});
