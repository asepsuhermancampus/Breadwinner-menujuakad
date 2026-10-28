import { describe, expect, it } from "vitest";
import {
  applyFinanceRequest,
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
  it("rejects side and combined balance overflow without changing the book", () => {
    const book = run(emptyFinanceBook(), { type: "claim", side: "groom" }).book;
    let remaining = Number.MAX_SAFE_INTEGER - 1;
    while (remaining > 0) {
      const amount = Math.min(remaining, 1e12);
      book.entries.push({
        id: `seed-${book.entries.length}`,
        side: "groom",
        amount,
        kind: "deposit",
        source: "Gaji",
        notes: "",
        createdAt: now,
        actorId: actor.id,
        actorName: actor.name,
        budgetId: null,
        reverses: null,
      });
      remaining -= amount;
    }
    expect(financeBookSchema.safeParse(book).success).toBe(true);
    const entry = {
      type: "entry" as const,
      side: "groom" as const,
      direction: "add" as const,
      amount: 2,
      source: "Gaji",
      notes: "",
    };
    expect(() => run(book, entry)).toThrow("batas");
    expect(financeSnapshot(book, [], actor.id).balances.total).toBe(Number.MAX_SAFE_INTEGER - 1);
    book.entries[0]!.side = "bride";
    expect(() => run(book, entry)).toThrow("batas");
    const exact = run(book, { ...entry, amount: 1 });
    expect(financeSnapshot(exact.book, [], actor.id).balances.total).toBe(Number.MAX_SAFE_INTEGER);
  });
});
