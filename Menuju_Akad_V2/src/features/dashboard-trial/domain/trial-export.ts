import type { TrialSnapshot } from "../types";
const escape = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
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
            .map(
              (row) =>
                "<li>" +
                Object.entries(row as Record<string, unknown>)
                  .filter(([key]) => !["id", "personalToken", "waConsent"].includes(key))
                  .filter(([, v]) => typeof v !== "object")
                  .map(([, v]) =>
                    escape(typeof v === "boolean" ? (v ? "Selesai" : "Belum selesai") : v),
                  )
                  .join(" / ") +
                "</li>",
            )
            .join("") || "<li>Belum ada data.</li>") +
          "</ul></section>",
      )
      .join("") +
    "</body></html>"
  );
}
