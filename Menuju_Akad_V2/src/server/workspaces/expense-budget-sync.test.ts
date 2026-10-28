import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { FinanceService } from "./finance-service";
vi.mock("server-only", () => ({}));
let db: PaymentDatabase, resources: ResourceService, finance: FinanceService, id: string;
const menu = {
  id: "menu-a",
  title: "Nasi putih",
  portions: 10,
  unitCost: 10000,
  mode: "unit",
  category: "buffet",
  vendor: "Dapur",
  notes: "Tanpa pedas",
};
beforeEach(() => {
  db = new PaymentDatabase();
  const service = new WorkspaceService(db.storage());
  id = service.getOrCreateWorkspace("owner").id;
  resources = new ResourceService(service);
  finance = new FinanceService(service);
});
afterEach(() => db.close());
it("rejects forged linked fields and direct deletion but permits budget metadata changes", () => {
  resources.writeResource("owner", "catering", 0, [menu], id);
  const current = resources.readResource("owner", "finance", id);
  const row = current.data[0] as { id: string; source: unknown };
  for (const patch of [
    { amount: 1 },
    { title: "Forged" },
    { category: "Gedung" },
    { source: undefined },
  ])
    expect(() =>
      resources.writeResource("owner", "finance", current.revision, [{ ...row, ...patch }], id),
    ).toThrow();
  expect(() => resources.writeResource("owner", "finance", current.revision, [], id)).toThrow();
  resources.writeResource(
    "owner",
    "finance",
    current.revision,
    [{ ...row, priority: "Tinggi", purpose: "Pelunasan" }],
    id,
  );
  const fresh = finance.read("owner", id);
  expect(fresh.budgets[0]).toMatchObject({
    priority: "Tinggi",
    purpose: "Pelunasan",
  });
  const claimed = finance.execute(
    { id: "owner", name: "Owner" },
    {
      revision: fresh.revision,
      requestId: "claim-owner",
      command: { type: "claim", side: "groom" },
    },
    id,
  );
  const deleted = finance.execute(
    { id: "owner", name: "Owner" },
    {
      revision: claimed.revision,
      requestId: "forge-delete",
      command: { type: "delete-budget", budgetId: row.id },
    },
    id,
  );
  expect(deleted.budgets).toEqual([]);
  expect(resources.readResource("owner", "catering", id).data).toEqual([]);
  expect(finance.read("owner", id).budgets).toEqual([]);
});
it("synchronizes saved catering into one categorized budget and updates details without duplicates", () => {
  resources.writeResource("owner", "catering", 0, [menu], id);
  const first = finance.read("owner", id);
  expect(first.budgets).toHaveLength(1);
  expect(first.budgets[0]).toMatchObject({
    title: "Nasi putih",
    amount: 100000,
    category: "Katering",
    completed: false,
    source: { kind: "catering", id: "menu-a" },
  });
  expect(first.budgets[0]?.sourceDetails).toContain("Dapur");
  expect(first.budgets[0]?.notes).toBe("Tanpa pedas");
  resources.writeResource("owner", "catering", 1, [{ ...menu, portions: 20 }], id);
  const changed = finance.read("owner", id);
  expect(changed.budgets).toHaveLength(1);
  expect(changed.budgets[0]?.id).toBe(first.budgets[0]?.id);
  expect(changed.budgets[0]?.amount).toBe(200000);
  expect(finance.read("owner", id).revision).toBe(changed.revision);
  resources.writeResource("owner", "catering", 2, [], id);
  expect(finance.read("owner", id).budgets).toEqual([]);
});
it("backfills existing expenses and keeps manual budgets while linking seserahan prices", () => {
  resources.writeResource(
    "owner",
    "finance",
    0,
    [{ id: "manual", title: "Gedung", amount: 1000 }],
    id,
  );
  db.storage()
    .prepare(
      "INSERT INTO workspace_resources(workspace_id,kind,data,revision) VALUES(?,'catering',?,1)",
    )
    .run(id, JSON.stringify([menu]));
  resources.writeResource(
    "owner",
    "seserahan",
    0,
    [{ id: "gift", title: "Sepatu", quantity: 2, unitCost: 50000 }],
    id,
  );
  const rows = resources.readResource("owner", "finance", id).data;
  expect(rows).toHaveLength(3);
  expect(rows).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: "manual" }),
      expect.objectContaining({ category: "Seserahan", amount: 100000 }),
    ]),
  );
});
it("protects allocated catering costs atomically and supports release before source changes", () => {
  resources.writeResource("owner", "catering", 0, [menu], id);
  let state = finance.read("owner", id);
  const run = (command: Parameters<FinanceService["execute"]>[1]["command"]) => {
    state = finance.execute(
      { id: "owner", name: "Owner" },
      { revision: state.revision, requestId: `request-${state.revision}`, command },
      id,
    );
  };
  run({ type: "claim", side: "groom" });
  run({
    type: "entry",
    side: "groom",
    direction: "add",
    amount: 500000,
    source: "Gaji",
    notes: "",
  });
  const budget = state.budgets[0]!;
  run({ type: "allocate", budgetId: budget.id, side: "groom" });
  expect(() =>
    resources.writeResource("owner", "catering", 1, [{ ...menu, unitCost: 20000 }], id),
  ).toThrow();
  expect(() => resources.writeResource("owner", "catering", 1, [], id)).toThrow();
  expect(resources.readResource("owner", "catering", id).data).toEqual([menu]);
  expect(finance.read("owner", id).balances.groom).toBe(400000);
  run({ type: "release", budgetId: budget.id });
  resources.writeResource("owner", "catering", 1, [{ ...menu, unitCost: 20000 }], id);
  expect(finance.read("owner", id).budgets[0]).toMatchObject({ amount: 200000, completed: false });
  expect(finance.read("owner", id).balances.groom).toBe(500000);
  expect(() =>
    finance.execute(
      { id: "owner", name: "Owner" },
      {
        revision: state.revision,
        requestId: "stale-allocation",
        command: { type: "allocate", budgetId: budget.id, side: "groom" },
      },
      id,
    ),
  ).toThrow("Data telah berubah");
});
