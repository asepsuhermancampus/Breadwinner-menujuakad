import { activeDocuments, type DocumentItem } from "./document-template";
import { documentSource } from "./template-catalog";
function escape(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!,
  );
}
export function buildDocumentCsv(items: DocumentItem[]) {
  const cell = (value: string) =>
    `"${(/^[=+\-@\t\r]/.test(value) ? "'" + value : value).replace(/"/g, '""')}"`;
  return (
    "\uFEFF" +
    [
      ["Kategori", "Berkas", "Status", "Catatan"],
      ...activeDocuments(items).map((item) => [
        item.group === "main" ? "Wajib" : "Opsional / sesuai kondisi",
        item.title,
        item.completed ? "Siap" : "Belum siap",
        item.notes ?? "",
      ]),
    ]
      .map((row) => row.map(cell).join(","))
      .join("\r\n")
  );
}
export function buildDocumentReport(items: DocumentItem[]) {
  const active = activeDocuments(items),
    count = active.filter((item) => item.completed).length;
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><title>Checklist persyaratan KUA</title><style>
  @page{size:A4;margin:16mm}*{box-sizing:border-box}body{font:13px/1.6 Arial,sans-serif;color:#173e33;margin:0}h1{font-size:26px;margin:0 0 8px}header{border-bottom:2px solid #087f5b;padding-bottom:16px;margin-bottom:24px}p{margin:6px 0;color:#52645e}h2{font-size:17px;margin-top:26px}table{border-collapse:collapse;width:100%;table-layout:fixed}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid #d6e7df;overflow-wrap:anywhere}th{background:#edf8f2;font-size:11px;text-transform:uppercase}th:first-child{width:65%}small{display:block;color:#52645e;white-space:pre-wrap}tr{break-inside:avoid}footer{margin-top:28px;font-size:10px;color:#52645e}a{color:#087f5b}</style></head><body><header><h1>Checklist persyaratan KUA</h1><p>${count} dari ${active.length} berkas siap · ${new Date().toLocaleDateString("id-ID")}</p></header>${(
    ["main", "additional"] as const
  )
    .map((group) => {
      const rows = active.filter((item) => (item.group ?? "additional") === group);
      return rows.length
        ? `<section><h2>${group === "main" ? "Berkas wajib" : "Berkas opsional / sesuai kondisi"}</h2><table><thead><tr><th>Berkas dan catatan</th><th>Status</th></tr></thead><tbody>${rows.map((item) => `<tr><td>${escape(item.title)}${item.notes ? `<small>${escape(item.notes)}</small>` : ""}</td><td>${item.completed ? "Siap" : "Belum siap"}</td></tr>`).join("")}</tbody></table></section>`
        : "";
    })
    .join(
      "",
    )}<footer>Checklist persiapan mandiri. Persyaratan kondisional mengikuti keadaan calon pengantin. <a href="${escape(documentSource)}">Rujukan peraturan pencatatan pernikahan</a>.</footer></body></html>`;
}
