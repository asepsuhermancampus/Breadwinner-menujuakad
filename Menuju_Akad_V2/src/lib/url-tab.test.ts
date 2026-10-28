import { expect, it } from "vitest";
import { readUrlTab, urlWithTab } from "./url-tab";
it("restores only known tabs, including existing finance deep links", () => {
  const values = ["Ringkasan", "Tabungan", "Anggaran"] as const;
  expect(readUrlTab("?tab=anggaran", "tab", values, "Ringkasan")).toBe("Anggaran");
  expect(readUrlTab("?tab=unknown", "tab", values, "Ringkasan")).toBe("Ringkasan");
  expect(readUrlTab("", "tab", values, "Ringkasan")).toBe("Ringkasan");
});
it("preserves route, unrelated parameters, nested tab selections and hashes", () => {
  const next = urlWithTab(
    "https://menujuakad.com/planner/finance?category=Katering&context=wedding#list",
    "tab",
    "Anggaran",
  );
  const parsed = new URL(next, "https://menujuakad.com");
  expect(parsed.pathname).toBe("/planner/finance");
  expect(parsed.searchParams.get("category")).toBe("Katering");
  expect(parsed.searchParams.get("context")).toBe("wedding");
  expect(parsed.searchParams.get("tab")).toBe("Anggaran");
  expect(parsed.hash).toBe("#list");
});
