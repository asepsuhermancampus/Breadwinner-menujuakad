import type { CustomerBudget } from "../types/customer-budget";
type Detail = { label: string; value: string };
const date = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});
function formatDate(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+07:00` : value);
  return Number.isNaN(parsed.getTime()) ? fallback : date.format(parsed);
}
const detailLabels = new Set([
  "Jenis",
  "Vendor",
  "Isi paket",
  "Jumlah",
  "Harga paket",
  "Harga per tamu",
  "Harga per porsi",
  "Harga satuan",
  "Harga total",
]);
export function budgetDescription(item: CustomerBudget) {
  const information: Detail[] = [
    { label: "Kategori", value: item.category?.trim() || "Lainnya" },
    { label: "Tujuan", value: item.purpose?.trim() || "Belum ditentukan" },
    { label: "Tenggat pembayaran", value: formatDate(item.dueDate, "Belum ditentukan") },
    { label: "Prioritas", value: item.priority ?? "Normal" },
    { label: "Status", value: item.completed ? "Tercapai" : "Belum tercapai" },
    {
      label: "Sumber catatan",
      value:
        item.source?.kind === "catering"
          ? "Katering"
          : item.source?.kind === "seserahan"
            ? "Seserahan"
            : "Catatan anggaran manual",
    },
    { label: "Dibuat pada", value: formatDate(item.createdAt, "Belum tercatat") },
  ];
  const details: Detail[] = [];
  for (const line of item.sourceDetails?.split("\n") ?? []) {
    const separator = line.indexOf(": "),
      label = line.slice(0, separator);
    if (separator >= 0 && detailLabels.has(label)) {
      if (label !== "Harga total") details.push({ label, value: line.slice(separator + 2) });
    } else if (details.length) details[details.length - 1]!.value += `\n${line}`;
    else if (line.trim()) details.push({ label: "Detail", value: line });
  }
  details.push({
    label: "Harga total",
    value: item.amount === undefined ? "Belum diisi" : `Rp ${item.amount.toLocaleString("id-ID")}`,
  });
  return { information, details, notes: item.notes?.trim() ?? "" };
}
