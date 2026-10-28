import { expect, it, vi } from "vitest";
import { validateTrialData } from "./trial-validation";
import { validateResource } from "@/server/workspaces/resource-policy";
import type { SubscriptionSnapshot } from "@/features/plans/domain/subscription";

vi.mock("server-only", () => ({}));

const target = {
  id: "target-1",
  title: "Gedung",
  amount: 25000000,
  notes: "Uang muka dan pelunasan",
  purpose: "Dana resepsi",
  createdAt: "2026-10-26T17:30:00.000Z",
  dueDate: "2027-02-28",
  priority: "Tinggi",
  completed: true,
};

const validators = [
  ["trial", (rows: unknown) => validateTrialData("finance", rows)],
  [
    "account",
    (rows: unknown) =>
      validateResource("finance", rows, { capabilities: [] } as unknown as SubscriptionSnapshot),
  ],
] as const;

for (const [name, validate] of validators) {
  it(`${name} retains budget target metadata`, () => {
    expect(validate([target])).toEqual([target]);
  });

  it(`${name} accepts legacy budgets without inventing dates or status`, () => {
    const legacy = { id: "legacy", title: "a".repeat(2000), amount: 0, notes: "Existing" };
    expect(validate([legacy])).toEqual([legacy]);
  });

  it.each([
    { dueDate: "2026-02-29" },
    { dueDate: "2026-10-26T00:00:00Z" },
    { createdAt: "2026-02-30T12:00:00Z" },
    { createdAt: "2026-10-26" },
    { priority: "Urgent" },
    { purpose: "a".repeat(201) },
    { completed: "true" },
    { amount: 1.5 },
    { amount: -1 },
    { amount: 1000000000001 },
  ])(`${name} rejects invalid target fields: %j`, (invalid) => {
    expect(() => validate([{ ...target, ...invalid }])).toThrow();
  });
}
