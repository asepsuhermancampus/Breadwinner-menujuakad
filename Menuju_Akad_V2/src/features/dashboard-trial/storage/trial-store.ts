import { createTrialFinance, type TrialStoreEnvironment } from "./trial-finance-commit";
import {
  createDocumentTemplate,
  preservesMainDocuments,
  type DocumentItem,
} from "@/features/kua-documents/domain/document-template";
import type { TrialCommitResult, TrialResourceKind } from "../types";
import { parseTrial } from "../domain/trial-snapshot";
import { validateTrialData } from "../domain/trial-validation";
import {
  financeBookSchema,
  assertBudgetChanges,
} from "@/features/planner-finance/domain/finance-ledger";
import type { FinanceBook } from "@/features/planner-finance/types/finance-ledger";
import type { CustomerBudget } from "@/features/planner-finance/types/customer-budget";
import { removeLegacyDocumentDefaults } from "@/features/kua-documents/domain/legacy-document-defaults";
import { syncTrialExpenseResources } from "../domain/trial-expense-budgets";
export const TRIAL_KEY = "menuju-akad:guest-trial:v2";
export const TRIAL_LOCK = "menuju-akad:guest-trial:v1";
export function createTrialStore(env: TrialStoreEnvironment) {
  const read = () => {
    const value = parseTrial(env.storage.getItem(TRIAL_KEY) ?? env.storage.getItem(TRIAL_LOCK));
    if (value.resources.documents === undefined)
      value.resources.documents = createDocumentTemplate();
    value.resources.documents = removeLegacyDocumentDefaults(
      value.resources.documents as DocumentItem[],
    );
    value.documentTemplate = 1;
    value.resources = syncTrialExpenseResources(value.resources);
    return value;
  };
  const listeners = new Set<() => void>();
  const notify = () => listeners.forEach((listener) => listener());
  return {
    read,
    notify,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    finance: createTrialFinance(env, read, notify, TRIAL_KEY),
    async consumeExport(expectedRevision: number): Promise<TrialCommitResult> {
      try {
        if (!env.lock) throw Error("Penyimpanan browser tidak tersedia.");
        return await env.lock(async () => {
          const current = read();
          if (current.revision !== expectedRevision)
            return { ok: false, reason: "conflict", message: "Data berubah. Coba kembali." };
          if ((current.used.pdf ?? 0) >= 5)
            return {
              ok: false,
              reason: "limit",
              message: "Lima ekspor sudah digunakan. Masuk untuk melanjutkan.",
            };
          const snapshot = {
            ...current,
            revision: current.revision + 1,
            used: { ...current.used, pdf: (current.used.pdf ?? 0) + 1 },
          };
          env.storage.setItem(TRIAL_KEY, JSON.stringify(snapshot));
          notify();
          return { ok: true, snapshot, changed: true };
        });
      } catch {
        return {
          ok: false,
          reason: "storage",
          message: "Ekspor belum tersimpan. Periksa penyimpanan browser.",
        };
      }
    },
    async commit(
      kind: TrialResourceKind,
      value: unknown[],
      expectedRevision: number,
    ): Promise<TrialCommitResult> {
      try {
        if (!env.lock)
          throw new Error(
            "Browser ini belum mendukung penyimpanan trial yang aman. Silakan masuk untuk melanjutkan.",
          );
        return await env.lock(async (): Promise<TrialCommitResult> => {
          const current = read();
          if (kind === "savings")
            return {
              ok: false,
              reason: "invalid",
              message: "Gunakan tombol transaksi untuk mengubah tabungan.",
            };
          let data: unknown[];
          try {
            data = validateTrialData(kind, value);
            if (
              kind === "documents" &&
              !preservesMainDocuments(
                (current.resources.documents ?? []) as DocumentItem[],
                data as DocumentItem[],
              )
            )
              throw new Error(
                "Berkas utama hanya dapat dicentang atau dilepas sebagai satu template. Isinya tidak dapat diubah satu per satu.",
              );
          } catch (cause) {
            return { ok: false, reason: "invalid", message: (cause as Error).message };
          }
          let financeBook: FinanceBook | null = null;
          if (kind === "finance") {
            financeBook = current.resources.savings?.[0]
              ? (financeBookSchema.parse(current.resources.savings[0]) as FinanceBook)
              : null;
            try {
              assertBudgetChanges(
                (current.resources.finance ?? []) as CustomerBudget[],
                data as CustomerBudget[],
                financeBook?.allocations ?? [],
              );
            } catch (cause) {
              return {
                ok: false,
                reason: "invalid",
                message: cause instanceof Error ? cause.message : "Perubahan anggaran tidak valid.",
              };
            }
          }
          if (JSON.stringify(current.resources[kind] ?? []) === JSON.stringify(data))
            return { ok: true, snapshot: current, changed: false };
          const checked = (items: unknown[]) =>
            items.filter((v) => (v as { completed?: boolean }).completed).length;
          const over =
            kind === "documents"
              ? checked(data) > 5 &&
                data.some((v) => {
                  const row = v as { id: string; completed?: boolean };
                  return (
                    row.completed &&
                    !(current.resources.documents ?? []).some((old) => {
                      const previous = old as { id: string; completed?: boolean };
                      return previous.id === row.id && previous.completed;
                    })
                  );
                })
              : (current.used[kind] ?? 0) >= 5;
          if (over)
            return {
              ok: false,
              reason: "limit",
              message:
                "Batas lima percobaan atau lima checklist aktif tercapai. Masuk untuk melanjutkan.",
            };
          if (current.revision !== expectedRevision)
            return {
              ok: false,
              reason: "conflict",
              message: "Data berubah di tab lain. Periksa data terbaru sebelum menyimpan kembali.",
            };
          const snapshot = {
            ...current,
            revision: current.revision + 1,
            used:
              kind === "documents"
                ? current.used
                : { ...current.used, [kind]: (current.used[kind] ?? 0) + 1 },
            resources: syncTrialExpenseResources(
              {
                ...current.resources,
                [kind]: data,
                ...(financeBook
                  ? { savings: [{ ...financeBook, revision: financeBook.revision + 1 }] }
                  : {}),
              },
              new Date().toISOString(),
            ),
          };
          env.storage.setItem(TRIAL_KEY, JSON.stringify(snapshot));
          notify();
          return { ok: true, snapshot, changed: true };
        });
      } catch (cause) {
        return {
          ok: false,
          reason: "storage",
          message:
            cause instanceof Error
              ? cause.message
              : "Browser gagal menyimpan trial. Silakan masuk untuk melanjutkan.",
        };
      }
    },
  };
}
