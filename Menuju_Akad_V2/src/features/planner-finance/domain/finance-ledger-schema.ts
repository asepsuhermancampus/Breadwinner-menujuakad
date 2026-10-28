import { z } from "zod";
import { customerBudgetSchema } from "./customer-budget-schema";
const id = z.string().min(1).max(160);
const entryId = z.string().min(1).max(180);
const side = z.enum(["groom", "bride"]);
export const rupiah = z.number().int().positive().max(1e12);
const budgetsSchema = z
  .array(customerBudgetSchema)
  .max(10000)
  .refine(
    (rows) => new Set(rows.map((row) => row.id)).size === rows.length,
    "ID anggaran duplikat",
  );
export const financeRequestSchema = z
  .object({
    revision: z.number().int().nonnegative(),
    requestId: id,
    command: z.discriminatedUnion("type", [
      z.object({ type: z.literal("claim"), side }).strict(),
      z
        .object({
          type: z.literal("entry"),
          side,
          direction: z.enum(["add", "subtract"]),
          amount: rupiah,
          source: z.string().max(200),
          notes: z.string().max(2000),
        })
        .strict(),
      z.object({ type: z.literal("save-budgets"), budgets: budgetsSchema }).strict(),
      z.object({ type: z.literal("allocate"), budgetId: id, side }).strict(),
      z.object({ type: z.literal("release"), budgetId: id }).strict(),
      z.object({ type: z.literal("delete-budget"), budgetId: id }).strict(),
    ]),
  })
  .strict();
export const financeBookSchema = z.object({
  id: z.literal("finance-book"),
  revision: z.number().int().nonnegative(),
  members: z.array(z.object({ actorId: id, actorName: z.string().min(1).max(160), side })),
  entries: z.array(
    z.object({
      id: entryId,
      side,
      amount: z
        .number()
        .int()
        .min(-1e12)
        .max(1e12)
        .refine((value) => value !== 0),
      kind: z.enum(["deposit", "withdrawal", "allocation", "reversal"]),
      source: z.string().max(200),
      notes: z.string().max(2000),
      createdAt: z.iso.datetime({ offset: true }),
      actorId: id,
      actorName: z.string().min(1).max(160),
      budgetId: id.nullable(),
      reverses: entryId.nullable(),
    }),
  ),
  allocations: z.array(z.object({ budgetId: id, entryId, side, amount: rupiah })),
  receipts: z.array(z.object({ requestId: id, actorId: id, fingerprint: z.string() })),
});
