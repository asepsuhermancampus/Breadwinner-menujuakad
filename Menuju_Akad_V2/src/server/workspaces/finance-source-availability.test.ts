import { expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { controllableFeatures } from "@/features/customer-workspace/domain/feature-availability-catalog";
import { WorkspaceService } from "./service";
import { FinanceService } from "./finance-service";
import { ResourceService } from "./resource-service";
import { updateFeatureAvailability } from "./feature-availability";
import { defaultCateringSettings } from "@/features/customer-planning/domain/catering-settings";
vi.mock("server-only", () => ({}));

it("keeps a restricted linked budget intact while allowing edits to other budgets", () => {
  const features = controllableFeatures as unknown as string[];
  const inserted = !features.includes("seserahan");
  if (inserted) features.push("seserahan");
  const database = new PaymentDatabase();
  try {
    const workspaces = new WorkspaceService(database.storage());
    const workspace = workspaces.getOrCreateWorkspace("owner");
    const resources = new ResourceService(workspaces);
    const finance = new FinanceService(workspaces);
    resources.writeResource(
      "owner",
      "seserahan",
      0,
      [{ id: "gift", title: "Hadiah pribadi", quantity: 1, unitCost: 100 }],
      workspace.id,
    );
    const actor = { id: "owner", name: "Owner" };
    finance.execute(
      actor,
      { revision: 0, requestId: "claim", command: { type: "claim", side: "groom" } },
      workspace.id,
    );
    finance.execute(
      actor,
      {
        revision: 1,
        requestId: "deposit",
        command: {
          type: "entry",
          side: "groom",
          direction: "add",
          amount: 300,
          source: "Tabungan",
          notes: "",
        },
      },
      workspace.id,
    );
    finance.execute(
      actor,
      {
        revision: 2,
        requestId: "allocate",
        command: { type: "allocate", side: "groom", budgetId: "expense:seserahan:gift" },
      },
      workspace.id,
    );
    const prior = finance.read("owner", workspace.id);
    const priorRequest = {
      revision: prior.revision,
      requestId: "retry-before-restrict",
      command: { type: "save-budgets" as const, budgets: prior.budgets },
    };
    const before = finance.execute(actor, priorRequest, workspace.id);
    updateFeatureAvailability(database.storage(), "root", "seserahan", "owner", false, "Uji", 0);
    const restricted = finance.read("owner", workspace.id);
    expect(restricted.budgets).toEqual([]);
    expect(resources.readResource("owner", "finance", workspace.id).data).toEqual([]);
    expect(restricted.balances).toEqual(before.balances);
    expect(restricted.entries.map((entry) => entry.kind)).toEqual(["deposit"]);
    expect(restricted.allocations).toEqual([]);
    expect(restricted.hiddenActivity).toBe(true);
    expect(finance.execute(actor, priorRequest, workspace.id).revision).toBe(before.revision);
    const request = {
      revision: restricted.revision,
      requestId: "save-visible",
      command: {
        type: "save-budgets" as const,
        budgets: [{ id: "manual", title: "Gedung", amount: 200 }],
      },
    };
    const result = finance.execute(actor, request, workspace.id);
    expect(result.budgets.map((b) => b.id)).toEqual(["manual"]);
    expect(finance.execute(actor, request, workspace.id).revision).toBe(result.revision);
    const visible = resources.readResource("owner", "finance", workspace.id);
    expect(() =>
      resources.writeResource(
        "owner",
        "finance",
        visible.revision,
        [{ id: "expense:seserahan:gift", title: "Ubah", amount: 1 }],
        workspace.id,
      ),
    ).toThrow(/tersedia/i);
    resources.writeResource(
      "owner",
      "finance",
      visible.revision,
      [...visible.data, { id: "manual-2", title: "Aula", amount: 50 }],
      workspace.id,
    );
    updateFeatureAvailability(
      database.storage(),
      "root",
      "seserahan",
      "owner",
      true,
      "Pulihkan",
      1,
    );
    const restored = finance.read("owner", workspace.id);
    expect(restored.budgets.map((b) => b.title)).toEqual(["Hadiah pribadi", "Gedung", "Aula"]);
    expect(restored.allocations).toHaveLength(1);
    expect(restored.entries.map((entry) => entry.kind)).toEqual(["deposit", "allocation"]);
  } finally {
    database.close();
    if (inserted) features.splice(features.indexOf("seserahan"), 1);
  }
});

it("protects catering calculation settings when catering is restricted", () => {
  const features = controllableFeatures as unknown as string[];
  const inserted = !features.includes("catering");
  if (inserted) features.push("catering");
  const database = new PaymentDatabase();
  try {
    const workspaces = new WorkspaceService(database.storage());
    const workspace = workspaces.getOrCreateWorkspace("owner");
    const resources = new ResourceService(workspaces);
    resources.writeResource(
      "owner",
      "catering-settings",
      0,
      [defaultCateringSettings],
      workspace.id,
    );
    updateFeatureAvailability(database.storage(), "root", "catering", "owner", false, "Uji", 0);
    expect(() => resources.readResource("owner", "catering-settings", workspace.id)).toThrow(
      /tersedia/i,
    );
    expect(() =>
      resources.writeResource("owner", "catering-settings", 1, [], workspace.id),
    ).toThrow(/tersedia/i);
    updateFeatureAvailability(database.storage(), "root", "catering", "owner", true, "Pulihkan", 1);
    expect(resources.readResource("owner", "catering-settings", workspace.id).data).toEqual([
      defaultCateringSettings,
    ]);
  } finally {
    database.close();
    if (inserted) features.splice(features.indexOf("catering"), 1);
  }
});

it("filters linked budgets only for the restricted partner", () => {
  const database = new PaymentDatabase();
  try {
    const workspaces = new WorkspaceService(database.storage());
    const workspace = workspaces.getOrCreateWorkspace("owner");
    database
      .storage()
      .prepare("INSERT INTO workspace_members(workspace_id,account,role) VALUES(?,?,'partner')")
      .run(workspace.id, "partner");
    const resources = new ResourceService(workspaces);
    resources.writeResource(
      "owner",
      "seserahan",
      0,
      [{ id: "gift", title: "Hadiah", quantity: 1, unitCost: 100 }],
      workspace.id,
    );
    updateFeatureAvailability(database.storage(), "root", "seserahan", "partner", false, "Uji", 0);
    const finance = new FinanceService(workspaces);
    expect(finance.read("partner", workspace.id).budgets).toEqual([]);
    expect(finance.read("owner", workspace.id).budgets).toHaveLength(1);
    expect(resources.readResource("partner", "finance", workspace.id).data).toEqual([]);
    expect(resources.readResource("owner", "finance", workspace.id).data).toHaveLength(1);
  } finally {
    database.close();
  }
});
