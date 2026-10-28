import { expect, it, vi } from "vitest";
import { buildPrintableReport } from "./pdf-report";
vi.mock("server-only", () => ({}));
it("prints budget metadata with Indonesian dates and funds-collected status safely", () => {
  const html = buildPrintableReport("Pasangan", {
    finance: [
      {
        title: "<script>target</script>",
        purpose: "<img src=x>",
        notes: "<b>catatan</b>",
        amount: 1250000,
        createdAt: "2026-10-26T18:00:00Z",
        dueDate: "2026-10-28",
        priority: "Tinggi",
        completed: true,
      },
      { title: "Legacy" },
    ],
  });
  for (const text of [
    "Target nominal: Rp 1.250.000",
    "Tujuan: &lt;img src=x&gt;",
    "Deskripsi: &lt;b&gt;catatan&lt;/b&gt;",
    "Tanggal dibuat: 27 Oktober 2026",
    "Tenggat: 28 Oktober 2026",
    "Prioritas: Tinggi",
    "Dana terkumpul",
    "Dana belum terkumpul",
    "&lt;script&gt;target&lt;/script&gt;",
  ])
    expect(html).toContain(text);
  expect(html).not.toContain("<script>");
  expect(html).not.toContain("<img");
  expect(html).toContain("Tanggal dibuat: Belum ditentukan");
  expect(html).toContain("Tenggat: Belum ditentukan");
  expect(html).toContain("Prioritas: Normal");
});
it("prints actual account data and escapes HTML", () => {
  const html = buildPrintableReport("Asep <script>", {
    guests: [{ name: "Tamu asli" }],
    tasks: [{ title: "Pesan gedung" }],
    finance: [{ title: "Gedung", amount: 29000 }],
  });
  expect(html).toContain("Tamu asli");
  expect(html).toContain("29.000");
  expect(html).not.toContain("<script>");
  expect(html).toContain("&lt;script&gt;");
});
it("excludes removed template documents and internal metadata", () => {
  const html = buildPrintableReport("Pasangan", {
    documents: [
      { id: "hidden", title: "Berkas dihapus", archived: true, templateId: "outside" },
      { id: "active", title: "Berkas aktif", group: "main", templateId: "main" },
    ],
  });
  expect(html).toContain("Berkas aktif");
  expect(html).not.toContain("Berkas dihapus");
  expect(html).not.toContain("outside");
});
