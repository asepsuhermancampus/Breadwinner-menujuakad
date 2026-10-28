import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { FinanceService } from "./finance-service";
import { ResourceService } from "./resource-service";
vi.mock("server-only", () => ({}));
let db: PaymentDatabase;
let workspaces: WorkspaceService;
let service: FinanceService;
let workspace: string;
beforeEach(() => {
  db = new PaymentDatabase();
  workspaces = new WorkspaceService(db.storage());
  workspace = workspaces.getOrCreateWorkspace("a").id;
  service = new FinanceService(workspaces);
});
afterEach(() => db.close());
it("rolls back failed commands and guards the generic budget API", () => {
  const resources = new ResourceService(workspaces);
  resources.writeResource(
    "a",
    "finance",
    0,
    [{ id: "budget", title: "Gedung", amount: 80 }],
    workspace,
  );
  service.execute(
    { id: "a", name: "Andi" },
    { revision: 0, requestId: "claim", command: { type: "claim", side: "groom" } },
    workspace,
  );
  service.execute(
    { id: "a", name: "Andi" },
    {
      revision: 1,
      requestId: "deposit",
      command: {
        type: "entry",
        side: "groom",
        direction: "add",
        amount: 100,
        source: "Gaji",
        notes: "",
      },
    },
    workspace,
  );
  const funded = service.execute(
    { id: "a", name: "Andi" },
    {
      revision: 2,
      requestId: "fund",
      command: { type: "allocate", side: "groom", budgetId: "budget" },
    },
    workspace,
  );
  expect(funded.balances.groom).toBe(20);
  expect(() => resources.writeResource("a", "finance", 2, [], workspace)).toThrow();
  expect(service.read("a", workspace)).toEqual(funded);
  expect(() =>
    service.execute(
      { id: "a", name: "Andi" },
      {
        revision: 3,
        requestId: "bad",
        command: {
          type: "entry",
          side: "groom",
          direction: "subtract",
          amount: 30,
          source: "",
          notes: "Belanja",
        },
      },
      workspace,
    ),
  ).toThrow();
  expect(service.read("a", workspace)).toEqual(funded);
  resources.writeResource(
    "a",
    "finance",
    2,
    [{ ...funded.budgets[0], notes: "Uang muka" }],
    workspace,
  );
  expect(service.read("a", workspace).revision).toBe(4);
});
it("rolls back ledger insert when the atomic budget write fails", () => {
  const actor = { id: "a", name: "Andi" };
  service.execute(
    actor,
    { revision: 0, requestId: "claim", command: { type: "claim", side: "groom" } },
    workspace,
  );
  db.storage().exec(
    "CREATE TRIGGER fail_finance BEFORE INSERT ON workspace_resources BEGIN SELECT RAISE(ABORT, 'write failed'); END",
  );
  expect(() =>
    service.execute(
      actor,
      {
        revision: 1,
        requestId: "save",
        command: { type: "save-budgets", budgets: [{ id: "b", title: "Gedung", amount: 20 }] },
      },
      workspace,
    ),
  ).toThrow("write failed");
  expect(service.read("a", workspace).revision).toBe(1);
  expect(service.read("a", workspace).budgets).toEqual([]);
});
it("preserves resource revision on deposits, retries, and unclaimed legacy completed budgets", () => {
  db.storage()
    .prepare(
      "INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,'finance',?,1)",
    )
    .run(workspace, JSON.stringify([{ id: "old", title: "Legacy", completed: true, amount: 50 }]));
  const actor = { id: "a", name: "Andi" };
  const request = {
    revision: 0,
    requestId: "claim",
    command: { type: "claim" as const, side: "groom" as const },
  };
  service.execute(actor, request, workspace);
  const retry = service.execute(actor, request, workspace);
  expect(retry.revision).toBe(1);
  expect(retry.balances.total).toBe(0);
  expect(new ResourceService(workspaces).readResource("a", "finance", workspace).revision).toBe(1);
  const released = service.execute(
    actor,
    { revision: 1, requestId: "release-old", command: { type: "release", budgetId: "old" } },
    workspace,
  );
  expect(released.entries).toEqual([]);
  expect(released.budgets[0]!.completed).toBe(false);
});
