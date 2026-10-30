import {
  applyFinanceRequest,
  emptyFinanceBook,
  financeBookSchema,
} from "@/features/planner-finance/domain/finance-ledger";
import type { FinanceBook, FinanceRequest } from "@/features/planner-finance/types/finance-ledger";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { TrialCommitResult, TrialSnapshot } from "../types";
import { removeBudgetSources } from "@/features/planner-finance/domain/remove-budget-sources";
import { affectedExpenseSources } from "../domain/finance-source-maintenance";
import type { ExpenseKind } from "@/features/planner-finance/domain/expense-budgets";
import { mergeVisibleBudgets } from "@/features/planner-finance/domain/expense-visibility";
export type TrialStoreEnvironment = {
  storage: Pick<Storage, "getItem" | "setItem">;
  lock?: (<T>(run: () => Promise<T>) => Promise<T>) | undefined;
  checkExpenseSources?: ((sources: ExpenseKind[]) => Promise<string | null>) | undefined;
  restrictedExpenseSources?: (() => Promise<ExpenseKind[]>) | undefined;
};
export function createTrialFinance(
  env: TrialStoreEnvironment,
  read: () => TrialSnapshot,
  notify: () => void,
  TRIAL_KEY: string,
) {
  return async (request: FinanceRequest): Promise<TrialCommitResult> => {
    try {
      if (!env.lock) throw Error("Penyimpanan browser tidak tersedia.");
      return await env.lock(async () => {
        const current = read();
        const book = current.resources.savings?.[0]
          ? (financeBookSchema.parse(current.resources.savings[0]) as FinanceBook)
          : emptyFinanceBook();
        let result;
        let effectiveCommand = request.command;
        try {
          const restricted = (await env.restrictedExpenseSources?.()) ?? [];
          const previous = (current.resources.finance ?? []) as CustomerBudget[];
          const command = request.command;
          const retry = book.receipts.some((receipt) => receipt.requestId === request.requestId);
          const target =
            "budgetId" in command ? previous.find((row) => row.id === command.budgetId) : undefined;
          if (
            !retry &&
            "budgetId" in command &&
            restricted.some(
              (kind) =>
                target?.source?.kind === kind || command.budgetId.startsWith(`expense:${kind}:`),
            )
          )
            throw new Error("Anggaran terkait belum tersedia.");
          const merged =
            !retry && command.type === "save-budgets"
              ? {
                  ...request,
                  command: {
                    ...command,
                    budgets: mergeVisibleBudgets(previous, command.budgets, restricted),
                  },
                }
              : request;
          effectiveCommand = merged.command;
          result = applyFinanceRequest(
            book,
            previous,
            { id: "trial-customer", name: "Akun percobaan" },
            merged,
            new Date().toISOString(),
            JSON.stringify(command),
          );
        } catch (cause) {
          const message =
            cause instanceof Error ? cause.message : "Perubahan belum dapat disimpan.";
          return {
            ok: false,
            reason: message.includes("berubah") ? "conflict" : "invalid",
            message,
          };
        }
        if (result.book.revision === book.revision)
          return { ok: true, snapshot: current, changed: false };
        const sources = affectedExpenseSources(
          effectiveCommand,
          (current.resources.finance ?? []) as CustomerBudget[],
        );
        const blocked = sources.length ? await env.checkExpenseSources?.(sources) : null;
        if (blocked) return { ok: false, reason: "invalid", message: blocked };
        const feature =
          request.command.type === "entry"
            ? "savings"
            : request.command.type === "claim"
              ? null
              : "finance";
        if (feature && (current.used[feature] ?? 0) >= 5)
          return {
            ok: false,
            reason: "limit",
            message: "Batas lima percobaan fitur tercapai. Masuk untuk melanjutkan.",
          };
        const snapshot = {
          ...current,
          revision: current.revision + 1,
          used: feature
            ? { ...current.used, [feature]: (current.used[feature] ?? 0) + 1 }
            : current.used,
          resources: {
            ...current.resources,
            ...removeBudgetSources(
              current.resources,
              (current.resources.finance ?? []) as CustomerBudget[],
              result.budgets,
            ),
            finance: result.budgets,
            savings: [result.book],
          },
        };
        env.storage.setItem(TRIAL_KEY, JSON.stringify(snapshot));
        notify();
        return { ok: true, snapshot, changed: true };
      });
    } catch (cause) {
      return {
        ok: false,
        reason: "storage",
        message: cause instanceof Error ? cause.message : "Browser gagal menyimpan transaksi.",
      };
    }
  };
}
