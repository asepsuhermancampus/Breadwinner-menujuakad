import {
  applyFinanceRequest,
  emptyFinanceBook,
  financeBookSchema,
} from "@/features/planner-finance/domain/finance-ledger";
import type { FinanceBook, FinanceRequest } from "@/features/planner-finance/types/finance-ledger";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import type { TrialCommitResult, TrialSnapshot } from "../types";
export type TrialStoreEnvironment = {
  storage: Pick<Storage, "getItem" | "setItem">;
  lock?: (<T>(run: () => Promise<T>) => Promise<T>) | undefined;
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
        try {
          result = applyFinanceRequest(
            book,
            (current.resources.finance ?? []) as CustomerBudget[],
            { id: "trial-customer", name: "Akun percobaan" },
            request,
            new Date().toISOString(),
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
          resources: { ...current.resources, finance: result.budgets, savings: [result.book] },
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
