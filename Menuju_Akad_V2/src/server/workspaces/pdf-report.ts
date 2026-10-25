import "server-only";
const escapeHtml = (value: unknown) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
export function buildPrintableReport(name: string, resources: Record<string, unknown[]>): string {
  const labels: Record<string, string> = {
    guests: "Daftar tamu",
    tasks: "Checklist tugas",
    finance: "Anggaran",
    documents: "Dokumen",
  };
  const fields = ["name", "title", "quota", "rsvpStatus", "amount", "completed", "notes"];
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Rencana Menuju Akad</title><style>body{font:14px system-ui;max-width:900px;margin:40px auto;padding:20px;color:#14382b}h1,h2{break-after:avoid}li{padding:8px;border-bottom:1px solid #ddd;break-inside:avoid}small{color:#555}@media print{body{margin:0;padding:0}h2{margin-top:24px}}</style></head><body><h1>Rencana ${escapeHtml(name || "kalian")}</h1><small>Dokumen dari data akun · Gunakan Cetak / Simpan sebagai PDF pada browser.</small>${Object.entries(
    resources,
  )
    .map(
      ([kind, rows]) =>
        `<section><h2>${escapeHtml(labels[kind] ?? kind)}</h2><ul>${
          rows
            .map((row) => {
              const item = row as Record<string, unknown>;
              return `<li>${fields
                .filter((field) => field in item)
                .map((field) =>
                  escapeHtml(
                    field === "amount"
                      ? `Rp ${Number(item[field]).toLocaleString("id-ID")}`
                      : typeof item[field] === "boolean"
                        ? item[field]
                          ? "Selesai"
                          : "Belum selesai"
                        : item[field],
                  ),
                )
                .join(" · ")}</li>`;
            })
            .join("") || "<li>Belum ada data.</li>"
        }</ul></section>`,
    )
    .join("")}</body></html>`;
}
