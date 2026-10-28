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
it("rejects generic completion before the first ledger read while allowing ordinary CRUD and legacy rows", () => {
  const resources = new ResourceService(workspaces);
  const budget = { id: "b", title: "Gedung", amount: 50 };
  expect(() =>
    resources.writeResource("a", "finance", 0, [{ ...budget, completed: true }], workspace),
  ).toThrow("alokasi");
  expect(resources.readResource("a", "finance", workspace)).toEqual({ revision: 0, data: [] });
  resources.writeResource("a", "finance", 0, [budget], workspace);
  expect(() =>
    resources.writeResource("a", "finance", 1, [{ ...budget, completed: true }], workspace),
  ).toThrow("alokasi");
  resources.writeResource("a", "finance", 1, [{ ...budget, notes: "Catatan" }], workspace);
  resources.writeResource("a", "finance", 2, [], workspace);
  expect(db.storage().prepare("SELECT * FROM workspace_finance").all()).toHaveLength(0);
  db.storage()
    .prepare("UPDATE workspace_resources SET data=? WHERE workspace_id=? AND kind='finance'")
    .run(JSON.stringify([{ ...budget, completed: true }]), workspace);
  expect(() =>
    resources.writeResource(
      "a",
      "finance",
      3,
      [{ ...budget, completed: true, notes: "Legacy" }],
      workspace,
    ),
  ).not.toThrow();
});
it("requires membership and denies revoked members without initializing their ledger", () => {
  expect(() => service.read("stranger", workspace)).toThrow();
  expect(db.storage().prepare("SELECT * FROM workspace_finance").all()).toHaveLength(0);
  db.storage().prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(workspace, "b");
  service.read("b", workspace);
  db.storage().prepare("DELETE FROM workspace_members WHERE account='b'").run();
  expect(() => service.read("b", workspace)).toThrow();
});
it("releases revoked role bindings while retaining immutable actor history", () => {
  db.storage().prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(workspace, "b");
  service.execute(
    { id: "b", name: "Risa" },
    { revision: 0, requestId: "claim-b", command: { type: "claim", side: "bride" } },
    workspace,
  );
  service.execute(
    { id: "b", name: "Risa" },
    {
      revision: 1,
      requestId: "deposit-b",
      command: {
        type: "entry",
        side: "bride",
        direction: "add",
        amount: 50,
        source: "Gaji",
        notes: "",
      },
    },
    workspace,
  );
  db.storage().prepare("DELETE FROM workspace_members WHERE account='b'").run();
  db.storage().prepare("INSERT INTO workspace_members VALUES(?,?,'partner')").run(workspace, "c");
  const available = service.read("c", workspace);
  expect(available.members.map((m) => ({ actorId: m.actorId, side: m.side }))).toEqual([
    { actorId: "a", side: "groom" },
    { actorId: "c", side: "bride" },
  ]);
  expect(available.actorSide).toBe("bride");
  expect(available.revision).toBe(3);
  expect(service.read("c", workspace).revision).toBe(3);
  expect(available.entries[0]!.actorId).toBe("b");
  const persisted = JSON.parse(
    String(
      db
        .storage()
        .prepare("SELECT data FROM workspace_finance WHERE workspace_id=?")
        .get(workspace)!["data"],
    ),
  );
  expect(persisted.receipts).toHaveLength(2);
  const claimed = service.execute(
    { id: "c", name: "Pengganti" },
    {
      revision: available.revision,
      requestId: "claim-c",
      command: {
        type: "entry",
        side: "bride",
        direction: "add",
        amount: 1,
        source: "Gaji",
        notes: "",
      },
    },
    workspace,
  );
  expect(claimed.actorSide).toBe("bride");
  expect(claimed.entries[0]!.actorId).toBe("b");
  expect(claimed.balances.bride).toBe(51);
});
