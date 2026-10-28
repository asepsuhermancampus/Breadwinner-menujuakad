import type { FinanceEntry, FinanceSnapshot, SavingsSide } from "../types/finance-ledger";
import { formatRupiah } from "./rupiah";
import { savingsName } from "./savings-name";

function escape(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
}

function timestamp(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : `${date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "long", timeStyle: "medium" })} WIB`;
}

function entryCell(entry: FinanceEntry | undefined): string {
  if (!entry) return '<td class="empty">—</td>';
  const kind = {
    deposit: "Setoran",
    withdrawal: "Pengurangan",
    allocation: "Alokasi anggaran",
    reversal: "Pengembalian anggaran",
  }[entry.kind];
  return `<td><div class="entry-head"><time>${escape(timestamp(entry.createdAt))}</time><strong class="${entry.amount < 0 ? "negative" : "positive"}">${entry.amount > 0 ? "+" : entry.amount < 0 ? "−" : ""}${escape(formatRupiah(Math.abs(entry.amount)))}</strong></div><p>${escape(kind)} · ${escape(entry.source)}</p><p class="notes">${escape(entry.notes || "—")}</p><small>Dicatat oleh ${escape(entry.actorName)}</small></td>`;
}

/** Complete local HTML document for browser print; user content is always escaped. */
export function buildFinanceReport(snapshot: FinanceSnapshot): string {
  const sides: SavingsSide[] = ["groom", "bride"];
  const history = (side: SavingsSide) =>
    snapshot.entries
      .filter((entry) => entry.side === side)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const histories = [history("groom"), history("bride")] as const;
  const headers = sides
    .map(
      (side) =>
        `<th scope="col">${escape(savingsName(snapshot, side))}<span>${escape(snapshot.members.find((member) => member.side === side)?.actorName || "Belum terhubung")}</span><strong>${escape(formatRupiah(snapshot.balances[side]))}</strong></th>`,
    )
    .join("");
  const rows = Array.from(
    { length: Math.max(1, histories[0].length, histories[1].length) },
    (_, index) => `<tr>${entryCell(histories[0][index])}${entryCell(histories[1][index])}</tr>`,
  ).join("");
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Laporan tabungan pasangan</title><style>
@page{size:A4 landscape;margin:14mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#202a29;font-size:10pt;line-height:1.5;margin:0}header{border-bottom:2px solid #d8e2dc;padding-bottom:16px;margin-bottom:20px}h1{font-size:24pt;margin:0 0 6px}header p{margin:3px 0;color:#53635b}.total{font-size:18pt;color:#1c5c43}table{width:100%;table-layout:fixed;border-collapse:collapse}thead{display:table-header-group}th{width:50%;text-align:left;background:#eef4ef;padding:14px;border:1px solid #d8e2dc;font-size:13pt}th span,th strong{display:block}th span{font-size:10pt;font-weight:normal}th strong{margin-top:6px}td{width:50%;vertical-align:top;padding:12px;border:1px solid #d8e2dc;overflow-wrap:anywhere}tr{break-inside:avoid;page-break-inside:avoid}.entry-head{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}time,small{font-size:9pt;color:#53635b}small{display:block}.positive{color:#147348}.negative{color:#b42335}p{margin:6px 0}.notes{white-space:pre-wrap}.empty{color:#79857e}footer{margin-top:18px;color:#53635b;font-size:9pt}@media print{*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body><header><h1>Laporan tabungan pasangan</h1><p>Dicetak ${escape(timestamp(new Date().toISOString()))} · Revisi ${snapshot.revision}</p><p>Total tabungan bersama</p><strong class="total">${escape(formatRupiah(snapshot.balances.total))}</strong></header><table aria-label="Riwayat tabungan pasangan"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table><footer>Riwayat disusun dari transaksi paling awal. Nominal positif menambah saldo; nominal negatif mengurangi saldo.</footer></body></html>`;
}
