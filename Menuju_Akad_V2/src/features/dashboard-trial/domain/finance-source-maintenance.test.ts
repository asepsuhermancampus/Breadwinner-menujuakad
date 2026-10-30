import { expect, it } from "vitest";
import { affectedExpenseSources } from "./finance-source-maintenance";
it("identifies only maintained source kinds removed by finance commands", () => {
  const budgets = [
    { id: "a", source: { kind: "catering", id: "menu" } },
    { id: "b", source: { kind: "seserahan", id: "gift" } },
  ] as never;
  expect(affectedExpenseSources({ type: "delete-budget", budgetId: "a" }, budgets)).toEqual([
    "catering",
  ]);
  expect(
    affectedExpenseSources({ type: "save-budgets", budgets: [{ id: "a" }] as never }, budgets),
  ).toEqual(["seserahan"]);
  expect(affectedExpenseSources({ type: "claim", side: "groom" }, budgets)).toEqual([]);
});
