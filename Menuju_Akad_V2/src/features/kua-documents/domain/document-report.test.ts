import { expect, it } from "vitest";
import { buildDocumentCsv, buildDocumentReport } from "./document-report";
it("exports only active documents with status and safe untrusted text", () => {
  const rows = [
    {
      id: "1",
      title: '=HYPERLINK("x")',
      notes: "<script>bad()</script>",
      group: "additional" as const,
      completed: true,
    },
    { id: "2", title: "Hidden", archived: true },
  ];
  const html = buildDocumentReport(rows);
  expect(html).toContain("&lt;script&gt;");
  expect(html).not.toContain("<script>bad");
  expect(html).not.toContain("Hidden");
  expect(html).toContain("Siap");
  const csv = buildDocumentCsv(rows);
  expect(csv).toContain("'=HYPERLINK");
  expect(csv).not.toContain("Hidden");
});
