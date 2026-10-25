import { createDocumentTemplate } from "@/features/kua-documents/domain/document-template";
import type { TrialCommitResult, TrialResourceKind } from "../types";
import { parseTrial } from "../domain/trial-snapshot";
import { validateTrialData } from "../domain/trial-validation";
export const TRIAL_KEY = "menuju-akad:guest-trial:v2";
export const TRIAL_LOCK = "menuju-akad:guest-trial:v1";
type Environment = {
  storage: Pick<Storage, "getItem" | "setItem">;
  lock?: (<T>(run: () => Promise<T>) => Promise<T>) | undefined;
};
export function createTrialStore(env: Environment) {
  const read = () => {
    const value = parseTrial(env.storage.getItem(TRIAL_KEY) ?? env.storage.getItem(TRIAL_LOCK));
    if (value.resources.documents === undefined)
      value.resources.documents = createDocumentTemplate();
    value.documentTemplate = 1;
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
          let data: unknown[];
          try {
            data = validateTrialData(kind, value);
          } catch (cause) {
            return { ok: false, reason: "invalid", message: (cause as Error).message };
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
            resources: { ...current.resources, [kind]: data },
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
