import { expect, it } from "vitest";
import { emptyFinanceBook, financeSnapshot } from "./finance-ledger";
import { savingsName } from "./savings-name";
import { buildFinanceReport } from "./finance-report";

it("uses account-derived names consistently and escapes them in the PDF", () => {
  const snapshot = financeSnapshot(emptyFinanceBook(), [], "owner");
  expect(savingsName(snapshot, "groom")).toBe("Pasangan pria");
  expect(savingsName(snapshot, "bride", true)).toBe("pasangan wanita");
  snapshot.sideNames = { groom: " Dimas ", bride: '<img src=x onerror="alert(1)">' };
  expect(savingsName(snapshot, "groom")).toBe("Dimas");
  const report = buildFinanceReport(snapshot);
  expect(report).toContain("Dimas");
  expect(report).not.toContain("<img");
  expect(report).toContain("&lt;img");
});
