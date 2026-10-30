import "server-only";
import type { DatabaseSync } from "node:sqlite";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import {
  expenseKinds,
  type ExpenseResources,
} from "@/features/planner-finance/domain/expense-budgets";
import { removeBudgetSources } from "@/features/planner-finance/domain/remove-budget-sources";
import { readPlanningMaintenance } from "./planning-maintenance";
import { PaymentError } from "@/server/payments/errors";
export function removeWorkspaceBudgetSources(
  db: DatabaseSync,
  workspaceId: string,
  previous: CustomerBudget[],
  next: CustomerBudget[],
) {
  const sources: ExpenseResources = {};
  for (const kind of expenseKinds) {
    const row = db
      .prepare("SELECT data FROM workspace_resources WHERE workspace_id=? AND kind=?")
      .get(workspaceId, kind);
    sources[kind] = row ? (JSON.parse(String(row["data"])) as unknown[]) : [];
  }
  const updated = removeBudgetSources(sources, previous, next);
  for (const kind of expenseKinds) {
    if (updated[kind] !== sources[kind]) {
      if (readPlanningMaintenance(db, kind).status === "maintenance")
        throw new PaymentError(
          "Fitur terkait sedang dalam pemeliharaan. Perubahan belum disimpan.",
          503,
        );
      db.prepare(
        "UPDATE workspace_resources SET data=?,revision=revision+1 WHERE workspace_id=? AND kind=?",
      ).run(JSON.stringify(updated[kind]), workspaceId, kind);
    }
  }
}
