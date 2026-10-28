import type { TrialSnapshot } from "../types";
const escape = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function budgetDetails(item: Record<string, unknown>): string {
  const date = (value: unknown, dateOnly = false) => {
    if (typeof value !== "string" || !value) return "Belum ditentukan";
    const parsed = new Date(dateOnly ? `${value}T00:00:00Z` : value);
    return Number.isNaN(parsed.getTime())
      ? "Belum ditentukan"
      : parsed.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: dateOnly ? "UTC" : "Asia/Jakarta",
        });
  };
  return [
    item.title,
    item.purpose ? `Tujuan: ${item.purpose}` : undefined,
    typeof item.amount === "number"
      ? `Target nominal: Rp ${item.amount.toLocaleString("id-ID")}`
      : undefined,
    `Tanggal dibuat: ${date(item.createdAt)}`,
    `Tenggat: ${date(item.dueDate, true)}`,
    `Prioritas: ${item.priority ?? "Normal"}`,
    item.completed === true ? "Dana terkumpul" : "Dana belum terkumpul",
    item.notes ? `Deskripsi: ${item.notes}` : undefined,
  ]
    .filter((value) => value !== undefined)
    .map(escape)
    .join(" / ");
}

export function trialReport(snapshot: TrialSnapshot): string {
  const labels: Record<string, string> = {
    tasks: "Tugas",
    documents: "Dokumen KUA",
    guests: "Tamu",
    finance: "Anggaran",
    calendar: "Kalender",
    rundown: "Rundown",
    seserahan: "Seserahan",
    emergency: "Emergency",
    catering: "Catering",
  };
  return (
    '<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Rencana kalian</title><style>body{font:14px system-ui;margin:40px}li{padding:8px}h2{break-after:avoid}li{break-inside:avoid}</style></head><body><h1>Rencana kalian</h1>' +
    Object.entries(labels)
      .map(
        ([kind, label]) =>
          "<section><h2>" +
          label +
          "</h2><ul>" +
          ((snapshot.resources[kind as keyof typeof snapshot.resources] ?? [])
            .filter((row) => kind !== "documents" || !(row as { archived?: boolean }).archived)
            .map(
              (row) =>
                "<li>" +
                (kind === "finance"
                  ? budgetDetails(row as Record<string, unknown>)
                  : Object.entries(row as Record<string, unknown>)
                      .filter(([key]) => !["id", "personalToken", "waConsent"].includes(key))
                      .filter(
                        ([key]) =>
                          kind !== "documents" || ["title", "completed", "notes"].includes(key),
                      )
                      .filter(([, v]) => typeof v !== "object")
                      .map(([, v]) =>
                        escape(typeof v === "boolean" ? (v ? "Selesai" : "Belum selesai") : v),
                      )
                      .join(" / ")) +
                "</li>",
            )
            .join("") || "<li>Belum ada data.</li>") +
          "</ul></section>",
      )
      .join("") +
    "</body></html>"
  );
}
