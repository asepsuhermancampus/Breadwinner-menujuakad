import type { FinanceContext, FinanceState } from "../types/admin-finance";
import { failure, financeGuard, success } from "./finance-guards";
import { redactFinanceText } from "./finance-redaction";

export function appendFinanceCorrection(
  state: FinanceState,
  linkedId: string,
  reason: string,
  context: FinanceContext,
) {
  const blocked = financeGuard(context, "settings");
  if (blocked) return failure(state, blocked);
  const original = state.audit.find((entry) => entry.id === linkedId);
  if (!original || !reason.trim())
    return failure(state, "Pilih event asli dan isi alasan koreksi.");
  const entry = {
    ...original,
    id: `AUD-${state.audit.length + 1}`,
    linkedId,
    at: new Date(context.now()).toISOString(),
    actor: context.actorId,
    action: "audit.correction",
    reason: redactFinanceText(reason.trim()),
    result: "Klarifikasi ditambahkan; histori asli tetap.",
  };
  return success(
    { ...state, audit: [...state.audit, entry] },
    "Koreksi ditautkan sebagai event baru.",
  );
}
export function exportFinanceAudit(state: FinanceState, context: FinanceContext) {
  const blocked = financeGuard(context, "export");
  if (blocked) return { ok: false, csv: "", message: blocked };
  const quote = (value: string) =>
    `"${redactFinanceText(value)
      .replace(/"/g, '""')
      .replace(/^[=+@-]/, "'")}"`;
  const rows = state.audit.map((entry) =>
    [
      entry.id,
      entry.at,
      entry.actor,
      entry.objectId,
      entry.action,
      entry.result,
      entry.reason,
      entry.linkedId ?? "",
    ]
      .map(quote)
      .join(","),
  );
  return {
    ok: true,
    csv: ["id,at,actor,object,action,result,reason,linked_event", ...rows].join("\n"),
    message: "Ekspor audit mock dibatasi dan disamarkan.",
  };
}
