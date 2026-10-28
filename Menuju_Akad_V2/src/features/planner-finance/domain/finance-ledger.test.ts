import { describe, expect, it } from "vitest";
import {
  applyFinanceRequest,
  assertBudgetChanges,
  emptyFinanceBook,
  financeBookSchema,
  financeSnapshot,
} from "./finance-ledger";
import type { FinanceBook, FinanceCommand } from "../types/finance-ledger";

describe("finance ledger", () => {
  const actor = { id: "a", name: "Andi" };
  const now = "2026-10-26T01:00:00Z";
  function run(book: FinanceBook, command: FinanceCommand, id = `r${book.revision}`) {
    return applyFinanceRequest(
      book,
      [{ id: "b", title: "Gedung", amount: 80 }],
      actor,
      { revision: book.revision, requestId: id, command },
      now,
    );
  }
  it("binds one side, rejects cross-side manual edits and overdrafts", () => {
    const book = run(emptyFinanceBook(), { type: "claim", side: "groom" }).book;
    expect(() => run(book, { type: "claim", side: "bride" })).toThrow();
    expect(() =>
      run(book, {
        type: "entry",
        side: "bride",
        direction: "add",
        amount: 100,
        source: "Gaji",
        notes: "",
      }),
    ).toThrow();
    expect(() =>
      run(book, {
        type: "entry",
        side: "groom",
        direction: "subtract",
        amount: 100,
        source: "",
        notes: "Belanja",
      }),
    ).toThrow();
  });
  it("validates amounts, source, reasons, budget transitions and book round trips", () => {
    const book = run(emptyFinanceBook(), { type: "claim", side: "groom" }).book;
    for (const amount of [0, -1, 1.5, 1e12 + 1])
      expect(() =>
        run(book, {
          type: "entry",
          side: "groom",
          direction: "add",
          amount,
          source: "Gaji",
          notes: "",
        }),
      ).toThrow();
    expect(() =>
      run(book, {
        type: "entry",
        side: "groom",
        direction: "add",
        amount: 1,
        source: " ",
        notes: "",
      }),
    ).toThrow();
    expect(() =>
      run(book, {
        type: "entry",
        side: "groom",
        direction: "subtract",
        amount: 1,
        source: "",
        notes: " ",
      }),
    ).toThrow();
    expect(() =>
      run(book, { type: "save-budgets", budgets: [{ id: "b", title: "Gedung", completed: true }] }),
    ).toThrow();
    const old = [{ id: "b", title: "Gedung", amount: 80, completed: true }];
    const allocation = [
      { budgetId: "b", entryId: "fund:entry", side: "groom" as const, amount: 80 },
    ];
    expect(() => assertBudgetChanges(old, [{ ...old[0]!, amount: 81 }], allocation)).toThrow();
    expect(() =>
      assertBudgetChanges(old, [{ ...old[0]!, completed: false }], allocation),
    ).toThrow();
    expect(() => assertBudgetChanges(old, [], allocation)).toThrow();
    expect(() =>
      assertBudgetChanges(old, [{ ...old[0]!, notes: "Catatan" }], allocation),
    ).not.toThrow();
    expect(() => assertBudgetChanges(old, old, [])).not.toThrow();
    const longId = run(
      book,
      { type: "entry", side: "groom", direction: "add", amount: 1, source: "Gaji", notes: "" },
      "x".repeat(160),
    );
    expect(financeBookSchema.parse(longId.book)).toEqual(longId.book);
  });
  it("allows either claimed member to allocate either side, retries before revision checks and reverses exactly once", () => {
    let book = run(emptyFinanceBook(), { type: "claim", side: "groom" }).book;
    const command: FinanceCommand = {
      type: "entry",
      side: "groom",
      direction: "add",
      amount: 100,
      source: "Gaji",
      notes: "",
    };
    const request = { revision: book.revision, requestId: "deposit", command };
    book = applyFinanceRequest(book, [], actor, request, now).book;
    expect(applyFinanceRequest(book, [], actor, request, now).book).toBe(book);
    expect(() =>
      applyFinanceRequest(
        book,
        [],
        actor,
        { ...request, command: { ...command, amount: 200 } },
        now,
      ),
    ).toThrow();
    book = applyFinanceRequest(
      book,
      [],
      { id: "b", name: "Risa" },
      { revision: book.revision, requestId: "claim2", command: { type: "claim", side: "bride" } },
      now,
    ).book;
    const funded = applyFinanceRequest(
      book,
      [{ id: "b", title: "Gedung", amount: 80 }],
      { id: "b", name: "Risa" },
      {
        revision: book.revision,
        requestId: "fund",
        command: { type: "allocate", budgetId: "b", side: "groom" },
      },
      now,
    );
    expect(financeSnapshot(funded.book, funded.budgets, "b").balances.groom).toBe(20);
    expect(() =>
      applyFinanceRequest(
        funded.book,
        funded.budgets,
        actor,
        {
          revision: funded.book.revision,
          requestId: "again",
          command: { type: "allocate", budgetId: "b", side: "groom" },
        },
        now,
      ),
    ).toThrow();
    const released = applyFinanceRequest(
      funded.book,
      funded.budgets,
      actor,
      {
        revision: funded.book.revision,
        requestId: "release",
        command: { type: "delete-budget", budgetId: "b" },
      },
      now,
    );
    expect(released.budgets).toEqual([]);
    expect(financeSnapshot(released.book, [], "a").balances.groom).toBe(100);
    expect(released.book.entries.at(-1)?.reverses).toBe("fund:entry");
  });
});
