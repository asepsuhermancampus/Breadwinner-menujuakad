import { expect, it, vi } from "vitest";
import { buildPrintableReport } from "./pdf-report";
vi.mock("server-only", () => ({}));
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
