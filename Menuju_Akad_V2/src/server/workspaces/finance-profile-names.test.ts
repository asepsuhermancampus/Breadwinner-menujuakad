import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { PaymentDatabase } from "@/server/payments/db";
import { WorkspaceService } from "./service";
import { FinanceService } from "./finance-service";
import type { FinanceCommand } from "@/features/planner-finance/types/finance-ledger";
vi.mock("server-only", () => ({}));
let db: PaymentDatabase, workspaces: WorkspaceService, finance: FinanceService, workspace: string;
beforeEach(() => {
  db = new PaymentDatabase();
  workspaces = new WorkspaceService(db.storage());
  finance = new FinanceService(workspaces);
  workspace = workspaces.saveProfile("female-owner", {
    fullName: "Risa Lengkap",
    partnerName: "Andi Lengkap",
    nickname: "Ica",
    partnerNickname: "Andi",
  }).id;
  db.storage()
    .prepare("INSERT INTO workspace_members VALUES(?,?,'partner')")
    .run(workspace, "male-partner");
});
afterEach(() => db.close());
const run = (actorId: string, command: FinanceCommand) => {
  const revision = finance.read(actorId, workspace).revision;
  return finance.execute(
    { id: actorId, name: "Nama Sesi" },
    { revision, requestId: `r${revision}`, command },
    workspace,
  );
};
it("maps a female owner to bride and infers the unclaimed partner side", () => {
  expect(finance.read("female-owner", workspace).sideNames).toEqual({
    groom: "Pasangan pria",
    bride: "Pasangan wanita",
  });
  const claimed = run("female-owner", { type: "claim", side: "bride" });
  expect(claimed.sideNames).toEqual({ groom: "Andi", bride: "Ica" });
  expect(claimed.members[0]?.actorName).toBe("Ica");
  expect(workspaces.getOrCreateWorkspace("female-owner").ownerSide).toBe("bride");
});
it("infers owner side from partner binding, refreshes current names, and preserves revoked history", () => {
  expect(run("male-partner", { type: "claim", side: "groom" }).sideNames).toEqual({
    groom: "Andi",
    bride: "Ica",
  });
  expect(workspaces.requireWorkspace("male-partner", workspace).ownerSide).toBe("bride");
  run("male-partner", {
    type: "entry",
    side: "groom",
    direction: "add",
    amount: 50,
    source: "Gaji",
    notes: "",
  });
  const stored = db
    .storage()
    .prepare("SELECT data FROM workspace_finance WHERE workspace_id=?")
    .get(workspace)!["data"];
  workspaces.saveProfile("female-owner", {
    fullName: "Risa Lengkap",
    partnerName: "Andi Lengkap",
    nickname: "Risa",
    partnerNickname: "Didi",
  });
  const renamed = finance.read("female-owner", workspace);
  expect(renamed.sideNames).toEqual({ groom: "Didi", bride: "Risa" });
  expect(renamed.entries[0]?.actorName).toBe("Didi");
  expect(
    db.storage().prepare("SELECT data FROM workspace_finance WHERE workspace_id=?").get(workspace)![
      "data"
    ],
  ).toBe(stored);
  db.storage().prepare("DELETE FROM workspace_members WHERE account='male-partner'").run();
  expect(finance.read("female-owner", workspace).entries[0]?.actorName).toBe("Nama Sesi");
});
