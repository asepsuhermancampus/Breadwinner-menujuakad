import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { ResourceService } from "./resource-service";
import { FinanceService } from "./finance-service";
import { updatePlanningMaintenance } from "./planning-maintenance";
import { updateFeatureAvailability } from "./feature-availability";
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
it("preserves linked budgets while seserahan is restricted", () => {
  const item = { id: "gift", title: "Sepatu", quantity: 1, unitCost: 10000 };
  resources.writeResource("owner", "seserahan", 0, [item], id);
  const before = finance.read("owner", id);
  updateFeatureAvailability(db.storage(), "root", "seserahan", "owner", false, "Uji", 0);
  expect(finance.read("owner", id).budgets).toHaveLength(0);
  expect(() => resources.readResource("owner", "seserahan", id)).toThrow(/tersedia/i);
  updateFeatureAvailability(db.storage(), "root", "seserahan", "owner", true, "Pulihkan", 1);
  expect(finance.read("owner", id).budgets).toEqual(before.budgets);
  expect(resources.readResource("owner", "seserahan", id).data).toEqual([item]);
});
it.each(["catering", "seserahan"] as const)(
  "preserves %s data when a linked budget is deleted during maintenance",
  (kind) => {
    const item =
      kind === "catering" ? menu : { id: "gift", title: "Sepatu", quantity: 1, unitCost: 10000 };
    resources.writeResource("owner", kind, 0, [item], id);
    const before = finance.read("owner", id);
    updatePlanningMaintenance(db.storage(), "admin", kind, "maintenance", "Perbaikan", 0);
    expect(() =>
      finance.execute(
        { id: "owner", name: "Owner" },
        {
          revision: before.revision,
          requestId: "delete-source",
          command: { type: "delete-budget", budgetId: before.budgets[0]!.id },
        },
        id,
      ),
    ).toThrow(/pemeliharaan/i);
    expect(resources.readResource("owner", kind, id).data).toEqual([item]);
    expect(finance.read("owner", id).budgets).toHaveLength(1);
  },
);
it("deletes linked sources atomically, refunds allocations once and preserves other items", () => {
  resources.writeResource("owner", "catering", 0, [menu, { ...menu, id: "keep" }], id);
  let state = finance.read("owner", id);
  const run = (command: Parameters<FinanceService["execute"]>[1]["command"]) => {
    const request = { revision: state.revision, requestId: `delete-${state.revision}`, command };
    state = finance.execute({ id: "owner", name: "Owner" }, request, id);
    return request;
  };
  const budgetId = state.budgets[0]!.id;
  run({ type: "claim", side: "groom" });
  run({
    type: "entry",
    side: "groom",
    direction: "add",
    amount: 200000,
    source: "Gaji",
    notes: "",
  });
  run({ type: "allocate", budgetId, side: "groom" });
  const stale = {
    revision: state.revision - 1,
    requestId: "stale-delete",
    command: { type: "delete-budget" as const, budgetId },
  };
  expect(() => finance.execute({ id: "owner", name: "Owner" }, stale, id)).toThrow("berubah");
  expect(resources.readResource("owner", "catering", id).data).toHaveLength(2);
  const request = run({ type: "delete-budget", budgetId });
  expect(state.balances.groom).toBe(200000);
  expect(state.allocations).toEqual([]);
  expect(state.entries.filter((item) => item.kind === "reversal")).toHaveLength(1);
  expect(resources.readResource("owner", "catering", id).data).toEqual([{ ...menu, id: "keep" }]);
  expect(resources.readResource("owner", "catering", id).revision).toBe(2);
  state = finance.execute({ id: "owner", name: "Owner" }, request, id);
  expect(state.entries.filter((item) => item.kind === "reversal")).toHaveLength(1);
  expect(finance.read("owner", id).budgets).toHaveLength(1);
});
it("deletes a linked source before an account has connected its savings side", () => {
  resources.writeResource(
    "owner",
    "seserahan",
    0,
    [{ id: "gift", title: "Sepatu", quantity: 1, unitCost: 10000 }],
    id,
  );
  const state = finance.read("owner", id);
  finance.execute(
    { id: "owner", name: "Owner" },
    {
      revision: state.revision,
      requestId: "delete-gift",
      command: { type: "delete-budget", budgetId: state.budgets[0]!.id },
    },
    id,
  );
  expect(resources.readResource("owner", "seserahan", id).data).toEqual([]);
  expect(finance.read("owner", id).budgets).toEqual([]);
});
