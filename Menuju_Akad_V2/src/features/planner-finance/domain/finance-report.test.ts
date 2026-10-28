import { describe, expect, it } from "vitest";
import type { FinanceEntry, FinanceSnapshot } from "../types/finance-ledger";
import { buildFinanceReport } from "./finance-report";

function snapshot(entries: FinanceEntry[] = []): FinanceSnapshot {
  return {
    revision: 2,
    budgets: [],
    allocations: [],
    entries,
    members: [
      { actorId: "a", actorName: "Pria", side: "groom" },
      { actorId: "b", actorName: "Wanita", side: "bride" },
    ],
    balances: { groom: 1000, bride: 2000, total: 3000 },
    actorSide: "groom",
  };
}
function entry(id: string, overrides: Partial<FinanceEntry> = {}): FinanceEntry {
  return {
    id,
    side: "groom",
    amount: 1000,
    kind: "deposit",
    source: "Gaji",
    notes: `Catatan ${id}`,
    actorName: "Nama pencatat",
    actorId: "actor",
    createdAt: "2026-10-26T02:03:04Z",
    budgetId: null,
    reverses: null,
    ...overrides,
  };
}

describe("printable savings report", () => {
  it("pairs full chronological histories, including allocations and reversals", () => {
    const data = snapshot([
      entry("later"),
      entry("earlier", {
        createdAt: "2026-10-25T02:03:04Z",
        amount: -500,
        kind: "allocation",
        budgetId: "budget-id",
      }),
      entry("bride", { side: "bride", kind: "reversal", reverses: "original-id" }),
    ]);
    const html = buildFinanceReport(data);
    expect(html.indexOf("Catatan earlier")).toBeLessThan(html.indexOf("Catatan later"));
    expect(html).toContain('class="negative">−Rp 500');
    expect(html).toContain('class="positive">+Rp 1.000');
    expect(html).toContain("Alokasi anggaran");
    expect(html).toContain("Pengembalian anggaran");
    expect(html).not.toContain("original-id");
    expect(html).not.toContain("budget-id");
    expect(html).toContain("Nama pencatat");
    expect(html).toContain("Gaji");
    expect(html).toContain("WIB");
    expect(html).toContain("Rp 3.000");
    expect(html.match(/<th scope="col">/g)).toHaveLength(2);
    expect(html).toContain("size:A4 landscape");
    expect(html).toContain("display:table-header-group");
    expect(html).toContain("break-inside:avoid");
  });
  it("escapes every dynamic text field while preserving Unicode and long notes", () => {
    const hostile = '<script>alert("x")</script>&\' keluarga 💚 العربية';
    const data = snapshot([
      entry("unsafe", {
        source: hostile,
        notes: hostile.repeat(300),
        actorId: hostile,
        actorName: hostile,
        budgetId: hostile,
        reverses: hostile,
      }),
    ]);
    data.members[0]!.actorName = hostile;
    const html = buildFinanceReport(data);
    expect(html).not.toContain("<script>");
    expect(html).toContain(
      "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;&amp;&#39; keluarga 💚 العربية",
    );
    expect(html.match(/keluarga 💚 العربية/g)?.length).toBe(303);
    expect(html).toContain("white-space:pre-wrap");
  });
  it("never truncates ledger history and renders zero balances and empty sides", () => {
    const data = snapshot(Array.from({ length: 120 }, (_, index) => entry(`record-${index}`)));
    data.balances = { groom: 0, bride: 0, total: 0 };
    const html = buildFinanceReport(data);
    expect(html).toContain("Catatan record-119");
    expect(html.match(/<tr>/g)).toHaveLength(121);
    expect(html.match(/Rp 0/g)).toHaveLength(3);
    expect(buildFinanceReport(snapshot())).toContain('<td class="empty">—</td>');
  });
});
