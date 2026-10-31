import "server-only";
import { readFeatureAvailability } from "./feature-availability";
import type { WorkspaceService } from "./service";
import { expenseKinds } from "@/features/planner-finance/domain/expense-budgets";

export function restrictedExpenseSources(
  workspaces: WorkspaceService,
  account: string,
  workspaceId: string,
) {
  const workspace = workspaces.requireWorkspace(account, workspaceId);
  return expenseKinds.filter(
    (kind) => !readFeatureAvailability(workspaces.db, kind, workspace.role, workspace).available,
  );
}
